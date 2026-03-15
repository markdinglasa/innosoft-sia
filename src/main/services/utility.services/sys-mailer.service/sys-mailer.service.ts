import { Resend } from 'resend'
import { InternalServerErrorException } from '../../../common/exceptions'
import { SendEmailDto } from './dto'

export interface ISysMailerService {
  sendEmail(data: SendEmailDto): Promise<any>
}

export class SysMailerService implements ISysMailerService {
  private resend: Resend

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey === 're_...') {
      throw new InternalServerErrorException(
        'RESEND_API_KEY is not configured in the environment variables.'
      )
    }
    this.resend = new Resend(apiKey)
  }

  /**
   * Sends an email using Resend.
   */
  async sendEmail(data: SendEmailDto): Promise<any> {
    const { to, subject, html, from } = data
    
    try {
      const response = await this.resend.emails.send({
        from: from || process.env.EMAIL_FROM || 'noreply@innosoft.com.ph',
        to: [to],
        subject,
        html,
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      return response.data
    } catch (error: any) {
      console.error('Failed to send email:', error)
      throw new Error(`Email sending failed: ${error.message}`)
    }
  }
}
