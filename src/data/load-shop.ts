type Catalogue = typeof import("./shop-catalogue");

let pending: Promise<Catalogue> | null = null;

export function loadShopCatalogue() {
  pending ??= import("./shop-catalogue");
  return pending;
}

export function prefetchShopCatalogue() {
  if (typeof window === "undefined") return;
  const start = () => {
    void loadShopCatalogue();
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(start);
  else setTimeout(start, 400);
}
