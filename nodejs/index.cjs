// es module (modern syntax), originally designed for web browsers, nodejs 12+, .mjs
// async, wrapped inside of a promise
// static

// import fs from "node:fs";
const fs = require("fs");

console.log("====== this is common js =========");

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

/**
 * setTimout: schedule a callback function to be invoked after the specified delay
 *
 * setImmediate: schedule the callback function to be invoked once the current Poll phase becommes idle
 *
 * process.nextTick: highest priority, ensure the callback function to be invoked before the event loop continues to do anything else
 *
 */

// process nextTick queue
// promise micro queue
// one macro queue for each phase

// 6 phasesn in event loop
// timer phase macro queue: execute callbacks from setTimeout/setInterval
// pending callback phase: execute callbacks from the previous loop
// idle: for node internal only
// poll phase macro queue: check I/O events, can also be idle
// check phase macro queue: specific for callbacks scheduled by setImmediate
// close phase: execute connection closing callbacks

console.log("start"); // 1

setTimeout(() => {
  console.log("setTimeout");
  // process.nextTick(() => {
  //   console.log("nextTick");
  // });
}, 0);
// 1ms

setImmediate(() => {
  console.log("setImmediate");
});

fs.readFile("", () => {
  setTimeout(() => {
    console.log("read file setTimeout");
  }, 0);

  setImmediate(() => {
    console.log("read file setImmediate");
  });
});

Promise.resolve().then(() => {
  console.log("promise");
}); // 3

process.nextTick(() => {
  console.log("nextTick");
});

console.log("end"); // 2

/**
 *
 * sync -> check nextTick queue -> check micro queue -> timer phase -> check nextTick -> poll phase -> check phase
 *
 * 2nd loop
 * timer phase
 */
