import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { name: string; image: string; qty: number };
export type ClientDetails = { company: string; name: string; email: string; phone: string };

const BASKET = "gibeza-basket";
const CLIENT = "gibeza-client";

type CartValue = {
  items: CartItem[];
  add: (item: { name: string; image: string }) => void;
  setQty: (name: string, qty: number) => void;
  remove: (name: string) => void;
  clear: () => void;
  client: ClientDetails | null;
  saveClient: (client: ClientDetails) => void;
};

const CartContext = createContext<CartValue | null>(null);

function readItems(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(BASKET) ?? "[]") as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readClient(): ClientDetails | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(CLIENT) ?? "null") as ClientDetails | null;
    if (!parsed?.email || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readItems());
    setClient(readClient());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(BASKET, JSON.stringify(items));
  }, [items, ready]);

  const value: CartValue = {
    items,
    add(item) {
      setItems((current) => {
        const found = current.find((row) => row.name === item.name);
        if (found) return current.map((row) => (row.name === item.name ? { ...row, qty: row.qty + 1 } : row));
        return [...current, { ...item, qty: 1 }];
      });
    },
    setQty(name, qty) {
      setItems((current) => (qty < 1 ? current.filter((row) => row.name !== name) : current.map((row) => (row.name === name ? { ...row, qty } : row))));
    },
    remove(name) {
      setItems((current) => current.filter((row) => row.name !== name));
    },
    clear() {
      setItems([]);
    },
    client,
    saveClient(next) {
      setClient(next);
      localStorage.setItem(CLIENT, JSON.stringify(next));
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("Basket is only available inside the site.");
  return cart;
}
