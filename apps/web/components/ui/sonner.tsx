"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0a0a0a] group-[.toaster]:text-foreground group-[.toaster]:border-[#222222] group-[.toaster]:shadow-lg font-sans",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-foreground group-[.toast]:text-background font-medium",
          cancelButton:
            "group-[.toast]:bg-[#111111] group-[.toast]:border-[#222222] group-[.toast]:text-muted-foreground font-medium",
        },
      }}
      {...props}
    />
  );
}
