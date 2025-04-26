import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const sendEmail = async (to, subject, text) => {
  try {
    if (!to.endsWith('@gmail.com')) {
      throw new Error('Unsupported email domain. Only Gmail addresses are allowed.');
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"WSU Digital learning platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
};

export default sendEmail;
