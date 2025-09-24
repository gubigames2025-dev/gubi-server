import nodemailer from 'nodemailer';
import { EmailProvider, SendEmailParams, EmailResult } from './email.interface';

export class NodemailerProvider implements EmailProvider {
  async sendEmail({ toEmail, toName, subject, htmlContent }: SendEmailParams): Promise<EmailResult> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'br590.hostgator.com.br',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || 'contato@gubi.com.br',
          pass: process.env.SMTP_PASS || 'Gubi#2023!',
        },
        // Configurações adicionais para melhor deliverability
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5,
      });

      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Gubi Discovery'}" <${process.env.SMTP_FROM_EMAIL || 'contato@gubi.com.br'}>`,
        to: `${toName} <${toEmail}>`,
        subject,
        html: htmlContent,
        // Headers para melhor tracking
        headers: {
          'X-Mailer': 'Gubi Discovery App',
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
        },
      };

      const info = await transporter.sendMail(mailOptions);

      console.log('Nodemailer email sent successfully:', {
        messageId: info.messageId,
        to: toEmail,
        response: info.response,
      });
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error: any) {
      console.error('Nodemailer error:', {
        error: error.message,
        to: toEmail,
        code: error.code,
        command: error.command,
      });
      
      return {
        success: false,
        error: error.message,
      };
    }
  }
}