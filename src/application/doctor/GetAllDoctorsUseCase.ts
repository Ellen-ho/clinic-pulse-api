import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'

interface GetAllDoctorsResponse {
  doctors: Array<{
    id: string
    fullName: string
  }>
}

export class GetAllDoctorsUseCase {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  public async execute(): Promise<GetAllDoctorsResponse> {
    const doctors = await this.doctorRepository.findByAll()

    return {
      doctors,
    }
  }
}
