import { Granularity } from '../../domain/common'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { User, UserRoleType } from '../../domain/user/User'

interface GetConsultationOnsiteCanceledAndBookingRequest {
  startDate: string
  endDate: string
  clinicId?: string
  doctorId?: string
  timePeriod?: TimePeriodType
  granularity?: Granularity
  currentUser: User
}

interface GetConsultationOnsiteCanceledAndBookingResponse {
  totalConsultations: number
  consultationWithOnlineBooking: number
  consultationWithOnsiteCancel: number
  onlineBookingRate: number
  onsiteCancelRate: number
  data: Array<{
    date: string
    onlineBookingCount: number
    onsiteCancelCount: number
    consultationCount: number
    onlineBookingRate: number
    onsiteCancelRate: number
  }>
}

export class GetConsultationOnsiteCanceledAndBookingUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetConsultationOnsiteCanceledAndBookingRequest
  ): Promise<GetConsultationOnsiteCanceledAndBookingResponse> {
    const {
      startDate,
      endDate,
      clinicId,
      doctorId,
      timePeriod,
      granularity,
      currentUser,
    } = request

    let currentDoctorId
    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id
    }

    const result =
      await this.consultationRepository.getDurationCanceledAndBookingByGranularity(
        startDate,
        endDate,
        clinicId,
        currentDoctorId !== undefined ? currentDoctorId : doctorId,
        timePeriod,
        granularity
      )

    return result
  }
}
