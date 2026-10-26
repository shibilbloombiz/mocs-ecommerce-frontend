import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [{ title: "Categories & Collections — MOCS Admin" }],
  }),
  component: AdminCategoriesRedirect,
});

function AdminCategoriesRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/admin/settings" });
  }, [navigate]);
  return null;
}
