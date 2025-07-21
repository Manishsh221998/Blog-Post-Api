const transporter = require("../config/emailConfig");
 
const sendEmailVerification = async (req, data) => {
  try {
    // Create verification link (adjust the URL as needed for your application)
     const verificationLink = `${process.env.BASE_URL}/verify-email/${data._id}`;
    
    const info = await transporter.sendMail({
      from: `"Blog Post" <${process.env.EMAIL_FROM}>`,
      to: data.email,
      subject: "Verify Your Email for Blogging app",
      text: `Please verify your email by clicking the following link: ${verificationLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Blogging app!</h2>
          <p>Thank you for registering. Please verify your email address to complete your account setup.</p>
          <p style="margin: 20px 0;">
            <a href="${verificationLink}" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Verify Email Address
            </a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${verificationLink}</p>
          <p>If you didn't create an account with BookMyMovie, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">This email was sent to ${data.email} as part of your Blogging app account registration.</p>
        </div>
      `,
    });
    
    console.log("Verification email sent successfully: %s", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

module.exports = sendEmailVerification;