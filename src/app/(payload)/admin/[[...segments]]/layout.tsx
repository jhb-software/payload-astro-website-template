import configPromise from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import type { ReactNode } from "react";

import { importMap } from "../importMap.js";

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";

  return handleServerFunctions({ ...args, config: configPromise, importMap });
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
