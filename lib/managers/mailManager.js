import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const mailOptions = {
      from: `"PKey Security" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      text,
      html,
    };
    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (err) {
    console.error("Nodemailer Error:", err);

    let safeMessage = "Something went wrong. Please try again.";

    if (err.responseCode === 535) {
      safeMessage = "Email service authentication failed.";
    } else if (err.code === "ECONNECTION") {
      safeMessage = "Unable to connect to email server.";
    }

    throw new Error(safeMessage);
  }
};
