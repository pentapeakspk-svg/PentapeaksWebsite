import NextAuth, { type NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import type { JWT } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

export const authOptions: NextAuthOptions = {
  secret,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password")
        }

        let loginType = credentials.loginType as string
        const email = credentials.email as string
        const password = credentials.password as string

        // Check environment variable credentials for admin login
        const adminUsername = process.env.ADMIN_USERNAME
        const adminPassword = process.env.ADMINPASSWORD

        if (adminUsername && adminPassword && email === adminUsername && password === adminPassword) {
          // Return admin user from environment variables
          return {
            id: "admin-env",
            name: "Administrator",
            email: adminUsername,
            role: "ADMIN",
            studentId: null,
            rollNo: null,
            batchId: null,
            batchNo: null,
          }
        }

        // Fall back to database authentication (student or database admin)
        const user = await prisma.user.findUnique({
          where: { email },
          include: { student: { include: { batch: true } } },
        })

        if (!user) {
          throw new Error("No user found with this email")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        // Check if student is blocked
        if (user.student?.blocked) {
          throw new Error("Your account has been blocked by the administrator")
        }

        // Check email verification for student accounts
        // Admin accounts bypass email verification
        if (user.role === "STUDENT" && !user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED")
        }

        // For explicit login types, validate role
        if (loginType === "admin" && user.role !== "ADMIN") {
          throw new Error("You do not have admin access")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.student?.id || null,
          rollNo: user.student?.rollNo || null,
          batchId: user.student?.batchId || null,
          batchNo: user.student?.batch?.batchNo || null,
          paid: user.student?.paid ?? false,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 20 * 60, // 20 minutes
    updateAge: 20 * 60, // Do not extend session beyond 20 minutes
  },
  pages: {
    signIn: "/student/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: unknown }) {
      if (user) {
        token.role = (user as unknown as Record<string, unknown>).role as string
        token.studentId = (user as unknown as Record<string, unknown>).studentId as string | null
        token.rollNo = (user as unknown as Record<string, unknown>).rollNo as string | null
        token.batchId = (user as unknown as Record<string, unknown>).batchId as string | null
        token.batchNo = (user as unknown as Record<string, unknown>).batchNo as string | null
        token.paid = (user as unknown as Record<string, unknown>).paid as boolean | null
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        (session.user as unknown as Record<string, unknown>).id = token.sub
        ;(session.user as unknown as Record<string, unknown>).role = token.role
        ;(session.user as unknown as Record<string, unknown>).studentId = token.studentId
        ;(session.user as unknown as Record<string, unknown>).rollNo = token.rollNo
        ;(session.user as unknown as Record<string, unknown>).batchId = token.batchId
        ;(session.user as unknown as Record<string, unknown>).batchNo = token.batchNo
        ;(session.user as unknown as Record<string, unknown>).paid = token.paid
      }
      return session
    },
  },
}

const auth = NextAuth(authOptions)

export default auth
