import nodemailer, { Transporter } from "nodemailer";

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
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT!),
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public async sendEmail(options: SendEmailOptions) {
    await this.transporter.sendMail(options);
  }
}

const emailService = new EmailService();

export default emailService;
