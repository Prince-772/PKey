import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  try {
    const mailOptions = {
      from: `"PKey - Password Manager" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      text,
      html,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (err) {
    throw new Error("Failed to send email");
  }
};
