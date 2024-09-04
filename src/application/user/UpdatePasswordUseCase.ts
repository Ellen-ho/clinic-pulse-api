import { IUserRepository } from 'domain/user/interfaces/repositories/IUserRepository'
import { AuthenticationError } from 'infrastructure/error/AuthenticationError'
import { IHashGenerator } from '../../domain/utils/IHashGenerator'
import { NotFoundError } from 'infrastructure/error/NotFoundError'
import jwt from 'jsonwebtoken'

interface UpdatePasswordRequest {
  newPassword: string
  resetToken: string
}

interface UpdatePasswordResponse {
  success: boolean
}

export class UpdatePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashGenerator: IHashGenerator
  ) {}

  public async execute(
    request: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponse> {
    const { newPassword, resetToken } = request

    const payload = jwt.verify(
      resetToken,
      process.env.RESET_PASSWORD_MAIL_JWT_SECRET as string
    ) as jwt.JwtPayload

    const idInPayload = payload.id
    if (idInPayload == null) {
      throw new NotFoundError('Id not found in token payload.')
    }

    const validUser = await this.userRepository.findById(idInPayload)

    if (validUser == null) {
      throw new AuthenticationError('The user is not valid.')
    }

    const hashedNewPassword = await this.hashGenerator.hash(newPassword)
    try {
      validUser.updateData({
        password: hashedNewPassword,
      })

      await this.userRepository.save(validUser)

      return { success: true }
    } catch (error) {
      throw new Error('Update password failed.')
    }
  }
}
