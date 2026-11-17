import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/room-file")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";
        const token = url.searchParams.get("token") ?? "";
        const { verifyRoomToken, readRoomFile } = await import("@/lib/room.server");
        if (!verifyRoomToken(token)) return new Response("Unauthorized", { status: 401 });
        const file = await readRoomFile(id);
        if (!file) return new Response("Not found", { status: 404 });
        return new Response(file.bytes, {
          headers: { "Content-Type": file.type, "Cache-Control": "private, no-store" },
        });
      },
    },
  },
});
