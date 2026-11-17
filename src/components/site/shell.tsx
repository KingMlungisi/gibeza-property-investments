import type { ReactNode } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHead({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <section className="border-b border-[#3a342c] bg-[#141414] text-[#f4f1ec]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-xs font-semibold tracking-widest text-orange">{kicker}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-[#f4f1ec]/75">{lede}</p>
      </div>
    </section>
  );
}

export function PointList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3 text-sm">
      {items.map((item) => (
        <li key={item} className="border-l-2 border-orange pl-3">
          {item}
        </li>
      ))}
    </ul>
  );
}
