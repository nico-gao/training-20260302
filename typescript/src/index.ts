let num: number = 1;

let numArr: number[] = [1, 2, 3, 4, 5];
let strArr: string[] = ["1", "2"];

// type alias can be used to define anything, is closed once you declare it
type Person = { id: number; name: string };
type Student = Person & {
  studentId: Id;
  dormId: Id;
};

// cannot redeclare using type alias
// type Person = {
//   id: number;
//   name: string;
//   age: number
// };

// union type
type Id = String | Number;

// interface, only define object shapes, will merge type definition automatically
interface IPerson {
  id: number;
  name: string;
}

interface IPerson {
  age: number;
}

interface IStudent extends IPerson {
  studentId: Id;
}

let person: { id: Id; name: string } = {
  id: "1",
  name: "alice",
};

let person2: IPerson = {
  id: 2,
  name: "bob",
  age: 18,
};

// let student: Student = {
//   id: 1,
//   name: "charlie",
//   studentId: 1,
// };

function add(x: unknown, y: any): void {
  if (typeof x === "number") {
    x.toFixed();
  }
  y.toFixed();
  // return x + y;
}
// void
// never

// Utility types

// generic type
function toNumberArray(x: number, y: number, z: number) {
  return [x, y, z];
}

function toStringArray(x: string, y: string, z: string) {
  return [x, y, z];
}

function toArray<T>(x: T, y: T, z: T) {
  return [x, y, z];
}

toArray<string>("1", "2", "3");

// tuple: array with defined length and type of elements

let arr: [number, string, {}] = [1, "2", {}];

// enum
