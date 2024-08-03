import { GenderType } from '../../domain/common'
import { Doctor } from 'domain/doctor/Doctor'
import { User } from 'domain/user/User'
import { IUuidService } from 'domain/utils/IUuidService'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'

interface CreateDoctorRequest {
  firstName: string
  lastName: string
  onboardDate: Date
  resignationDate: Date | null
  avatar: string | null
  gender: GenderType
  birthDate: Date
  user: User
}

interface CreateDoctorResponse {
  id: string
}

export class CreateDoctorUseCase {
  constructor(
    private readonly doctorRepository: IDoctorRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateDoctorRequest
  ): Promise<CreateDoctorResponse> {
    const {
      firstName,
      lastName,
      onboardDate,
      resignationDate,
      avatar,
      gender,
      birthDate,
      user,
    } = request

    const doctor = new Doctor({
      id: this.uuidService.generateUuid(),
      firstName,
      lastName,
      onboardDate,
      resignationDate,
      avatar,
      gender,
      birthDate,
      user,
    })

    await this.doctorRepository.save(doctor)

    return {
      id: doctor.id,
    }
  }
}
