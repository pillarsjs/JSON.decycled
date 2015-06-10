var test = require('unit.js');
require("../");

describe("Decycled Library -",function(){ 
  describe("Circular JSON - ",function(){ 
    it("Circular to root",function(){     
     
      var obj = {
        a: {
          a1: undefined
        }
      };
      obj.a.a1 = obj;     
      obj = JSON.revive(JSON.decycled(obj));
     
      test
        .value(obj.a.a1)
          .isType("string")
        .value(obj.a.a1)
          .is("[Circular]")
     })

    it("Circular to no root",function(){     
      var obj = {
        a: {
          a1:{
            a11:{
              a111:{
                a1111: undefined
              }
            }
          },
          a2:{
            a22: undefined
          }
        }
      };
      obj.a.a1.a11.a111.a1111 = obj.a.a1;
      obj.a.a2.a22 =  obj.a.a1.a11.a111.a1111;
      obj = JSON.revive(JSON.decycled(obj));
     
      test
        .value(obj.a.a1.a11.a111.a1111)
          .isType("string")
        .value(obj.a.a1.a11.a111.a1111)
          .is("[Circular:a.a1]")
         .value(obj.a.a2.a22)
          .isType("object")
        .value(obj.a.a2.a22.a11.a111.a1111)
          .isType("string")
        .value(obj.a.a2.a22.a11.a111.a1111)
          .is("[Circular:a.a2.a22]")
     })

    it("Regexp",function(){     
      var obj = {
        a: {
          'Regexp1': /x+/,
          'Regexp2': /^\[TimeStamp:([0-9]+)\]$/,
          'Regexp3': /^\[Regexp:\/(.+)\/\]$/
        }
      };
      obj = JSON.revive(JSON.decycled(obj));
     
      test
        .value(obj.a.Regexp1)
          .is(/x+/)
        .value(obj.a.Regexp2)
          .is(/^\[TimeStamp:([0-9]+)\]$/)
        .value(obj.a.Regexp3)
          .is(/^\[Regexp:\/(.+)\/\]$/)

     })

    it("Date",function(){   

      var date = new Date();
      date.setUTCFullYear(1981);
      date.setUTCMonth(12-1);
      date.setUTCDate(11);
      date.setUTCHours(13);
      date.setUTCMinutes(54);
      date.setUTCSeconds(59);
      date.setUTCMilliseconds(1);

      var obj = {
        a: {
          date1: new Date(),
          date2: date
        }
      };

      obj = JSON.revive(JSON.decycled(obj));
     
      test
        .value(obj.a.date1)
          .isType("object")
        .value(obj.a.date2)
          .isType("object")
        .value(obj.a.date2)
          .is(date)
     })

    it("Error",function(){   

      var obj = {
        a: {
          'error': new Error('Opss')
        }
      };
      
      obj = JSON.revive(JSON.decycled(obj));
     
      test
        .value(obj.a.error)
          .isType("object")
     })

    it("Function",function(){   

      var obj = {
        a: {
          functionHello: function Hello(){}
        }
      };
      obj = JSON.revive(JSON.decycled(obj,{functions:true}));
      test
        .value(obj.a.functionHello)
          .isType("string")
        .value(obj.a.functionHello)
          .is("[Function:Hello]")
     })

    it("Array",function(){   

      var obj = {
        a: {
          'Array': [1,2,3,4,5]
        }
      };
      obj = JSON.revive(JSON.decycled(obj));
      test
        .value(obj.a.Array)
          .isType("object")
        .value(obj.a.Array)
          .is([1,2,3,4,5])
     })


    it("List",function(){   

      var obj = {
        a: {
          a2:{
            'List': [
            {x:'X1',y:'Y1',z:'Z1'},
            {x:'X2',y:'Y2',z:'Z2'},
            {x:'X3',y:'Y3',z:'Z3'}
            ]
          }
        }
      };
      obj = JSON.revive(JSON.decycled(obj));
      test
        .value(obj.a.a2.List)
          .isType("object")
        .value(obj.a.a2.List)
          .is([
            {x:'X1',y:'Y1',z:'Z1'},
            {x:'X2',y:'Y2',z:'Z2'},
            {x:'X3',y:'Y3',z:'Z3'}
            ])
     })
  })
});