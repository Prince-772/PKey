import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;
  const pathname = url.pathname;
  const isMaintenance = process.env.MAINTENANCE_MODE === "true";

  if (isMaintenance) {
    const allowedEmails = [
      process.env.ADMIN_EMAIL1,
      process.env.ADMIN_EMAIL2,
      process.env.ADMIN_EMAIL3,
      process.env.ADMIN_EMAIL4,
      process.env.ADMIN_EMAIL5,
    ].filter(Boolean); // remove undefined

    if (!token || !allowedEmails.includes(token.email)) {
      return new NextResponse("🚧 Site under maintenance", { status: 503 });
    }
  }

  if (!token) {
    if (pathname.startsWith("/api/protected/")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in" },
        { status: 401 },
      );
    } else if (["/dashboard", "/vault", "/masterPass"].includes(pathname)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/protected/:path*", "/dashboard", "/vault", "/masterPass"],
};
