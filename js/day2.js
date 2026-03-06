// es6
// let, const, arrow function, class, promise, spread operator, rest operator, destructuring, template literals, for ... of

/**
 * arrow function vs regular function
 * 1. syntax, arrow function is more concise, commonly used for callback functions, one liners
 * 2. hoisting
 *    regular fn: hoisted completely, can be invoked before declaration
 *    arrow fn: cannot invoke before assginment, behavior depends on the keyword used for declaration
 * 3. this keyword
 *    regular fn: it depends on how the fn is called, the calling context
 *    arrow fn: it depends on the surround scope when it's defined, it inherits 'this' from the outer scope
 *
 * 4. arguments object
 *    regular fn: yes
 *    arrow fn: no
 *
 * 5. constructor fn
 *    regular fn: yes
 *    arrow fn: no
 */

function foo(a, b) {
  console.log(this);
}

foo(1, 2);

const objA = {
  name: "alice",
  sayHi: function (a, b) {
    // console.log(this); // objA
    console.log(this.name); // alice
    console.log(a, b);
    const foo = () => {
      console.log(this); // objA
    };
    foo();
  },
  sayHello: () => {
    console.log(this); // window
  },
};

objA.sayHi();
objA.sayHello();

const objB = {
  name: "bob",
};

objB.sayHi = objA.sayHi;
console.log(objB);
objB.sayHi(); // objB, bob, objB

// call(), apply(), bind()

console.log("=======");
objA.sayHi(); // -> alice
objA.sayHi.call(objB); // -> bob

objA.sayHi.apply(objB, ["Hello", "world"]);

const bindedFn = objA.sayHi.bind(objB);
bindedFn();

function getNumbers(a, b, c, d) {
  console.log(a, b, c, d);
  console.log(arguments);
}

getNumbers(1, 2, 3, 4);
getNumbers(1, 2, 3, 4, 5, 6);

// const getNumber2 = () => {
//   console.log(arguments);
// };

// getNumber2(1, 2, 3);

// spread operator: shallow copy
// for objects, copy the top level properties
// array methods: slice()
// object method: Object.assign({}, obj)
const arr1 = [["a", "b"], 1, 2, 3, 4, 5];
const arr2 = [...arr1, 0];

const obj1 = {
  a: 1,
  b: 2,
  c: 3,
};

const obj2 = { ...obj1 };
console.log(arr1, arr2);
console.log(obj1, obj2);

console.log(arr1[0] === arr2[0]); // true

// deep copy: create a completely independent copy of the object
/**
 * structuredClone()
 * JSON.stringify(), JSON.parse()
 *      serializable, toJSON()
 * loadash, clonedeep()
 * manually implement a function, recursively copy all the values
 */

const person = {
  name: "alice",
  age: 18,
  address: {
    city: "asdasd",
    street: "adasd",
    zipcode: "12323",
  },
  date: new Date(),
};

const stringifiedPerson = JSON.stringify(person);
console.log(stringifiedPerson);
const copiedPerson = JSON.parse(stringifiedPerson);
console.log(person);
console.log(copiedPerson);

console.log(person.address === copiedPerson.address); // false

// rest operator: ...
// collect all arguments and put them into one array

const getStrings = (a, b, ...args) => {
  console.log(a, b, args);
};

getStrings("1", "2", "3");

// destructuring
// unpacking values from object/array

// const name = person.name;
// const address = person.address;
// const age = person.age;

const { address, age, name: personName } = person;

console.log(personName);
console.log(address);
console.log(age);

const numberArr = [1, 2, 3, 4, 5];
const [firstNum, secondNum] = numberArr;
console.log(firstNum, secondNum);

// template literal
console.log(`hello my name is ${personName}`);

// for ... of loop -> es6
// used on iterable objects
// plain objects are not iterable

for (num of numberArr) {
  console.log(num);
}

// for (val of person) {
//   console.log(val);
// } // gives you error

// for ... in loop
// enumerable properties of a object

for (val in person) {
  console.log(val);
}

for (num in numberArr) {
  console.log(num);
}

// object, array, set, map
// object: order is not guaranteed
// map: remembers the insertion order

console.log(Object.keys(person));

/**
 *                  object      map       set      array
 * insert           O1          O1        O1        O1
 * lookup           O1          O1        O1        On  (.find(), include())
 * detele           O1          O1        O1        On
 * iteration        On          On        On        On
 *
 */
