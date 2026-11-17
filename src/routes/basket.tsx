import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { Shell } from "@/components/site/shell";
import { departments, shelfPrice } from "@/data/departments";
import { loadShopCatalogue } from "@/data/load-shop";
import { email } from "@/data/site";
import { useCart, type ClientDetails } from "@/lib/cart";

export const Route = createFileRoute("/basket")({
  component: Basket,
});

function priceFor(
  name: string,
  shopIndex: Map<string, { material?: number; markup?: number }>,
) {
  for (const department of departments) {
    if (department.id === "shop") continue;
    for (const group of department.groups) {
      const product = group.products.find((item) => item.name === name);
      if (product) return shelfPrice(product);
    }
  }
  const product = shopIndex.get(name);
  if (product) return shelfPrice(product);
  return shelfPrice({});
}

function Basket() {
  const { items, setQty, remove, clear, client, saveClient } = useCart();
  const [sent, setSent] = useState(false);
  const [shopIndex, setShopIndex] = useState<Map<string, { material?: number; markup?: number }>>(new Map());

  useEffect(() => {
    let live = true;
    loadShopCatalogue().then((mod) => {
      if (!live) return;
      const next = new Map<string, { material?: number; markup?: number }>();
      for (const group of mod.shopGroups) {
        for (const product of group.products) next.set(product.name, product);
      }
      setShopIndex(next);
    });
    return () => {
      live = false;
    };
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const details: ClientDetails = {
      company: String(data.get("company") ?? ""),
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
    };
    saveClient(details);
    const lines = items.map((item) => `${item.qty} \u00d7 ${item.name} at ${priceFor(item.name, shopIndex)}`).join("\n");
    const body = [
      `Name: ${details.name}`,
      `Company: ${details.company}`,
      `Email: ${details.email}`,
      `Phone: ${details.phone}`,
      "",
      "Basket:",
      lines,
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Shop order")}&body=${encodeURIComponent(body)}`;
    setSent(true);
    clear();
  }

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Basket</h1>
        {items.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            The basket is empty.{" "}
            <Link to="/shop" className="font-semibold text-orange">
              Go to the shop
            </Link>
          </p>
        ) : (
          <>
            <ul className="mt-6 divide-y divide-line border border-line bg-card">
              {items.map((item) => (
                <li key={item.name} className="flex items-center gap-3 p-3">
                  <img src={item.image} alt="" className="h-16 w-16 object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">{priceFor(item.name, shopIndex)}</p>
                  </div>
                  <label className="text-xs text-muted">
                    Qty
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(event) => setQty(item.name, Number(event.target.value))}
                      className="ml-2 w-16 border border-line bg-paper px-2 py-1 text-sm text-ink"
                    />
                  </label>
                  <button type="button" onClick={() => remove(item.name)} className="text-sm text-muted hover:text-ink">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={onSubmit} className="mt-8 grid gap-3 rounded-lg border border-line bg-card p-6">
              <h2 className="text-2xl font-bold">Your details</h2>
              <p className="text-sm text-muted">Register these details to send the order. They stay on this browser for the next one.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  Company
                  <input name="company" required defaultValue={client?.company ?? ""} className="border border-line bg-paper px-3 py-3 outline-none focus:border-orange" />
                </label>
                <label className="grid gap-1 text-sm">
                  Name
                  <input name="name" required defaultValue={client?.name ?? ""} className="border border-line bg-paper px-3 py-3 outline-none focus:border-orange" />
                </label>
              </div>
              <label className="grid gap-1 text-sm">
                Email
                <input name="email" type="email" required defaultValue={client?.email ?? ""} className="border border-line bg-paper px-3 py-3 outline-none focus:border-orange" />
              </label>
              <label className="grid gap-1 text-sm">
                Phone
                <input name="phone" required defaultValue={client?.phone ?? ""} className="border border-line bg-paper px-3 py-3 outline-none focus:border-orange" />
              </label>
              {sent ? <p className="text-sm text-muted">Your details were saved, and your mail app should be opening with the order.</p> : null}
              <button type="submit" className="bg-orange px-4 py-3 text-sm font-semibold text-paper">
                Send order
              </button>
            </form>
          </>
        )}
      </section>
    </Shell>
  );
}
