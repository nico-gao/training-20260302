import { useState, type ChangeEvent, type FormEvent } from "react";

type AuthMode = "signup" | "login";

interface AuthResponse {
  message: string;
  accessToken?: string;
}

interface Todo {
  id: string;
  listId: string;
  name: string;
  completed: boolean;
}

interface TodoList {
  id: string;
  name: string;
  todos: Todo[];
}

const initialForm = {
  email: "",
  password: "",
};

async function parseJson(response: Response): Promise<AuthResponse> {
  const data = (await response.json().catch(() => ({}))) as AuthResponse;

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data;
}

function getApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3002";

  return configuredBaseUrl.endsWith("/")
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl;
}

export function AuthApp() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("Create an account or log in.");
  const [token, setToken] = useState("");
  const [lists, setLists] = useState<TodoList[]>([]);
  const [listName, setListName] = useState("");
  const [todoDrafts, setTodoDrafts] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoggedIn = token.length > 0;

  async function loadLists(accessToken: string) {
    const response = await fetch(`${getApiBaseUrl()}/lists`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = (await response.json().catch(() => [])) as TodoList[] | AuthResponse;

    if (!response.ok || !Array.isArray(data)) {
      const message = Array.isArray(data) ? "Unable to load lists" : data.message;
      throw new Error(message ?? "Unable to load lists");
    }

    setLists(data);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${getApiBaseUrl()}${mode === "signup" ? "/auth/signup" : "/auth/login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: mode === "login" ? "include" : "same-origin",
          body: JSON.stringify(form),
        },
      );
      const data = await parseJson(response);

      if (mode === "signup") {
        setStatus(`${data.message} Switch to login to continue.`);
        setMode("login");
      } else {
        const accessToken = data.accessToken ?? "";
        setToken(accessToken);
        await loadLists(accessToken);
        setStatus(data.message);
      }
    } catch (error) {
      setToken("");
      setLists([]);
      setStatus(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: listName }),
      });
      const data = await parseJson(response);
      const createdList = data as unknown as TodoList;

      setLists((current) => [...current, createdList]);
      setListName("");
      setStatus(`Created list "${createdList.name}".`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create list");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateTodo(listId: string) {
    const todoName = todoDrafts[listId] ?? "";

    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/lists/${listId}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: todoName }),
      });
      const todo = (await parseJson(response)) as unknown as Todo;

      setLists((current) =>
        current.map((list) =>
          list.id === listId
            ? {
                ...list,
                todos: [...list.todos, todo],
              }
            : list,
        ),
      );
      setTodoDrafts((current) => ({ ...current, [listId]: "" }));
      setStatus(`Added todo "${todo.name}".`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create todo");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await parseJson(response);

      setToken("");
      setLists([]);
      setListName("");
      setTodoDrafts({});
      setForm(initialForm);
      setMode("login");
      setStatus(data.message);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to log out");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <p className="eyebrow">Express auth</p>
        <h1>Minimal React signup and login flow.</h1>
        <p className="lede">
          This frontend is served separately from the API and calls the Express
          endpoints at <code>{getApiBaseUrl()}/auth/signup</code> and{" "}
          <code>{getApiBaseUrl()}/auth/login</code>.
        </p>

        <div className="mode-switch" role="tablist" aria-label="Authentication mode">
          <button
            aria-pressed={mode === "signup"}
            aria-label="Switch to sign up"
            className={mode === "signup" ? "switch-button active" : "switch-button"}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign up
          </button>
          <button
            aria-pressed={mode === "login"}
            aria-label="Switch to log in"
            className={mode === "login" ? "switch-button active" : "switch-button"}
            onClick={() => setMode("login")}
            type="button"
          >
            Log in
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              autoComplete="email"
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
              value={form.email}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              name="password"
              onChange={handleChange}
              placeholder="Enter a password"
              type="password"
              value={form.password}
            />
          </label>

          <button className="submit-button" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? "Submitting..."
              : mode === "signup"
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <div className="status-box" aria-live="polite">
          <strong>Status</strong>
          <p>{status}</p>
        </div>

        <div className="token-box">
          <span>Access token</span>
          <code>{token || "No token yet"}</code>
        </div>

        {isLoggedIn ? (
          <section className="workspace">
            <div className="workspace-header">
              <strong>Your lists</strong>
              <div className="workspace-actions">
                <span>{lists.length} loaded</span>
                <button
                  className="logout-button"
                  disabled={isSubmitting}
                  onClick={() => void handleLogout()}
                  type="button"
                >
                  Log out
                </button>
              </div>
            </div>

            <form className="inline-form" onSubmit={handleCreateList}>
              <input
                onChange={(event) => setListName(event.target.value)}
                placeholder="Create a new list"
                type="text"
                value={listName}
              />
              <button className="submit-button" disabled={isSubmitting} type="submit">
                Add list
              </button>
            </form>

            <div className="list-stack">
              {lists.map((list) => (
                <article className="list-card" key={list.id}>
                  <div className="workspace-header">
                    <h2>{list.name}</h2>
                    <span>{list.todos.length} todos</span>
                  </div>

                  <ul className="todo-list">
                    {list.todos.length > 0 ? (
                      list.todos.map((todo) => <li key={todo.id}>{todo.name}</li>)
                    ) : (
                      <li className="todo-empty">No todo items yet.</li>
                    )}
                  </ul>

                  <div className="inline-form">
                    <input
                      onChange={(event) =>
                        setTodoDrafts((current) => ({
                          ...current,
                          [list.id]: event.target.value,
                        }))
                      }
                      placeholder={`Add a todo to ${list.name}`}
                      type="text"
                      value={todoDrafts[list.id] ?? ""}
                    />
                    <button
                      className="submit-button"
                      disabled={isSubmitting}
                      onClick={() => void handleCreateTodo(list.id)}
                      type="button"
                    >
                      Add todo
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
