import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useLogs() {
  return useQuery({
    queryKey: [api.logs.list.path],
    queryFn: async () => {
      const res = await fetch(api.logs.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch logs");
      // Use the Zod schema from responses to validate
      return api.logs.list.responses[200].parse(await res.json());
    },
    refetchInterval: 2000, // Poll every 2 seconds for real-time feel
  });
}
