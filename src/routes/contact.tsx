import { createFileRoute } from "@tanstack/react-router";
import { QuoteForm } from "@/components/site/quote-form";
import { Shell } from "@/components/site/shell";
import { offices } from "@/data/site";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    item: typeof search.item === "string" ? search.item : "",
  }),
  component: Contact,
});

function Contact() {
  const { item } = Route.useSearch();

  return (
    <Shell>
      <section className="bg-[#141414] text-[#f4f1ec]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm font-semibold tracking-widest text-orange">CONTACT</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold sm:text-5xl md:text-6xl">Tell us what the job needs.</h1>
        </div>
      </section>
      <section className="mx-auto max-w-xl px-4 py-12">
        <QuoteForm key={item} about={item} />
      </section>
      <section className="border-t border-line">
        <ul className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {offices.map((office) => (
            <li key={office.name} className="border border-line bg-card p-4">
              <p className="flex items-center gap-2 font-semibold">
                <MapPin className="size-4 text-orange" aria-hidden="true" />
                {office.name}
              </p>
              {office.lines.map((line) => (
                <p key={line} className="mt-1 text-sm text-muted">
                  {line}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
