import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



export async function middleware(req: NextRequest) {
    console.log("🔥 Middleware POKRENUT:", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  console.log(token)

  const publicPaths = ["/login", "/register", "/favicon.ico"];
  const isPublic = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  if (!isAuthenticated && !isPublic) {
    console.log("🔒 Blocked unauthenticated access to:", req.nextUrl.pathname);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(appointments|dashboard|add-user|massage-clients)(/.*)?"],
};
