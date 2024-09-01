import { getAvatarUrl } from '../../application/helper/AvatarHelper'
import { GenderType } from '../../domain/common'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetDoctorProfileRequest {
  doctorId: string
  currentUser: User
}

interface GetDoctorProfileResponse {
  id: string
  avatar: string | null
  firstName: string
  lastName: string
  gender: GenderType
  birthDate: Date
  onboardDate: Date
  resignationDate: Date | null
  email: string
  createdAt: Date
  updatedAt: Date
}

export class GetDoctorProfileUseCase {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  public async execute(
    request: GetDoctorProfileRequest
  ): Promise<GetDoctorProfileResponse> {
    const { doctorId, currentUser } = request

    if (currentUser.role === UserRoleType.DOCTOR) {
      const existingDoctor = await this.doctorRepository.findByUserId(
        currentUser.id
      )
      if (existingDoctor === null) {
        throw new NotFoundError('Doctor does not exist.')
      }

      if (doctorId !== existingDoctor.id) {
        throw new AuthorizationError('Doctor can only get self profile.')
      }
      const user = existingDoctor.user

      return {
        id: existingDoctor.id,
        avatar: getAvatarUrl(existingDoctor.avatar),
        firstName: existingDoctor.firstName,
        lastName: existingDoctor.lastName,
        gender: existingDoctor.gender,
        birthDate: existingDoctor.birthDate,
        onboardDate: existingDoctor.onboardDate,
        resignationDate: existingDoctor.resignationDate,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    } else if (currentUser.role === UserRoleType.ADMIN) {
      const existingDoctor = await this.doctorRepository.findById(doctorId)

      if (existingDoctor === null) {
        throw new NotFoundError('Doctor does not exist.')
      }

      return {
        id: existingDoctor.id,
        avatar: getAvatarUrl(existingDoctor.avatar),
        firstName: existingDoctor.firstName,
        lastName: existingDoctor.lastName,
        gender: existingDoctor.gender,
        birthDate: existingDoctor.birthDate,
        onboardDate: existingDoctor.onboardDate,
        resignationDate: existingDoctor.resignationDate,
        email: existingDoctor.user.email,
        createdAt: existingDoctor.user.createdAt,
        updatedAt: existingDoctor.user.updatedAt,
      }
    } else {
      throw new AuthorizationError('Unauthorized access')
    }
  }
}
