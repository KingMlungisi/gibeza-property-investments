import { createFileRoute } from "@tanstack/react-router";
import { DepartmentPage } from "@/components/site/department";

export const Route = createFileRoute("/office")({
  component: function Office() {
    return <DepartmentPage id="office" />;
  },
});
