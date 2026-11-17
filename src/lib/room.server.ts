import { createHmac, timingSafeEqual } from "node:crypto";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { roomUsers, roomSecret } from "@/data/room-access.server";
import { roomPages } from "@/data/room-pages";

export const profileDir = resolve(process.cwd(), "storage/profile");

const kinds: Record<string, "pdf" | "image"> = {
  ".pdf": "pdf",
  ".jpg": "image",
  ".jpeg": "image",
  ".png": "image",
  ".webp": "image",
};

function same(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function signRoomToken(username: string) {
  const payload = Buffer.from(JSON.stringify({ u: username, e: Date.now() + 12 * 60 * 60 * 1000 })).toString("base64url");
  const sig = createHmac("sha256", roomSecret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyRoomToken(token: string) {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", roomSecret).update(payload).digest("base64url");
  if (!same(sig, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as { u?: string; e?: number };
    if (!parsed.u || !parsed.e || parsed.e < Date.now()) return null;
    return parsed.u;
  } catch {
    return null;
  }
}

export function checkRoomLogin(username: string, password: string) {
  const user = roomUsers.find((item) => same(item.username, username.trim()) && same(item.password, password));
  if (!user) return null;
  return { username: user.username, token: signRoomToken(user.username) };
}

function matchName(id: string, names: string[]) {
  return names.find((name) => {
    const lower = name.toLowerCase();
    return Object.keys(kinds).some((ext) => lower === `${id}${ext}`);
  });
}

export async function filesInRoom() {
  let names: string[] = [];
  try {
    names = await readdir(profileDir);
  } catch {
    names = [];
  }
  const found: Record<string, "pdf" | "image"> = {};
  for (const page of roomPages) {
    const match = matchName(page.id, names);
    if (!match) continue;
    const ext = match.slice(match.lastIndexOf(".")).toLowerCase();
    const kind = kinds[ext];
    if (kind) found[page.id] = kind;
  }
  return found;
}

const extraIds = new Set(["company-profile"]);

export function filePath(id: string, names: string[]) {
  if (!roomPages.some((item) => item.id === id) && !extraIds.has(id)) return null;
  const match = matchName(id, names);
  if (!match || match.includes("/") || match.includes("\\")) return null;
  const path = resolve(profileDir, match);
  if (!path.startsWith(profileDir)) return null;
  return path;
}

export async function readRoomFile(id: string) {
  const { readFile } = await import("node:fs/promises");
  const { extname } = await import("node:path");
  let names: string[] = [];
  try {
    names = await readdir(profileDir);
  } catch {
    names = [];
  }
  const path = filePath(id, names);
  if (!path) return null;
  const bytes = await readFile(path);
  const types: Record<string, string> = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return { bytes: new Uint8Array(bytes), type: types[extname(path).toLowerCase()] ?? "application/octet-stream" };
}
