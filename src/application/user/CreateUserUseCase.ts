import { User, UserRoleType } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { IHashGenerator } from '../../domain/utils/IHashGenerator'
import { IUuidService } from '../../domain/utils/IUuidService'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface CreateUserRequest {
  email: string
  password: string
  role: UserRoleType
}

interface CreateUserResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly uuidService: IUuidService,
    private readonly hashGenerator: IHashGenerator
  ) {}

  public async execute(
    request: CreateUserRequest
  ): Promise<CreateUserResponse> {
    const { email, password, role } = request

    const userExists = await this.userRepository.findByEmail(email)

    if (userExists !== null) {
      throw new ValidationError('User already exists with this email.')
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const user = new User({
      id: this.uuidService.generateUuid(),
      email,
      hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.userRepository.save(user)

    return { user }
  }
}
