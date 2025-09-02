import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email, frontendOrigin) => {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "template.hbs"),
    "utf8"
  );

  const template = handlebars.compile(emailTemplateSource);

  const htmlToSend = template({
    token: encodeURIComponent(token),
    // Usa direttamente l'origine passata dal frontend
    FRONTEND_ORIGIN: frontendOrigin,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Verify your email",
    html: htmlToSend,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      throw new Error(error);
    }
    console.log("Email sent succesfully: " + info.response);
  });
};
