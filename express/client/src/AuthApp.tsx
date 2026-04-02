import { useState, type ChangeEvent, type FormEvent } from "react";

type AuthMode = "signup" | "login";

interface AuthResponse {
  message: string;
  accessToken?: string;
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

export function AuthApp() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("Create an account or log in.");
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(mode === "signup" ? "/auth/signup" : "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: mode === "login" ? "include" : "same-origin",
        body: JSON.stringify(form),
      });
      const data = await parseJson(response);

      if (mode === "signup") {
        setStatus(`${data.message} Switch to login to continue.`);
        setMode("login");
      } else {
        setToken(data.accessToken ?? "");
        setStatus(data.message);
      }
    } catch (error) {
      setToken("");
      setStatus(error instanceof Error ? error.message : "Something went wrong");
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
          This form talks directly to the existing Express endpoints at
          <code>/auth/signup</code> and <code>/auth/login</code>.
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
      </section>
    </main>
  );
}
