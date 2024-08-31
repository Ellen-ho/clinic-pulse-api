import { Granularity } from 'domain/common'
import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from 'domain/doctor/interfaces/repositories/IDoctorRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { User, UserRoleType } from 'domain/user/User'
import { RedisServer } from 'infrastructure/database/RedisServer'

interface GetConsultationBookingCountAndRateRequest {
  startDate: string
  endDate: string
  clinicId?: string
  doctorId?: string
  timePeriod?: TimePeriodType
  granularity?: Granularity
  currentUser: User
}

interface GetConsultationBookingCountAndRateResponse {
  totalConsultations: number
  consultationWithOnlineBooking: number
  onlineBookingRate: number
  data: Array<{
    date: string
    onlineBookingCount: number
    consultationCount: number
    onlineBookingRate: number
  }>
}

export class GetConsultationBookingCountAndRateUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly redis: RedisServer
  ) {}

  public async execute(
    request: GetConsultationBookingCountAndRateRequest
  ): Promise<GetConsultationBookingCountAndRateResponse> {
    const {
      startDate,
      endDate,
      clinicId,
      doctorId,
      timePeriod,
      granularity,
      currentUser,
    } = request

    let currentDoctorId = doctorId
    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id
    }

    const redisKey = `online_booking_${currentDoctorId ?? 'allDoctors'}_${
      granularity ?? 'allGranularity'
    }_${startDate}_${endDate}`

    const cachedData = await this.redis.get(redisKey)
    if (cachedData !== null) {
      return JSON.parse(cachedData)
    }

    const result =
      await this.consultationRepository.getDurationBookingByGranularity(
        startDate,
        endDate,
        clinicId,
        currentDoctorId,
        timePeriod,
        granularity
      )

    await this.redis.set(redisKey, JSON.stringify(result), {
      expiresInSec: 31_536_000,
    })

    return result
  }
}
