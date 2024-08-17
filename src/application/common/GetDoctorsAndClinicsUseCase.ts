import { IClinicRepository } from '../../domain/clinic/interfaces/repositories/IClinicRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'

interface GetDoctorsAndClinicsResponse {
  doctors: Array<{
    id: string
    fullName: string
  }>
  clinics: Array<{
    id: string
    name: string
  }>
}

export class GetDoctorsAndClinicsUseCase {
  constructor(
    private readonly doctorRepository: IDoctorRepository,
    private readonly clinicRepository: IClinicRepository
  ) {}

  public async execute(): Promise<GetDoctorsAndClinicsResponse> {
    const doctors = await this.doctorRepository.findByAll()

    const clinics = await this.clinicRepository.findByAll()

    return {
      doctors,
      clinics,
    }
  }
}
