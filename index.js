/* jslint node: true */
"use strict";

global.modulesCache = global.modulesCache || {};
if(global.modulesCache['json.decycled']){
  return;
} else {
  global.modulesCache['json.decycled'] = true;
}

JSON.decycler = decycler;
JSON.decycled = decycled;
JSON.reviver = reviver;
JSON.revive = revive;

function decycler(val,deep){
  var config = typeof deep === 'number'?{deep:deep}:(deep || {});
  config.deep = config.deep || 10;
  return decycleWalker([],[],val,config);
}
function decycled(val,deep,spacer){
  var config = typeof deep === 'number'?{deep:deep}:(deep || {});
  spacer = spacer || config.spacer;
  val = decycler(val,config);
  return JSON.stringify(val,undefined,spacer);
}

var reviverTimeStamp = /^\[TimeStamp:([0-9]+)\]$/;
var reviverRegExp = /^\[Regexp:\/(.+)\/\]$/;
var reviverError = /^\[Error:([\w\W]+)\]$/;
function reviver(key,val){
  if(reviverTimeStamp.test(val)){
    val = parseInt(reviverTimeStamp.exec(val)[1],10);
    return new Date(val);
  } else if(reviverRegExp.test(val)){
    val = reviverRegExp.exec(val)[1];
    return new RegExp(val);
  } else if(reviverError.test(val)){
    val = reviverError.exec(val)[1];
    return new Error(val);
  } else {
    return val;
  }
}
function revive(val){
    return JSON.parse(val,reviver);
}

function decycleWalker(parents,path,val,config){
  if(['undefined','number','boolean','string'].indexOf(typeof val)>=0 || val === null){
    return val;
  } else if(typeof val === 'object' && val.constructor === Date){
    return config.dates!==false?'[TimeStamp:'+val.getTime()+']':val.format('{YYYY}/{MM}/{DD} {hh}:{mm}:{ss}',true);
    //val.format('{YYYY}/{MM}/{DD} {hh}:{mm}:{ss} UTC:·{params.tz>=0?"+"+params.tz:params.tz}·');
  } else if(typeof val === 'object' && val.constructor === RegExp){
    return config.regexps!==false?'[Regexp:'+val.toString()+']':val;
  } else if(typeof val === 'object' && typeof val.constructor.name === 'string' && val.constructor.name.slice(-5)==='Error'){
    return config.errors!==false?'[Error:'+(val.stack?val.stack.trim():val?val.toString().trim():val)+']':val;
  } else if(typeof val === 'object'){
    if(parents.indexOf(val) >= 0){
      var point = path.slice(0,parents.indexOf(val)).join('.');
      return '[Circular'+(point?':'+point:'')+']';
    } else {
      var copy,i,k,l;
      if(typeof val.constructor.name === 'string' && val.constructor.name.slice(-5)==='Array'){
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
          return '[Object:'+(val.constructor.name?val.constructor.name:'Object')+']';
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
    return config.functions===true?'[Function:'+(val.name?val.name:'<anonymous>')+']':undefined;
  } else {
    return val.toString();
  }
}
