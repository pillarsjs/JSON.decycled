/* jslint node: true */
"use strict";

JSON.decycler = decycler;
JSON.decycled = decycled;
JSON.reviver = reviver;
JSON.revive = revive;

function decycler(val,functions,deep){
  deep = deep || 10;
  return decycleWalker([],[],val,functions,deep);
}
function decycled(val,functions,deep){
  val = decycler(val,deep);
  return JSON.stringify(val);
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

function decycleWalker(parents,path,val,functions,deep){
  if(['undefined','number','boolean','string'].indexOf(typeof val)>=0 || val === null){
    return val;
  } else if(typeof val === 'object' && val.constructor === Date){
    return '[TimeStamp:'+val.getTime()+']';
  } else if(typeof val === 'object' && val.constructor === RegExp){
    return '[Regexp:'+val.toString()+']';
  } else if(typeof val === 'object' && typeof val.constructor.name === 'string' && val.constructor.name.slice(-5)==='Error'){
      return '[Error:'+(val.stack?val.stack.trim():val?val.toString().trim():val)+']';
  } else if(typeof val === 'object'){
    if(parents.indexOf(val) >= 0){
       var point = path.slice(0,parents.indexOf(val)).join('.');
           return '[Circular'+(point?':'+point:'')+']';
    } else {
      var copy,i,k,l;
      if(typeof val.constructor.name === 'string' && val.constructor.name.slice(-5)==='Array'){
        if(parents.length>deep){
          return '[Array:'+val.constructor.name+']';
        } else {
          copy = [];
          for(i=0,l=val.length;i<l;i++){
            copy[i]=decycleWalker(parents.concat([val]),path.concat(i),val[i],deep);
          }
          return copy;
        }
      } else {
        if(parents.length>deep){
          return '[Object:'+(val.constructor.name?val.constructor.name:'Object')+']';
        } else {
          copy = {};
          for(i=0,k=Object.keys(val),l=k.length;i<l;i++){
            copy[k[i]]=decycleWalker(parents.concat([val]),path.concat([k[i]]),val[k[i]],deep);
          }
          return copy;
        }
      }
    }
  } else if(typeof val === 'function') {
      return functions?'[Function:'+(val.name?val.name:'<anonymous>')+']':undefined;
  } else {
    return val.toString();
  }
}

/* --------------------------------- *
var obj = {
  a: {
    a1:{
      'String': "String",
      'undefined': undefined,
      'Number': 14,
      'null': null,
      'Boolean': true,
      'Date': new Date(),
      'Regexp': /x+/,
      'Error': new Error('Opss'),
      'Array': [1,2,3,4,5],
      'function': function Hello(){}
    },
    a2:{
      'List': [
        {x:'X1',y:'Y1',z:'Z1'},
        {x:'X2',y:'Y2',z:'Z2'},
        {x:'X3',y:'Y3',z:'Z3'}
      ]
    }
  },
  b: {},
  c: {}
};
obj.b.a = obj;
obj.a.a1['Recursion'] = obj.a.a1;
console.log(obj);
console.log(JSON.decycled(obj));
console.log(JSON.revive(JSON.decycled(obj)));

/* --------------------------------- */