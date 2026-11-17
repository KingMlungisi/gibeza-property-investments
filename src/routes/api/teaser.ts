import { readFile } from "node:fs/promises";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/teaser")({
  server: {
    handlers: {
      GET: async () => {
        const bytes = await readFile("public/gibeza-teaser.mp4");
        return new Response(bytes, {
          headers: {
            "Content-Type": "video/mp4",
            "Content-Disposition": 'attachment; filename="gibeza-status.mp4"',
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
