import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { type NextRequest, NextResponse } from "next/server"
import * as jose from "jose"

// Define route configurations for better organization
const ROUTES = {
  PROTECTED: ["/product", "/profile", "/maintimeline", "/todo", "/chat", "/profilee", "/upload", "/users", "/posts"],
  AUTH: "/auth",
  VERIFY: "/auth/verify",
  COMPLETE_PROFILE: "/auth/complete",
  HOME: "/",
  SIGNIN: "/auth/signin",
}

export default withAuth(
  async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const secret = process.env.NEXTAUTH_SECRET!

    // Get token with a single call to avoid redundancy
    const token = await getToken({
      req: request,
      secret,
      raw: true,
    })

    // Check if user is authenticated
    const isAuthenticated = !!token

    // Check if current path is a protected route
    const isProtectedRoute = ROUTES.PROTECTED.some((route) => pathname.startsWith(route))

    // Check if current path is an auth route
    const isAuthRoute = pathname.startsWith(ROUTES.AUTH)

    // Check if current path is the profile completion route
    const isProfileCompletionRoute = pathname === ROUTES.COMPLETE_PROFILE

    // Check if current path is the verification route
    const isVerificationRoute = pathname === ROUTES.VERIFY

    // Handle authenticated users trying to access auth pages (except verification)
    console.log({
      isAuthenticated,
      isAuthRoute,
      isVerificationRoute
    })
    if (isAuthenticated && isAuthRoute && !isVerificationRoute && !isProfileCompletionRoute) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url))
    }

    // Handle unauthenticated users trying to access protected routes
    if (!isAuthenticated && isProtectedRoute) {
      return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url))
    }

    // For authenticated users accessing protected routes, check profile completion and verification
    if (isAuthenticated && (isProtectedRoute || isVerificationRoute)) {
      try {
        // Verify and decode the token
        const tokenData = (await jose.jwtVerify(token, new TextEncoder().encode(secret))).payload as any

        // First check: Is the profile complete?
        if (!tokenData.profile?.isCompleteProfile && !isProfileCompletionRoute && !isVerificationRoute) {
          return NextResponse.redirect(new URL(ROUTES.COMPLETE_PROFILE, request.url))
        }

        // Second check: Is the device verified? (Only if profile is complete)
        if (tokenData.profile?.isCompleteProfile && !tokenData.session?.isDeviceVerfcation && !isVerificationRoute) {
          return NextResponse.redirect(new URL(ROUTES.VERIFY, request.url))
        }

        // Third check: Is 2FA required but not completed?
        if (!tokenData.session?.is2FACompleted && tokenData.is_2FA && !isVerificationRoute) {
          return NextResponse.redirect(new URL("/auth/two-factor", request.url))
        }

        // User is authenticated, has a complete profile, and is verified - allow access
        return NextResponse.next()
      } catch (error) {
        console.error("Token verification failed:", error)
        // If token verification fails, redirect to login
        return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url))
      }
    }

    // For all other cases, continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // We're handling authorization in the middleware function
    },
  },
)

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", "/api/auth(.*)"],
}
