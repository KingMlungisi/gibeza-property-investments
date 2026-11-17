import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/site/shell";
import { departments, productSlug } from "@/data/departments";

export const Route = createFileRoute("/rental")({
  component: Rental,
});

const rental = departments.find((item) => item.id === "rental") ?? departments[0];

function Rental() {
  const [slug, setSlug] = useState("");

  useEffect(() => {
    function applyHash() {
      setSlug(window.location.hash.slice(1));
      window.scrollTo(0, 0);
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const group = rental.groups.find((item) => productSlug(item.title) === slug) ?? null;
  const products = group
    ? group.products.map((product) => ({ ...product, category: group.title }))
    : rental.groups.flatMap((item) => item.products.map((product) => ({ ...product, category: item.title })));
  const featured = group?.title === "Plant" ? products[0] : null;
  const listed = featured ? products.slice(1) : products;

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs font-semibold tracking-widest text-orange">RENTAL</p>
        <h1 className="mt-2 text-3xl font-bold">{group ? group.title : "Plant and tools, hired for the job."}</h1>
        <p className="mt-3 max-w-2xl text-muted">
          {group
            ? "Hired for the duration of the job. Prices can be added as each item is confirmed."
            : "Choose a category, or browse everything that goes out on hire."}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/rental"
            hash=""
            className={
              "rounded-full border px-4 py-2 text-sm font-medium " +
              (!group ? "border-ink bg-ink text-paper" : "border-line bg-card")
            }
          >
            All
          </Link>
          {rental.groups.map((item) => {
            const on = group?.title === item.title;
            return (
              <Link
                key={item.title}
                to="/rental"
                hash={productSlug(item.title)}
                className={
                  "rounded-full border px-4 py-2 text-sm font-medium " +
                  (on ? "border-ink bg-ink text-paper" : "border-line bg-card")
                }
              >
                {item.title}
              </Link>
            );
          })}
        </div>
        {featured ? (
          <div className="mt-8 grid items-center gap-6 border border-line bg-card p-4 md:grid-cols-2">
            <img src={featured.image} alt="" className="aspect-[4/3] w-full bg-paper object-contain" />
            <div>
              <h2 className="text-2xl font-bold">{featured.name}</h2>
              <p className="mt-2 text-muted">{featured.price ?? "Price on request"}</p>
              <p className="mt-3 max-w-md text-muted">{featured.detail}</p>
              <Link
                to="/contact"
                search={{ item: featured.name }}
                className="mt-6 inline-flex border border-line px-3 py-2 text-sm font-semibold"
              >
                Enquire
              </Link>
            </div>
          </div>
        ) : null}
        <h2 className="mt-12 text-3xl font-bold">Products</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listed.map((product) => (
            <li key={product.name} className="flex flex-col border border-line bg-card p-3">
              <img src={product.image} alt="" className="aspect-[4/3] w-full bg-paper object-contain" />
              <p className="mt-3 text-sm font-semibold">{product.name}</p>
              <p className="mt-1 text-sm text-muted">{product.price ?? "Price on request"}</p>
              <p className="mt-2 text-sm text-muted">{product.detail}</p>
              <Link
                to="/contact"
                search={{ item: product.name }}
                className="mt-auto inline-flex w-fit border border-line px-3 py-2 text-sm font-semibold"
              >
                Enquire
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
