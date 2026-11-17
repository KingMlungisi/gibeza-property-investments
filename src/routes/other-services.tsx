import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/other-services")({
  beforeLoad: () => {
    throw redirect({ to: "/shop" });
  },
});
