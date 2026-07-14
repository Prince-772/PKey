import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authRateLimit, apiRateLimit, signupRateLimit, editFavoriteRateLimit } from "./lib/rateLimit";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;
  const pathname = url.pathname;
  const isMaintenance = process.env.MAINTENANCE_MODE === "true";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

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
  const strictRoutes = [
    "/api/auth/callback/credentials",
    "/api/auth/signup",
    "/api/auth/resend-verification",
  ];
  const isResetPassword = pathname.startsWith("/api/auth/resetPassword");
  const isEditFavorite = pathname.startsWith("/api/protected/passwords/editfavorite");
  const isOAuthRoute =
    pathname.startsWith("/api/auth/signin") ||
    pathname.startsWith("/api/auth/callback");

  if (pathname.startsWith("/api/auth/signup")) {
    const { success } = await signupRateLimit.limit(ip);
    if (!success)
      return NextResponse.json(
        { message: "Too many signup attempts." },
        { status: 429 },
      );
  } else if (isEditFavorite) {
    const { success } = await editFavoriteRateLimit.limit(ip);
    if (!success)
      return NextResponse.json(
        { message: "Too many attempts. Please wait for a while." },
        { status: 429 },
      );
  } else if (
    strictRoutes.some((r) => pathname.startsWith(r)) ||
    isResetPassword
  ) {
    const { success, limit, remaining, reset } = await authRateLimit.limit(ip);
    if (!success) {
      if (isOAuthRoute) {
        return NextResponse.redirect(
          new URL(
            "/auth/error?error=RateLimited",
            req.url,
          ),
        );
      }
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }
  } else if (strictRoutes.some((r) => pathname.startsWith(r)) || pathname.startsWith("/api")) {
    const { success } = await apiRateLimit.limit(ip);
    if (!success) {
      if (isOAuthRoute) {
        return NextResponse.redirect(
          new URL("/auth/error?error=RateLimited", req.url),
        );
      }
      return NextResponse.json(
        { message: "Too many requests. Please wait for a while." },
        { status: 429 },
      );
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
  matcher: ["/api/:path*", "/dashboard", "/vault", "/masterPass"],
};
