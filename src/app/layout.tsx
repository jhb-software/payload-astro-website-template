import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import "@/styles.css";

export const metadata: Metadata = {
  title: "De Fryhof",
  description: "Marketing site and group accommodation CMS.",
};

export default async function Layout({ children }: { children: ReactNode }) {
  const locale = (await headers()).get("x-site-locale") || "nl";
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
