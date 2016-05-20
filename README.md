# JSON.decycled
![license](https://img.shields.io/badge/license-MIT-blue.svg ) [![Build Status](https://img.shields.io/travis/pillarsjs/JSON.decycled/master.svg)](https://travis-ci.org/pillarsjs/JSON.decycled) [![npm version](https://img.shields.io/npm/v/json.decycled.svg)](https://www.npmjs.com/package/json.decycled) [![Github release](https://img.shields.io/github/release/bifuer/JSON.decycled.svg)](https://github.com/pillarsjs/JSON.decycled) [![npm downloads](https://img.shields.io/npm/dm/json.decycled.svg)](https://www.npmjs.com/package/json.decycled)

Languages:[[EN](#),[ES](#jsondecycled-es)]

Add to JSON JS `.decycled()` and `.revive()` method. They are a version of JSON.stringify() and JSON.parse() respectively, but **support objects with circular references**, **regular expressions, Error and Date objects and functions**.

+ Nodes where exists cyclic redundancy **[Circular: *reference*]** value appears, *reference* is the point where begins the circular reference indicated in dot notation.

```javascript
JSON.decycled (val [, functions] [, deep])
```
Return JSON of the JS object *val*
+ **val** *(object)* object to decycled.
+ **functions** *(boolean)*: *true* to show properties that are a function reference. By default is false. This properties have the format **[Function:*nombre function*]** and are not attend by `.revive()` function.
+ **deep** *(integer)*: depth of the object to be analyzed.


```javascript
JSON.revive (*val*)
```
Transform JSON structure in a JS object. If JSON is the result of `.decycled()` function; Date, RegExp and Error objects will revive.
+ **val** *(object)* JSON to "revive" in a JS object.


```javascript
require('json.decycled');

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

```

+ [Code example - jsfiddle.net](http://jsfiddle.net/lilxelo/pvbnpL7e/)


##Licence
MIT


----

## JSON.decycled (es)

Añade a JSON nativo de JS el método `.decycled()` y el método `.revive()`. Son una versión de JSON.stringify() y JSON.parse() respectivamente, pero **compatible con objetos con referencias circulares**, **expresiones regulares**, **objetos de error**, **objetos date** y **funciones**. 

+ En los nodos donde exista redundancia cíclica aparecerá el valor **[Circular: *reference*]**, donde *reference* es el punto donde comienza la referencia circular indicado en notación por puntos.


```javascript
JSON.decycled (val [, functions] [, deep])
```
Devuelve un JSON del objeto JS *val*.
+ **val** *(object)* objeto a realizar el decycled.
+ **functions** *(boolean)*: *true* para mostrar las propiedades que hacen referencia a funciones. Por defecto es false. Estas propiedades tendrán el formato **[Function:*nombre function*]** y no son atendidas por la función `.revive()`.
+ **deep** *(integer)*: profundidad del objeto a analizar.


```javascript
JSON.revive (*val*)
```
Convierte la estructura JSON en un Objeto JS. Si la estructura JSON viene dada por la función `.decycled()` se recreará los objetos Date, RegExp y Error.
+ **val** *(object)* JSON a "revivir" en un objeto JS.


```javascript
require('json.decycled');

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

```

+ [Código del ejemplo en jsfiddle.net](http://jsfiddle.net/lilxelo/pvbnpL7e/)


##Licencia
MIT
