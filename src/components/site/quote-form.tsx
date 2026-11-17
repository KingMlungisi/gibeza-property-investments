import { email } from "@/data/site";
import { FormEvent, useState } from "react";

export function QuoteForm({ about }: { about: string }) {
  const [sent, setSent] = useState(false);
  const subject = about || "General enquiry";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const company = String(data.get("company") ?? "");
    const from = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const body = [
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${from}`,
      `Enquiring about: ${subject}`,
      "",
      message,
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Enquiry — " + subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-line bg-card p-6">
        <h2 className="font-display text-2xl font-bold">Send a message</h2>
        <p className="mt-4 text-sm">
          Enquiring about: <span className="font-semibold text-orange">{subject}</span>
        </p>
        <p className="mt-4 text-sm text-muted">Thank you for submitting your enquiry.</p>
        <button
          type="button"
          className="mt-6 rounded-full bg-orange px-5 py-3 text-sm font-semibold text-paper"
          onClick={() => setSent(false)}
        >
          Start a new enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-line bg-card p-6">
      <h2 className="font-display text-2xl font-bold">Send a message</h2>
      <p className="text-sm">
        Enquiring about: <span className="font-semibold text-orange">{subject}</span>
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Name
          <input
            name="name"
            required
            className="border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-orange"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Company
          <input
            name="company"
            className="border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-orange"
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
          Email
          <input
            name="email"
            required
            type="email"
            className="border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-orange"
          />
        </label>
      <label className="grid gap-1 text-sm">
        What do you need?
        <textarea
          name="message"
          required
          rows={4}
          className="border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-orange"
        />
      </label>
      <button type="submit" className="rounded-full bg-orange px-4 py-3 text-sm font-semibold text-paper hover:bg-orange-deep">
        Send the enquiry
      </button>
    </form>
  );
}
