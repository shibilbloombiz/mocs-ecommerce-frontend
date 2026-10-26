import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login — MOCS" }],
  }),
  component: AdminLoginRedirect,
});

function AdminLoginRedirect() {
  const navigate = useNavigate();
  const { user } = useStore();
  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  useEffect(() => {
    if (isAdmin) {
      navigate({ to: "/admin/dashboard" });
    } else {
      navigate({ to: "/auth", search: { redirect: "/admin/dashboard" } });
    }
  }, [isAdmin, navigate]);

  return null;
}
