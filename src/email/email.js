import nodemailer from "nodemailer";
import { emailHtml } from "./email.Html.js";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/appError.js";

export const sendEmails = async (res, email, next) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  if (!process.env.JWT_KEY_EMAIL_TOKEN) {
    return next(new AppError("JWT secret key not set", 500));
  }

  jwt.sign({ email }, process.env.JWT_KEY_EMAIL_TOKEN, async (err, token) => {
    if (err) {
      console.error("Error signing JWT:", err);
      return next(new AppError("Error generating token", 500)); // Use AppError here
    }

    // Sending the email
    const mailOptions = {
      from: `"Job Application" <${process.env.EMAIL_USERNAME}>`, // Corrected template string
      to: email,
      subject: "Hello ✔", // Subject line
      html: emailHtml(token), // HTML body
    };

    transporter.sendMail(mailOptions, (sendError, info) => {
      if (sendError) {
        console.error("Error sending email:", sendError);
        return next(new AppError("Error sending email", 500)); // Use AppError here
      }
      res.status(200).json({ message: "Email sent successfully" }); // Send success response
    });
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const sendResetPasswordEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const htmlTemplate = `
    <h1>Password Reset Request</h1>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>Use this OTP to reset your password. It will expire in 10 minutes.</p>
  `;

  await transporter.sendMail({
    from: `"Job Application" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: "Password Reset Request",
    html: htmlTemplate,
  });
};
