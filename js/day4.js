// javascript is single-threaded, using one stack to execute the program

// async operation

// blocking
// console.log("start");
// // alert("something happened");

// setTimeout(() => {
//   console.log("in the timeout");
// }, 1000);

// console.log("end");

/**
 event loop

 * call stack: keep track of what is currently being executed
 * webapi: async api, handle async operations, ensuring they are non-blocking
 * callback queue: maintain the async callbacks, when the call stack is empty, event loop will push callbacks to the call stack
 *    microqueue: higher priority, promises
 *    macroqueue: timeouts, intervals, fetch, UI updates
*/

// console.log(1);

// setTimeout(() => {
//   console.log(2);
// }, 1000);

// setTimeout(() => {
//   console.log(3);
// }, 0);

// Promise.resolve().then(() => console.log(4));

// console.log(5);
// /**
//  * 1 5 4 3 2

//  * stack

//   * web api

//   * queue
//     micro

//     macro

//  */

// // callback hell

// // const getUser = (id, callback) => {
// //   // retrieve data
// //   const userData = { id: id, name: "alice" };
// //   callback(userData.name);
// // };

// // const getPosts = (userName, callback) => {
// //   const postData = [
// //     { id: 1, title: "post 1" },
// //     { id: 2, title: "post 2" },
// //   ];
// //   callback(postData[0].id);
// // };

// // const getComments = (postId, callback) => {
// //   const commentData = [
// //     { id: 1, content: "comment 1" },
// //     { id: 2, content: "comment2" },
// //   ];
// //   callback(commentData);
// // };

// // getUser(1, (userName) => {
// //   getPosts(userName, (postId) => {
// //     getComments(postId, (comments) => {
// //       console.log(comments);
// //     });
// //   });
// // });

// const getUser = (id) => {
//   // retrieve data
//   const userData = { id: id, name: "alice" };
//   return new Promise((res) => {
//     setTimeout(() => {
//       res(userData);
//     }, 1000);
//   });
// };

// const getPosts = (userName) => {
//   const postData = [
//     { id: 1, title: "post 1" },
//     { id: 2, title: "post 2" },
//   ];

//   return new Promise((res, rej) => {
//     setTimeout(() => {
//       // res(postData);
//       rej("something went wrong when getting post data");
//     }, 1000);
//   });
// };

// const getComments = (postId) => {
//   const commentData = [
//     { id: 1, content: "comment 1" },
//     { id: 2, content: "comment2" },
//   ];

//   return new Promise((res) => {
//     setTimeout(() => {
//       res(commentData);
//     }, 1000);
//   });
// };

// // promise chaining
// getUser(1)
//   .then((userData) => {
//     return getPosts(userData.name);
//   })
//   .then((postData) => getComments(postData[0].id))
//   .then((commentData) => console.log(commentData))
//   .catch((err) => console.log(err))
//   .finally(() => console.log("finally"));

// // async/await -> syntax sugar
// /**
//  * look like nomal top to bottom code
//  * readability, maintainability, debug
//  * built on top of promises, but no chaining
//  */

// const fetchComments = async () => {
//   try {
//     console.log("start");
//     const userData = await getUser(1); // stops here
//     const postData = await getPosts(userData.name);
//     const commentData = await getComments(postData[0].id);
//     console.log(commentData);
//     console.log("end");
//   } catch (err) {
//     console.log(err);
//   } finally {
//     console.log("finally");
//   }
// };

// fetchComments();

// console.log("after calling fetchComments");

// console.log(1);

// setTimeout(() => {
//   console.log(2);
// }, 0);

// Promise.resolve().then(() => console.log(3));

// Promise.resolve().then(() => setTimeout(() => console.log(4), 0));

// setTimeout(() => {
//   console.log(5);
// }, 3000);

// setTimeout(() => {
//   console.log(6);
// }, 0);

// console.log(7);

/**
 * 1 7 3 2 6 4 5
 *
 * stack
 *
 * web api
 *
 *
 *
 * queue
 *
 * micro
 *
 *
 *
 * macro
 *
 *
 *
 */

const todoIds = [1, 2, 3, 5, 8, 9, 14];

const getTodos = () =>
  todoIds.map((id) => fetch(`https://dummyjson.com/todos/${id}`));

const fetchTodos = () => {
  const todoPromises = getTodos();
  Promise.all(todoPromises)
    .then((responses) => {
      const todoJsons = responses.map((response) => response.json()); // todoJsons is array of promises
      return Promise.all(todoJsons);
    })
    .then((data) => console.log(data));
};

fetchTodos();

const asyncFetchTodos = async () => {
  const todoPromises = getTodos();
  const todoResponses = await Promise.all(todoPromises);
  const todoData = await Promise.all(todoResponses.map((res) => res.json()));
  console.log(todoData);
};

asyncFetchTodos();
