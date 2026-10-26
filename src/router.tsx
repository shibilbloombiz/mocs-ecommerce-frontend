import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",       // preload data on link hover
    defaultPreloadStaleTime: 60_000, // don't re-fetch if data < 60s old
    defaultStaleTime: 60_000,        // loader data stays fresh for 60s after navigation
  });

  return router;
};
