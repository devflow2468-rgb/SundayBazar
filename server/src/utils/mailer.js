import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  // Always log OTP to console for seamless local test & evaluation
  console.log(`\n========================================`);
  console.log(`[SUNDAY BAZAR] OTP for ${email}: >>> ${otp} <<<`);
  console.log(`========================================\n`);

  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_email@gmail.com") {
    // Console fallback is ready and documented
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || "Sunday Bazar <no-reply@sundaybazar.pk>",
      to: email,
      subject: `[Sunday Bazar] Your Account Verification OTP: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 25px; border-radius: 8px;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1B9425; margin-top: 0;">Sunday Bazar</h2>
            <p style="color: #1e293b; font-size: 16px;">Assalam-o-Alaikum / Hello,</p>
            <p style="color: #475569; font-size: 15px;">Welcome to Sunday Bazar! Use the following 6-digit One-Time Password (OTP) to verify your Gmail registration:</p>
            <div style="background: #f1fbf3; border: 2px dashed #1B9425; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #1B9425; margin: 20px 0; border-radius: 6px;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 13px;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 Sunday Bazar - Inspired by Daraz. High performance MERN eCommerce.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("[Nodemailer Error] Fallback to console OTP:", err.message);
    return false;
  }
};
