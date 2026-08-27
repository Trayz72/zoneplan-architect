import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Connplex Zoning Studio" },
      { name: "description", content: "Sign in to Connplex Zoning Studio to lay out cinema floor plans." },
      { property: "og:title", content: "Log in — Connplex Zoning Studio" },
      { property: "og:description", content: "Sign in to Connplex Zoning Studio to lay out cinema floor plans." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim() && password.trim()) navigate({ to: "/projects" });
        }}
        className="w-full max-w-[340px] rounded-md border border-border bg-card p-6"
      >
        <h1 className="text-[15px] font-semibold text-foreground">Connplex Zoning Studio</h1>
        <p className="mt-1 text-[12px] text-muted-foreground">Cinema layout planning for architects</p>

        <label className="mt-5 block text-[12px] text-muted-foreground" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 h-8 w-full rounded-sm border border-input bg-background px-2 text-[13px] outline-none focus:border-ring"
        />

        <label className="mt-3 block text-[12px] text-muted-foreground" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 h-8 w-full rounded-sm border border-input bg-background px-2 text-[13px] outline-none focus:border-ring"
        />

        <button
          type="submit"
          className="mt-5 h-8 w-full rounded-sm bg-primary text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
