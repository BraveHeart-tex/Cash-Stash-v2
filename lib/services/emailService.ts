import { env } from "@/env";
import nodemailer, { type Transporter } from "nodemailer";

type SendEmailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

class EmailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: Number.parseInt(env.EMAIL_PORT as string),
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }

  public async sendEmail(options: SendEmailOptions) {
    await this.transporter.sendMail(options);
  }
}

const emailService = new EmailService();

export default emailService;
