// es module (modern syntax), originally designed for web browsers, nodejs 12+, .mjs
// async, wrapped inside of a promise
// static

// import fs from "node:fs";
// const fs = require("fs");

// import react from "react";

// const Button = 'button';

// export Button;

// common js, orginally designed for nodejs, server side, .cjs
// sync
// dynamic

// const react = require('react');

// if {
//     require("a")
// }
// else {
//   require("b")
// }

// Module.exports = {
//   react
// }

// one micro queue:
//    1st layer: nextTick
//    2nd layer: promise
// one macro queue for each phase

// 2nd
// check micro
// timer phase macro queue
// check micro
// poll phase macro queue
// check micro
// check phase macro queue

console.log("start"); // 1

setTimeout(() => {
  console.log("setTimeout");
}, 0);
// 1ms

setImmediate(() => {
  console.log("setImmediate");
});

Promise.resolve().then(() => {
  console.log("promise");
}); // 3

process.nextTick(() => {
  console.log("nextTick");
});

console.log("end"); // 2
