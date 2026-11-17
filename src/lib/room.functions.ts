import { createServerFn } from "@tanstack/react-start";

export const openRoom = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Enter the username and password.");
    const username = "username" in input ? String(input.username) : "";
    const password = "password" in input ? String(input.password) : "";
    if (!username.trim() || !password) throw new Error("Enter the username and password.");
    return { username, password };
  })
  .handler(async ({ data }) => {
    const { checkRoomLogin, filesInRoom } = await import("./room.server");
    const session = checkRoomLogin(data.username, data.password);
    if (!session) return { ok: false as const, message: "That username or password is not recognised." };
    return { ok: true as const, token: session.token, username: session.username, files: await filesInRoom() };
  });

export const loadRoom = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const token = input && typeof input === "object" && "token" in input ? String(input.token) : "";
    if (!token) throw new Error("Missing session.");
    return { token };
  })
  .handler(async ({ data }) => {
    const { verifyRoomToken, filesInRoom } = await import("./room.server");
    if (!verifyRoomToken(data.token)) return { ok: false as const };
    return { ok: true as const, files: await filesInRoom() };
  });
