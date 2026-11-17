import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { ProfileBook } from "@/components/site/profile-book";
import { Shell } from "@/components/site/shell";
import { departments } from "@/data/departments";
import { openRoom, loadRoom } from "@/lib/room.functions";

export const Route = createFileRoute("/procurement")({
  component: Procurement,
});

const TOKEN = "gibeza-room";
const supply = departments.find((item) => item.id === "procurement");

type Session = { token: string; username: string; files: Record<string, "pdf" | "image"> };

function Procurement() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN);
    if (!saved) return;
    let parsed: Session;
    try {
      parsed = JSON.parse(saved) as Session;
    } catch {
      sessionStorage.removeItem(TOKEN);
      return;
    }
    loadRoom({ data: { token: parsed.token } })
      .then((fresh) => {
        if (!fresh.ok) {
          sessionStorage.removeItem(TOKEN);
          return;
        }
        const next = { ...parsed, files: fresh.files };
        sessionStorage.setItem(TOKEN, JSON.stringify(next));
        setSession(next);
      })
      .catch(() => {
        sessionStorage.removeItem(TOKEN);
      });
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const data = new FormData(event.currentTarget);
    try {
      const result = await openRoom({
        data: { username: String(data.get("username") ?? ""), password: String(data.get("password") ?? "") },
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      const next = { token: result.token, username: result.username, files: result.files };
      sessionStorage.setItem(TOKEN, JSON.stringify(next));
      setSession(next);
    } catch {
      setError("The document room could not be opened. Try again.");
    } finally {
      setPending(false);
    }
  }

  function leave() {
    sessionStorage.removeItem(TOKEN);
    setSession(null);
  }

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 py-12">
        {session ? (
          <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-widest text-orange">COMPANY PROFILE</p>
                <h1 className="mt-2 text-3xl font-bold">Documents</h1>
              </div>
              <div className="flex gap-2">
                <a href="/Gibeza-company-profile.pdf" className="border border-line bg-card px-4 py-2 text-sm font-semibold">
                  Download profile
                </a>
                <button type="button" onClick={leave} className="border border-line bg-card px-4 py-2 text-sm font-semibold">
                  Leave
                </button>
              </div>
            </div>
            <ProfileBook token={session.token} files={session.files} />
          </>
        ) : (
          <div className="mx-auto max-w-md">
            <h1 className="text-center text-3xl font-bold">Company documents</h1>
            <p className="mt-3 text-center text-sm text-muted">
              For clients who were sent a username and password. The company profile and the papers sit behind this login.
            </p>
            <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-lg border border-line bg-card p-6">
              <label className="grid gap-1 text-sm">
                Username
                <input name="username" required autoComplete="username" className="border border-line bg-paper px-3 py-3 outline-none focus:border-orange" />
              </label>
              <label className="grid gap-1 text-sm">
                Password
                <input name="password" type="password" required autoComplete="current-password" className="border border-line bg-paper px-3 py-3 outline-none focus:border-orange" />
              </label>
              {error ? <p className="text-sm text-orange">{error}</p> : null}
              <button type="submit" disabled={pending} className="bg-orange px-4 py-3 text-sm font-semibold text-paper disabled:opacity-60">
                {pending ? "Opening\u2026" : "Open documents"}
              </button>
            </form>
          </div>
        )}
      </section>
      {!session && supply ? (
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold">Materials for a contract</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {supply.groups.map((group) => (
                <div key={group.title}>
                  <p className="text-xs font-semibold tracking-widest text-muted">{group.title.toUpperCase()}</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {group.products.map((product) => (
                      <li key={product.name}>{product.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </Shell>
  );
}
