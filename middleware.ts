import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequestWithAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname
    const token = request.nextauth.token

    // Allow public access to verify page (users click link from email before being logged in)
    if (pathname.startsWith("/student/verify")) {
      return NextResponse.next()
    }

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/student/login", request.url))
    }

    const userRole = token.role as string | undefined

    // Redirect based on role and requested path
    if (pathname.startsWith("/admin")) {
      if (userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/student/dashboard", request.url))
      }
    }

    if (pathname.startsWith("/student")) {
      if (userRole !== "STUDENT") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public access to verify page
        if (req.nextUrl.pathname.startsWith("/student/verify")) {
          return true
        }
        // Allow access if token exists
        return !!token
      },
    },
    pages: {
      signIn: "/student/login",
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
  ],
}
