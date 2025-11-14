import { NextRequest, NextResponse } from "next/server";
import { validateSessionTokenInMiddleware } from "./lib/session";

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/login";
  const sessionToken = request.cookies.get("session")?.value;

  if (!isLoginPage && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isLoginPage && sessionToken) {
    const isValid = await validateSessionTokenInMiddleware(sessionToken);

    if (!isValid) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  if (isLoginPage && sessionToken) {
    const isValid = await validateSessionTokenInMiddleware(sessionToken);

    if (isValid) {
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      const response = NextResponse.next();
      response.cookies.delete("session");
      return response;
    }
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (!origin || new URL(origin).host !== host) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
  }

  const response = NextResponse.next();

  if (sessionToken) {
    response.cookies.set({
      name: "session",
      value: sessionToken,
      maxAge: 60 * 60 * 24,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
