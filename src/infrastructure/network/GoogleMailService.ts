import SMTPTransport from 'nodemailer/lib/smtp-transport'
import nodemailer, { Transporter } from 'nodemailer'
import {
  IMailService,
  ISendMailParams,
} from '../../domain/network/interfaces/IMailService'

const SENDER_EMAIL_ADDRESS = process.env.SENDER_EMAIL_ADDRESS as string
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD as string

export class GoogleMailService implements IMailService {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL_ADDRESS,
        pass: GMAIL_PASSWORD,
      },
    })
  }

  async sendMail({ to, subject, html }: ISendMailParams): Promise<void> {
    const mailOptions = {
      from: SENDER_EMAIL_ADDRESS,
      to,
      subject,
      html,
    }
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error != null) {
        console.error('Error sending email: ', error)
      } else {
        console.log('Email sent: ', info.response)
      }
    })
  }
}
