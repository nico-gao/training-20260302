import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthApp } from "./AuthApp";

const fetchMock = vi.fn();

describe("AuthApp", () => {
  afterEach(() => {
    cleanup();
    fetchMock.mockReset();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("submits signup details to the signup endpoint", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3002");
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ message: "User created successfully" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<AuthApp />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("http://localhost:3002/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: "user@example.com",
          password: "secret123",
        }),
      }),
    );

    expect(await screen.findByText(/switch to login to continue/i)).toBeInTheDocument();
  });

  it("submits login details to the login endpoint and shows the token", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3002");
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Login successful",
          accessToken: "token-123",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "list-1",
            name: "Groceries",
            todos: [{ id: "todo-1", listId: "list-1", name: "Buy milk", completed: false }],
          },
        ],
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<AuthApp />);

    fireEvent.click(screen.getByRole("button", { name: "Switch to log in" }));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^log in$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3002/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: "user@example.com",
          password: "secret123",
        }),
      },
    ));
    await waitFor(() => expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3002/lists",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer token-123",
        },
      },
    ));

    expect(await screen.findByText("Login successful")).toBeInTheDocument();
    expect(screen.getByText("token-123")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("renders backend error messages", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3002");
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Invalid credential" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<AuthApp />);

    fireEvent.click(screen.getByRole("button", { name: "Switch to log in" }));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^log in$/i }));

    expect(await screen.findByText("Invalid credential")).toBeInTheDocument();
    expect(screen.getByText("No token yet")).toBeInTheDocument();
  });

  it("creates a list and a todo after login", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3002");
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Login successful",
          accessToken: "token-123",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "list-1", name: "Weekend", todos: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "todo-1",
          listId: "list-1",
          name: "Wash car",
          completed: false,
        }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<AuthApp />);

    fireEvent.click(screen.getByRole("button", { name: "Switch to log in" }));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^log in$/i }));

    expect(await screen.findByText("Your lists")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Create a new list"), {
      target: { value: "Weekend" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add list" }));

    expect(await screen.findByText("Weekend")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Add a todo to Weekend"), {
      target: { value: "Wash car" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add todo" }));

    expect(await screen.findByText("Wash car")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "http://localhost:3002/lists",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
        body: JSON.stringify({ name: "Weekend" }),
      },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      "http://localhost:3002/lists/list-1/todos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
        body: JSON.stringify({ name: "Wash car" }),
      },
    );
  });

  it("logs the user out and clears the workspace", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3002");
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Login successful",
          accessToken: "token-123",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "list-1",
            name: "Groceries",
            todos: [],
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Logged out successfully",
        }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<AuthApp />);

    fireEvent.click(screen.getByRole("button", { name: "Switch to log in" }));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^log in$/i }));

    expect(await screen.findByText("Your lists")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenNthCalledWith(
        3,
        "http://localhost:3002/auth/logout",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer token-123",
          },
          credentials: "include",
        },
      ),
    );

    expect(await screen.findByText("Logged out successfully")).toBeInTheDocument();
    expect(screen.getByText("No token yet")).toBeInTheDocument();
    expect(screen.queryByText("Your lists")).not.toBeInTheDocument();
  });
});
