"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Suppress React 19 inline script warnings in dev mode safely inside useEffect
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const origConsoleError = console.error;
      console.error = (...args: any[]) => {
        if (
          typeof args[0] === "string" &&
          args[0].includes("Encountered a script tag")
        )
          return;
        origConsoleError.apply(console, args);
      };
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
