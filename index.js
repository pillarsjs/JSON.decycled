/* jslint node: true */
"use strict";

require("date.format");
global.modulesCache = global.modulesCache || {};
if(global.modulesCache['json.decycled']){
  return;
} else {
  global.modulesCache['json.decycled'] = true;
}

JSON.decycler = decycler;
JSON.decycled = decycled;
JSON.revive = revive;

function decycler(val,config){
  config = typeof config === 'number'?{deep:config}:(config || {});
  config.deep = config.deep || 10;
  return decycleWalker([],[],val,config);
}
function decycled(val,config){
  config = typeof config === 'number'?{deep:config}:(config || {});
  val = decycler(val,config);
  try {
    return JSON.stringify(val,undefined,config.spacer);
  } catch(e){
    return e;
  }
}

var reviverDate = /^\[Date:((\d{4})\/(\d{2})\/(\d{2}) (\d{2})\:(\d{2})\:(\d{2})\:(\d{4})) UTC\]$/;
var reviverRegExp = /^\[Regexp:\/(.+)\/\]$/;
var reviverError = /^\[Error:([\W\w]+)\]$/;
var reviverFunction = /^\[Function:(.+)\]$/;
function revive(val,functions){
  try {
    return JSON.parse(val,reviver);
  } catch(e){
    return e;
  }
  
  function reviver(key,val){
    if(reviverDate.test(val)){
      val = reviverDate.exec(val);
      val = Date.UTC(val[2],parseInt(val[3],10)-1,val[4],val[5],val[6],val[7],val[8]);
      return new Date(val);
    } else if(reviverRegExp.test(val)){
      val = reviverRegExp.exec(val)[1];
      return new RegExp(val);
    } else if(reviverError.test(val)){
      val = reviverError.exec(val)[1];
      var error = new Error(val.split('\n')[0]);
      if(error.stack){
        error.stack = val;
      }
      return error;
    } else if(functions && reviverFunction.test(val)){
      val = reviverFunction.exec(val)[1];
      try {
        return (new Function("return "+val+";"))();
      } catch(error){
        return error;
      }
    } else {
      return val;
    }
  }
}

function decycleWalker(parents,path,val,config){
  if(['undefined','number','boolean','string'].indexOf(typeof val)>=0 || val === null){
    return val;
  } else if(typeof val === 'object' && val.constructor === Date){
    return config.dates!==false?'[Date:'+val.format('{YYYY}/{MM}/{DD} {hh}:{mm}:{ss}:{mss} UTC',true)+']':val;
    //val.format('{YYYY}/{MM}/{DD} {hh}:{mm}:{ss} UTC:·{params.tz>=0?"+"+params.tz:params.tz}·');
  } else if(typeof val === 'object' && val.constructor === RegExp){
    return config.regexps!==false?'[Regexp:'+val.toString()+']':val;
  } else if(typeof val === 'object' && val.constructor && typeof val.constructor.name === 'string' && val.constructor.name.slice(-5)==='Error'){
    var stack = (val.stack || '').split('\n').slice(1);
    var message = (val.message || val.toString());
    var error = message+"\n"+stack;
    return config.errors!==false?'[Error:'+error+']':val;
  } else if(typeof val === 'object'){
    if(parents.indexOf(val) >= 0){
      var point = path.slice(0,parents.indexOf(val)).join('.');
      return '[Circular'+(point?':'+point:'')+']';
    } else {
      var copy,i,k,l;
      if(val.constructor && typeof val.constructor.name === 'string' && val.constructor.name.slice(-5)==='Array'){
        if(parents.length>=config.deep){
          return '[Array:'+val.constructor.name+']';
        } else {
          copy = [];
          for(i=0,l=val.length;i<l;i++){
            copy[i]=decycleWalker(parents.concat([val]),path.concat(i),val[i],config);
          }
          return copy;
        }
      } else {
        if(parents.length>=config.deep){
          return '[Object:'+(val.constructor && val.constructor.name?val.constructor.name:'Object')+']';
        } else {
          copy = {};
          for(i=0,k=Object.keys(val),l=k.length;i<l;i++){
            copy[k[i]]=decycleWalker(parents.concat([val]),path.concat([k[i]]),val[k[i]],config);
          }
          return copy;
        }
      }
    }
  } else if(typeof val === 'function') {
    return config.functions===true?'[Function:'+val.toString()+']':undefined;
  } else {
    return val.toString();
  }
}
