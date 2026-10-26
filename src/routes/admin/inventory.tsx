import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [{ title: "Inventory — MOCS Admin" }],
  }),
  component: AdminInventoryRedirect,
});

function AdminInventoryRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/admin/products" });
  }, [navigate]);
  return null;
}
