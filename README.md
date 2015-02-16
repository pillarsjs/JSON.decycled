# JSON.decycled
Actúa en **estructuras JSON con redundancia cíclica**, eliminando esta redundancia e igualando la propiedad con redundancia cíclica a [Circular: *nodo de referencia*]. Además realiza el decycled sin pérdidas ya que mantiene los errores, expresiones regulares y fechas contenidos en el JSON original.  [npm](https://www.npmjs.com/package/json.decycled).

Añade a JSON.prototype de JS los siguientes métodos:

## JSON.decycled (*val* [, *functions*] [, *deep*])
Devuelve un string del JSON aceptado como parámetro *val*, con la redundancia cíclica eliminada y sin pérdidas.
+ val: JSON a realizar el decycled.
+ functions: *true* o *false*, para eliminar las funciones del JSON o mantenerlas.
+ deep: profundidad del JSON que devuelve, por defecto es 10.


## JSON.revive (*val*)
"Revive" la estructura devuelta por decycled en un JSON. 


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
