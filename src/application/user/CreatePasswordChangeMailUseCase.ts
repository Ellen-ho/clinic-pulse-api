import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import jwt from 'jsonwebtoken'
import { getResetPasswordTemplate } from './constant/MailTemplate'
import { IMailService } from '../../domain/network/interfaces/IMailService'

interface CreatePasswordChangeMailRequest {
  email: string
}

interface CreatePasswordChangeMailResponse {
  success: boolean
  error?: string
}

export class CreatePasswordChangeMailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailService: IMailService
  ) {}

  public async execute(
    request: CreatePasswordChangeMailRequest
  ): Promise<CreatePasswordChangeMailResponse> {
    const { email } = request

    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser == null) {
      throw new NotFoundError('This user does not exist.')
    }

    const userEmail = existingUser.email

    const resetToken = jwt.sign(
      { id: existingUser.id, mail: userEmail },
      process.env.RESET_PASSWORD_MAIL_JWT_SECRET as string,
      {
        expiresIn: '30min',
      }
    )
    const passwordResetLink = `${
      process.env.CLIENT_URL as string
    }/reset-password?token=${resetToken}`

    const htmlMailTemplate = getResetPasswordTemplate({
      resetLink: passwordResetLink,
    })

    try {
      await this.mailService.sendMail({
        to: [userEmail],
        subject: '[診所系統] 密碼重設',
        html: htmlMailTemplate,
      })

      return { success: true }
    } catch (error) {
      if (error instanceof NotFoundError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }
}
