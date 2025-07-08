import nodemailer from 'nodemailer';

interface SendEmailParams {
  toEmail: string;
  toName: string;
  subject: string;
  htmlContent: string;
}

export default async function sendEmail({ toEmail, toName, subject, htmlContent }: SendEmailParams): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: 'br590.hostgator.com.br',
      port: 587,
      secure: false,
      auth: {
        user: 'contato@gubi.com.br',
        pass: 'Gubi#2023!',
      },
    });

    const info = await transporter.sendMail({
      from: '"Gubi Discovery" <contato@gubi.com.br>',
      to: `${toName} <${toEmail}>`,
      subject,
      html: htmlContent,
    });

    console.log(`Email sent: ${info.messageId}`);
  } catch (error: any) {
    console.error(`Email error: ${error.message}`);
  }
}