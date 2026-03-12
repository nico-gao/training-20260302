/**
 * MVC
 * separation between ui and logic
 *
 * model: source of truth, only know about data and how/where to get/change the data
 *
 * view: only know about ui/DOM, how it's rendered
 *
 * controller: connect model and view, listen to user events, tell model when to update, tell view when to re-render
 *
 *
 * create encapsulation
 * function, object, iife, class
 *
 */

const API = (() => {
  const baseURL = "https://dummyjson.com/posts";
  function getPosts(limit, skip) {
    return fetch(`${baseURL}?limit=${limit}&skip=${skip}`).then((res) =>
      res.json(),
    );
  }
  return {
    getPosts,
  };
})();

const View = (() => {
  function createPageButtons(currentPage, totalPages) {
    const pageBtnContainer = document.getElementById("page-btn-container");
    pageBtnContainer.replaceChildren();

    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i + 1;
      btn.className = "page-btn";
      if (i === currentPage - 1) btn.disabled = true;
      pageBtnContainer.appendChild(btn);
    }
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

  function render(posts, currentPage, totalPages) {
    const postContainer = document.getElementById("posts-container");
    const pageNumber = document.getElementById("page-number");

    postContainer.replaceChildren();

    const postElements = posts.map((post) => createPostElement(post));

    postContainer.append(...postElements);

    // pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
    createPageButtons(currentPage, totalPages);

    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = currentPage === totalPages;
  }

  return { render };
})();

const Model = (() => {
  class State {
    #posts = [];
    #currentPage = 1;
    #limit = 15;
    #totalPages = 1;
    #onChange = () => {};

    get posts() {
      return this.#posts;
    }

    set posts(newPosts) {
      this.#posts = newPosts;
    }

    get currentPage() {
      return this.#currentPage;
    }

    set currentPage(newPageNumber) {
      this.#currentPage = newPageNumber;
      // call the subscribed functions
      this.#onChange();
    }

    get limit() {
      return this.#limit;
    }

    get totalPages() {
      return this.#totalPages;
    }

    set totalPages(newTotalPages) {
      this.#totalPages = newTotalPages;
    }

    subscribe(cb) {
      this.#onChange = cb;
    }
  }
  return { State };
})();

const Controller = ((view, model, api) => {
  const state = new model.State();

  async function fetchAndRender() {
    const postReponse = await api.getPosts(
      state.limit,
      state.limit * (state.currentPage - 1),
    );
    const { posts, total } = postReponse;
    console.log(postReponse);
    state.totalPages = Math.ceil(total / state.limit);

    state.posts = posts;
    view.render(state.posts, state.currentPage, state.totalPages);
  }

  function setUpListeners() {
    document.getElementById("prev-btn").addEventListener("click", () => {
      if (state.currentPage === 1) return;
      state.currentPage -= 1;
      // fetchAndRender();
    });

    document.getElementById("next-btn").addEventListener("click", () => {
      if (state.currentPage === state.totalPages) return;
      state.currentPage += 1;
      // fetchAndRender();
    });

    document
      .getElementById("page-btn-container")
      .addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("page-btn")) {
          console.log("this is a page button");
          state.currentPage = +target.textContent;
          console.log("state current page is:", state.currentPage);
          // fetchAndRender();
        }
      });
  }

  function init() {
    fetchAndRender();
    setUpListeners();
    state.subscribe(() => {
      fetchAndRender();
    });
  }

  return { init };
})(View, Model, API);

Controller.init();
