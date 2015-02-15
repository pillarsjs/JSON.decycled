# JSON.decycled
Añade a JSON.prototype de JS el método decycle. 
Este método actúa en estructuras JSON con redundancia cíclica, eliminando esta redundancia e igualando la propiedad con redundancia cíclica a [Circular: *nodo de referencia*]. [npm](https://www.npmjs.com/package/json.decycled).


```javascript
require('json.decycled');
```

```javascript

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


##Example
+ [jsfiddle.net](http://jsfiddle.net/lilxelo/pvbnpL7e/)


##Licence
MIT
