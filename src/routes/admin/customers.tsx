import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [{ title: "Customers — MOCS Admin" }],
  }),
  component: AdminCustomersRedirect,
});

function AdminCustomersRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/admin/users" });
  }, [navigate]);
  return null;
}
