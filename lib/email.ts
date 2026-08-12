import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendWelcomeEmail(to: string, name: string, rollNo: string) {
  try {
    await transporter.sendMail({
      from: `"Penta Peaks International" <${process.env.SMTP_USER}>`,
      to,
      subject: "Welcome to Penta Peaks International!",
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1A13; color: #fff; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Playfair Display', serif; color: #D4AF37; font-size: 28px;">Penta Peaks International</h1>
            <p style="color: #9CA3AF; font-size: 14px;">Pakistan's Gateway to Global Markets</p>
          </div>
          <h2 style="color: #D4AF37; margin-bottom: 16px;">Welcome, ${name}!</h2>
          <p style="color: #E8E8E8; line-height: 1.6; margin-bottom: 16px;">
            Thank you for enrolling with Penta Peaks International. Your account has been created successfully.
          </p>
          <div style="background: #132A1F; border: 1px solid #1E3D2E; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 8px 0;"><strong style="color: #D4AF37;">Roll Number:</strong> ${rollNo}</p>
            <p style="margin: 8px 0;"><strong style="color: #D4AF37;">Email:</strong> ${to}</p>
          </div>
          <p style="color: #E8E8E8; line-height: 1.6;">
            You can now log in to your student dashboard to view class links, attendance, and batch information.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/student/login" style="background: #D4AF37; color: #0D1A13; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Login to Dashboard</a>
          </div>
          <hr style="border: none; border-top: 1px solid #1E3D2E; margin: 30px 0;" />
          <p style="color: #6B7280; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Penta Peaks International. All rights reserved.
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error }
  }
}

export async function sendClassLinkNotification(
  emails: string[],
  batchTitle: string,
  linkTitle: string,
  link: string,
  note?: string
) {
  try {
    await transporter.sendMail({
      from: `"Penta Peaks International" <${process.env.SMTP_USER}>`,
      bcc: emails,
      subject: `New Class Link: ${linkTitle} | Penta Peaks International`,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1A13; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="font-family: 'Playfair Display', serif; color: #D4AF37; font-size: 24px; text-align: center;">${linkTitle}</h1>
          <p style="color: #9CA3AF; text-align: center; margin-bottom: 24px;">${batchTitle}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background: #D4AF37; color: #0D1A13; padding: 14px 36px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px;">Join Class Now</a>
          </div>
          ${note ? `<p style="color: #E8E8E8; line-height: 1.6; background: #132A1F; padding: 16px; border-radius: 8px; margin-top: 20px;"><strong style="color: #D4AF37;">Note:</strong> ${note}</p>` : ''}
          <hr style="border: none; border-top: 1px solid #1E3D2E; margin: 30px 0;" />
          <p style="color: #6B7280; font-size: 12px; text-align: center;">Penta Peaks International</p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error }
  }
}
