import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const locale = request.nextUrl.pathname.split("/")[1];
  headers.set("x-site-locale", locale === "en" || locale === "de" ? locale : "nl");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!api|admin|_next|media).*)"] };
