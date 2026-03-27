import fs from "node:fs";

console.log("====== this is es module =========");

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

// fs.readFile("", () => {
//   setTimeout(() => {
//     console.log("read file setTimeout");
//   }, 0);

//   setImmediate(() => {
//     console.log("read file setImmediate");
//   });
// });

Promise.resolve().then(() => {
  console.log("promise");
}); // 3

process.nextTick(() => {
  console.log("nextTick");
});

console.log("end"); // 2
