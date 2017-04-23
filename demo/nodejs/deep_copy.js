/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2017-04-23 21:59:07
 * @version $Id$
 */

copy({a: 1, b: 2}, {});

function copy(obj,deep){
  if(obj === null || typeof obj !== "object"){
     return obj;
  } 　　　　　
  var name, target = Array.isArray(obj) ? [] : {}, value;
  for(name in obj){
     value = obj[name];
     console.log(value);
     if(value === obj) {
        continue;
     }
     if(deep && (Array.isArray(value) || typeof value === 'object')) {
       target[name] = copy(value,deep);
       console.log('loop', target);
     }else{
       target[name] = value;
       console.log(target);
     }
  }
  return target;
}

var obj1 = {
  a: 1,
  b: 2
};

console.log('obj1', obj1);

var obj2 = obj1;

var obj3 = obj1;

console.log('obj2', obj2);

obj2.a = 'name';

console.log('obj2', obj2);

console.log('obj1', obj1);

console.log('<====1===>');

obj1 = {
  a: 1,
  b: 2
};

console.log('obj1', obj1);

obj2 = JSON.parse(JSON.stringify(obj1));

obj2.a = 'name2';

console.log('obj2', obj2);

console.log('obj1', obj1);

console.log('<====2===>');

obj1 = {
  a: 1,
  b: 2
};

console.log('obj1', obj1);

obj2 = copy(obj1, {});

obj2.a = 'name2';

console.log('obj2', obj2);

console.log('obj1', obj1);

function copy(obj,deep){
  if(obj === null || typeof obj !== "object"){
     return obj;
  } 　　　　　
  var name, target = Array.isArray(obj) ? [] : {}, value;
  for(name in obj){
     value = obj[name];
     if(value === obj) {
        continue;
     }
     if(deep && (Array.isArray(value) || typeof value === 'object')){
       target[name] = copy(value,deep);
     }else{
       target[name] = value;
     }
  }
  return target;
}

console.log('<====3===>');

obj1 = {
  a: 1,
  b: 2
};

obj2 = run(obj1);

obj2.a = 'name';

console.log('obj2', obj2);

console.log('obj1', obj1);

function run(obj) {
  var ob = {};
  ob.a = obj.a;
  ob.b = obj.b;
  return ob;
}

console.log('<====4===>');

obj1 = {
  a: 1,
  b: 2
};
var ob2 = {};

obj2 = run2(obj1);

obj2.a = 'name';

console.log('obj2', obj2);

console.log('obj1', obj1);

function run2(obj) {
  ob2.a = obj.a;
  ob2.b = obj.b;
  return ob2;
}


console.log('<====5===>');

obj1 = {
  a: 1,
  b: 2
};

obj2 = {};

obj2.a = obj1.a;

obj2.b = obj1.b;

console.log('obj2', obj2);

obj2.a = 'name';

console.log('obj2', obj2);

console.log('obj1', obj1);
