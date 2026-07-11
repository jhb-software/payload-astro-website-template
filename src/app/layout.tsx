import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles.css";

export const metadata: Metadata = {
  title: "De Fryhof",
  description: "Marketing site and group accommodation CMS.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
