import { Resend } from "resend"
import crypto from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Penta Peaks International <noreply@pentapeaks.com>"

/**
 * Generate a secure random verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

/**
 * Send email verification link to a newly enrolled user
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
) {
  const isProd = process.env.NODE_ENV === "production"
  const baseUrl = isProd ? "https://pentapeaks.com" : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
  const verifyUrl = `${baseUrl}/student/verify?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Verify Your Email - Penta Peaks International",
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1A13; color: #fff; padding: 0; border-radius: 12px; overflow: hidden;">
          <!-- Top gold accent bar -->
          <div style="height: 4px; background: linear-gradient(90deg, #1C5230, #C8963E, #1C5230);"></div>
          
          <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #D4AF37; font-size: 28px; margin: 0;">Penta Peaks International</h1>
              <p style="color: #9CA3AF; font-size: 14px; margin-top: 8px;">Pakistan's Gateway to Global Markets</p>
            </div>

            <h2 style="color: #D4AF37; margin-bottom: 16px; font-size: 22px;">Verify Your Email, ${name}!</h2>
            
            <p style="color: #E8E8E8; line-height: 1.6; margin-bottom: 16px;">
              Thank you for enrolling with Penta Peaks International. To complete your registration and access your student dashboard, please verify your email address.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${verifyUrl}" style="background: #D4AF37; color: #0D1A13; padding: 14px 36px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px; letter-spacing: 0.5px;">Verify Email Address</a>
            </div>

            <div style="background: #132A1F; border: 1px solid #1E3D2E; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
                If the button above doesn't work, copy and paste this link into your browser:<br/>
                <a href="${verifyUrl}" style="color: #D4AF37; word-break: break-all; font-size: 12px;">${verifyUrl}</a>
              </p>
            </div>

            <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6;">
              This verification link will expire in <strong style="color: #E8E8E8;">24 hours</strong>. If you didn't create an account with us, you can safely ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #1E3D2E; margin: 30px 0;" />
            <p style="color: #6B7280; font-size: 12px; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} Penta Peaks International. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("[resend] verification email error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("[resend] verification email error:", error)
    return { success: false, error }
  }
}

/**
 * Send welcome email after email is verified
 */
export async function sendWelcomeEmailResend(
  to: string,
  name: string,
  rollNo: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to Penta Peaks International!",
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1A13; color: #fff; padding: 0; border-radius: 12px; overflow: hidden;">
          <div style="height: 4px; background: linear-gradient(90deg, #1C5230, #C8963E, #1C5230);"></div>
          <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #D4AF37; font-size: 28px; margin: 0;">Penta Peaks International</h1>
              <p style="color: #9CA3AF; font-size: 14px; margin-top: 8px;">Pakistan's Gateway to Global Markets</p>
            </div>
            <h2 style="color: #D4AF37; margin-bottom: 16px;">Welcome, ${name}!</h2>
            <p style="color: #E8E8E8; line-height: 1.6; margin-bottom: 16px;">
              Your email has been verified and your account is now fully active. You're all set to begin your export journey!
            </p>
            <div style="background: #132A1F; border: 1px solid #1E3D2E; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="margin: 8px 0;"><strong style="color: #D4AF37;">Roll Number:</strong> ${rollNo}</p>
              <p style="margin: 8px 0;"><strong style="color: #D4AF37;">Email:</strong> ${to}</p>
            </div>
            <p style="color: #E8E8E8; line-height: 1.6;">
              You can now log in to your student dashboard to view class links, attendance, and batch information.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NODE_ENV === "production" ? "https://pentapeaks.com" : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")}/student/login" style="background: #D4AF37; color: #0D1A13; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Login to Dashboard</a>
            </div>
            <hr style="border: none; border-top: 1px solid #1E3D2E; margin: 30px 0;" />
            <p style="color: #6B7280; font-size: 12px; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} Penta Peaks International. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("[resend] welcome email error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("[resend] welcome email error:", error)
    return { success: false, error }
  }
}
