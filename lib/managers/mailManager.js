import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  // let transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.EMAIL_ID,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // Looking to send emails in production? Check out our Email API/SMTP product!
  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "8283acf9371aeb",
      pass: "a73e536faf0847",
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
