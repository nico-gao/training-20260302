console.log("hello");

// const button = document.querySelector("#btn-1");
// console.dir(button);

// console.log(window);
// console.log(global);

const container = document.querySelector("#container");
const parent = document.querySelector("#parent");
const child = document.querySelector("#child");

child.addEventListener("click", () => {
  console.log("child bubbling");
});
parent.addEventListener("click", () => {
  console.log("parent bubbling");
});
container.addEventListener("click", () => {
  console.log("container bubbling");
});

child.addEventListener(
  "click",
  () => {
    console.log("child capturing");
  },
  true,
);
parent.addEventListener(
  "click",
  () => {
    console.log("parent capturing");
  },
  true,
);
container.addEventListener(
  "click",
  () => {
    console.log("container capturing");
  },
  true,
);
