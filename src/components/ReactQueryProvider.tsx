"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

interface ProviderProps {
  children: React.ReactNode;
}

export default function ReactQueryProvider({ children }: ProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
