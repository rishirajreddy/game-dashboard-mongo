import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const MAGIC_LINK_REDIRECT = process.env.MAGIC_LINK_REDIRECT;

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: false,
  auth: {
    user: "gamekidzesport@gmail.com",
    pass: "lfjgoohimkdvibsw",
  },
  tls: {
    rejectUnauthorized: true,
  },
});

async function initiateOTP({ mail, otp }: { mail: string; otp: number }) {
  const mailOptions: Mail.Options = {
    from: "gamekidzesport@gmail.com",
    to: mail,
    subject: "One Time Password",
    text: `${otp}`,
  };

  const mailResponse = await transporter.sendMail(mailOptions);

  console.log("Email sent: " + mailResponse);
}

const NodeMail = {
  service: {
    initiateOTP,
  },
};

export default NodeMail;
