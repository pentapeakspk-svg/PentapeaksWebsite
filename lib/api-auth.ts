import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Verify that the request has a valid admin session.
 * Returns { isValid: true, session } on success, or { isValid: false, error: string } on failure.
 */
export async function verifyAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { isValid: false, error: "Unauthorized: No session" };
  }

  if ((session.user as any)?.role !== "ADMIN") {
    return { isValid: false, error: "Forbidden: Admin access required" };
  }

  return { isValid: true, session };
}

/**
 * Verify that the request has a valid user session (student or admin).
 */
export async function verifyUserSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { isValid: false, error: "Unauthorized: No session" };
  }

  return { isValid: true, session };
}
