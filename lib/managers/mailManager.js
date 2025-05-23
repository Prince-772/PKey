import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "8283acf9371aeb",
      pass: "a73e536faf0847",
    },
  });

  try {
  //   const mailOptions = {
  //     from: `"PKey - Password Manager" <${process.env.EMAIL}>`,
  //     to,
  //     subject,
  //     text,
  //     html,
  //   };

  //   const mailResponse = await transporter.sendMail(mailOptions);

    //   return mailResponse;
    return true
  } catch (err) {
    console.error("Error in sendEmail:", err);
    throw new Error("Failed to send email");
  }
};
