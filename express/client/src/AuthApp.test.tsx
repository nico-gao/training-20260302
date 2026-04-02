import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthApp } from "./AuthApp";

const fetchMock = vi.fn();

describe("AuthApp", () => {
  afterEach(() => {
    cleanup();
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("submits signup details to the signup endpoint", async () => {
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
      expect(fetchMock).toHaveBeenCalledWith("/auth/signup", {
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
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "Login successful",
        accessToken: "token-123",
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

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: "user@example.com",
          password: "secret123",
        }),
      }),
    );

    expect(await screen.findByText("Login successful")).toBeInTheDocument();
    expect(screen.getByText("token-123")).toBeInTheDocument();
  });

  it("renders backend error messages", async () => {
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
});
