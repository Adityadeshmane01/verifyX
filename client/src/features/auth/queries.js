import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";

export const currentUserQueryOptions = queryOptions({
  queryKey: ["currentUser"],
  queryFn: async () => {
    try {
      return await apiFetch("/api/auth/me");
    } catch (err) {
      // Return null instead of throwing if the user is unauthenticated
      return null;
    }
  },
  staleTime: 1000 * 60 * 5, // 5 minutes cache
  retry: false,
});

export const verificationsQueryOptions = queryOptions({
  queryKey: ["verifications"],
  queryFn: async () => {
    try {
      return await apiFetch("/api/verifications/history");
    } catch (err) {
      return [];
    }
  },
  staleTime: 1000 * 30, // 30 seconds cache
});
