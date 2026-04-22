import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      {children}
      <Toaster position="top-right" />
    </AppProvider>
  );
}
