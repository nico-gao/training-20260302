// prototypes

const myArray = [1, 2, 3];

// constructor function
const myAray2 = new Array();
console.log(myArray, myAray2);

// array prototype object
// constructor function uses prototype object as the blueprint to build an instance
console.log(myArray.__proto__);
console.log(Object.getPrototypeOf(myArray));
console.log(Array.prototype);
// __proto__ and Object.getPrototypeOf, work on instance
// prototype works on constructor function

const a = {
  name: "a",
  value: 1,
};

// prototype chain, inheritance
console.log(Object.getPrototypeOf(a));

// a -> Object -> null

const b = {
  name: "b",
  __proto__: a,
};

console.log(Object.getPrototypeOf(b));

// b -> a -> Object -> null

console.log(b.name);
console.log(b.value);
console.log(b.toString());
console.log(b.x);

// A constructor function
function Box(value) {
  this.value = value;
}

// Properties all boxes created from the Box() constructor
// will have
Box.prototype.getValue = function () {
  return this.value;
};

const boxes = [new Box(1), new Box(2), new Box(3)];
console.log(boxes);

/**
 * 1. create a new object, {}
 * 2. create a link between the new object and the prototype, object.__proto__ = Box.prototype
 * 3. initialize the new object
 * 4. return the new object (instance)
 * {
 *  value: 1,
 *  __proto__: Box
 * }
 */

// class keyword, syntax sugar on prototype
/**
 * inheritance
 * polymorphism
 *    overriding: same method is defined on both child and parent class
 *    overloading: no overloading in js. same method name, different arguments or implementation
 * abstraction
 *    hide details/complexity, to simplify something, more about design
 * encapsulation
 *    hide/protect something, control what is visible or what can be modified from the outside of the class, more about implementation
 */

class Person {
  #age;
  static count = 0;
  constructor(name, age) {
    this.name = name;
    this.#age = age;
    Person.count++;
  }

  // getAge() {
  //   return this.age;
  // }

  // setAge(newAge){
  //   this.age = newAge;
  // }

  // getter
  get age() {
    console.log("invoking age getter");
    return this.#age;
  }

  // setter
  set age(newAge) {
    console.log("invoking age setter");
    this.#age = newAge;
  }

  greeting() {
    console.log(`greeting from ${this.name}`);
  }

  static getCount() {
    return Person.count;
  }
}

class Student extends Person {
  constructor(name, age, studentId) {
    super(name, age);
    this.studentId = studentId;
  }

  greeting() {
    console.log(`greeting from student ${this.name}`);
  }
}

const person1 = new Person("alice", 18);
console.log(person1);
person1.greeting();
console.log(person1.age);

const student = new Student("bob", 18, 123123);
console.log(student);
student.greeting();

// instance method
// static method

console.log(Person.getCount());

const arrA = ["a", "b", "c", "d", "e"];

// arrA.forEach((value, index, array) => {
//   console.log(value, index, array);
// });

Array.prototype.myForEach = function (cb) {
  for (let i = 0; i < this.length; i++) {
    cb(this[i], i, this);
  }
};

arrA.myForEach((value, index, array) => {
  console.log(value, index, array);
});

// ways to loop on arrays
// for loop, instance methods, while loop

// ways to loop on objects
// for ... in, Object static methods (Object.keys(), Object.values(), Object.entries())
