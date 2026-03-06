/**
 * primitive data types (values)
 *
 * string
 * number
 * boolean
 * undefined
 * null
 *
 * bigint
 * symbol
 *
 * reference data types (reference)
 *
 * object
 * array
 * function
 */

// prototype chain
let a = 1;
let b = a;
a = 2;

console.log(typeof a);
console.log(a, b);

const obj1 = {
  name: "alice",
  age: 18,
};
// 0000001

const obj2 = {
  name: "alice",
  age: 18,
};
// 0000002

console.log(obj1 === obj2); // false

const obj3 = obj2;
console.log(obj2 === obj3);
obj3.name = "bob";

console.log(obj2, obj3);

function foo(input) {
  input.value = 2;
  console.log(input);
}

let num = {
  value: 1,
};
foo(num);
console.log(num);

// type coercion, implicit type conversion
let c = 1;
let d = "1";

console.log(c == d); // check value, does coercion
console.log(c === d); // check both type and value

// type casting, explicit type conversion
console.log(typeof c.toString()); // .toString() is a method defined on number type
console.log(typeof String(c));
console.log(typeof ("123" + c));

console.log(typeof +d);

console.log(!!c);

/**
 *                   var   |   let   |   const
 * reassign          yes       yes        no
 * redeclare         yes       no         no
 * scope            function  block      block
 * hoisting          yes       no         no
 */

function foo1() {
  // hoisting, moving the declaration to the top of the scope, not initialization
  // var number
  console.log(number);
  {
    var number = 10;
  }

  console.log(number);
}

foo1();

// closure
function foo2() {
  // >>>>>>>>
  let counter = 1;

  // <<<<<<<
  return function () {
    console.log(counter);
    counter++;
  };
}

const myCounter = foo2();
myCounter();
myCounter();

console.dir(myCounter);

const buttons = document.querySelectorAll(".nav-btn");
console.log(buttons);

buttons.forEach((btn) => {
  const handleClick = () => {
    alert(`Clicked ${btn.textContent} button`);
  };

  btn.addEventListener("click", handleClick);
});

// function keyword
// arrow function

myFn();

// hoisted
function myFn() {
  console.log("my function");
}

const myArrowFn = () => {
  console.log("my arrow function");
};

const arrowFn = () => 1;
// this

for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 100);
  })(i);
  // iife - immediate invoked function expression
}

/**
 * loop 1
 * 
    setTimeout(function () {
      console.log(0);
    }, 100);
  

  loop 2

    setTimeout(function () {
      console.log(1);
    }, 100);


  loop 3
    setTimeout(function () {
      console.log(2);
    }, 100);

  after 100ms

  0, 1, 2

 */

// var i
for (let i = 0; i < 3; i++) {
  // let i
  setTimeout(function () {
    console.log(i);
  }, 100);
}

/**
 * loop 1: function () {
    console.log(i);
  }
    let i => 0 
 * 

  loop2: function () {
    console.log(i);
  }

  i => 1 

  loop 3: function () {
    console.log(i);
  }

  i => 2 

  after 100ms
  
  0, 1, 2 
 */
