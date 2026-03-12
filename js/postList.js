const LIMIT = 5;
let currentPage = 1;
let totalPages = 1;
let skip = 0;

// api
function getPosts(limit, skip) {
  return fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`).then(
    (res) => res.json(),
  );
}

function createPostElement(post) {
  const postItem = document.createElement("li");
  postItem.className = "post-item";

  const title = document.createElement("h3");
  title.textContent = post.title;

  const body = document.createElement("p");
  body.textContent = post.body;

  postItem.append(title, body);
  return postItem;
}

async function render() {
  const postResponse = await getPosts(LIMIT, skip);
  const postData = postResponse.posts;
  console.log(postResponse);
  // totalPages = Math.ceil(postData.length / LIMIT);
  totalPages = postResponse.total;
  skip += LIMIT;

  const postContainer = document.getElementById("posts-container");
  const pageNumber = document.getElementById("page-number");

  pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;

  postContainer.replaceChildren();

  const postElements = postData
    // .slice((currentPage - 1) * LIMIT, currentPage * LIMIT)
    .map((post) => createPostElement(post));

  postContainer.append(...postElements);

  document.getElementById("prev-btn").disabled = currentPage === 1;
  document.getElementById("next-btn").disabled = currentPage === totalPages;

  // postData.forEach((post) => {
  //   const postItem = `
  //   <li class='post-item'>
  //     <h3>${post.title}</h3>
  //     <p>${post.body}</p>
  //   </li>
  // `;

  // // XSS - cross site scripting
  //   postContainer.innerHTML += postItem;
  // });
}

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentPage === 1) return;
  currentPage -= 1;
  render();
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentPage === totalPages) return;
  currentPage += 1;
  render();
});

render();

/**
 * pagination
 *
 * limit, offset/skip, total page
 *
 * client side
 *
 * server side
 * // https://dummyjson.com/posts?limit=10&skip=10
 *
 */

/**
 * debounce
 * 1000ms
 *
 *    action      action        action        action      action
 *  - - - - - - - --  - - - ignored - - - - - - - - - - - - - - - after 1000ms action is executed
 *
 *
 * throttle
 * 500 ms
 *
 *  action     action   action    action    action    action    action    action
 * action | - - - - - - 500ms   - - - - - - - | action | -  - - - - - 500ms - - - - - |
 *
 *
 *
 * rate limiting
 *
 */

// window.addEventListener(
//   "mousemove",
//   throttle((e) => {
//     console.log(e.clientX, e.clientY);
//   }),
// );

// higher order function
function debounce(cb, delay = 1000) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

function throttle(cb, delay = 1000) {
  let isWaiting = false;

  return (...args) => {
    if (isWaiting) return;

    cb(...args);
    isWaiting = true;
    setTimeout(() => {
      isWaiting = false;
    }, delay);
  };
}

// currying: you call a function in a sequence with individual arguments

// const add = (a, b) => a + b;
// console.log(add(1, 2));

const curriedAdd = (a) => (b) => a + b;
console.log(curriedAdd(1)(2)); // output 3

const add1 = curriedAdd(1);

console.log(add1(2));
console.log(add1(3));
console.log(add1(4));
