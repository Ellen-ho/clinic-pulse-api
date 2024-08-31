import { RedisServer } from 'infrastructure/database/RedisServer'
import { Granularity } from '../../domain/common'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { User, UserRoleType } from '../../domain/user/User'

interface GetConsultationOnsiteCanceledCountAndRateRequest {
  startDate: string
  endDate: string
  clinicId?: string
  doctorId?: string
  timePeriod?: TimePeriodType
  granularity?: Granularity
  currentUser: User
}

interface GetConsultationOnsiteCanceledCountAndRateResponse {
  totalConsultations: number
  consultationWithOnsiteCancel: number
  onsiteCancelRate: number
  data: Array<{
    date: string
    onsiteCancelCount: number
    consultationCount: number
    onsiteCancelRate: number
  }>
}

export class GetConsultationOnsiteCanceledCountAndRateUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly redis: RedisServer
  ) {}

  public async execute(
    request: GetConsultationOnsiteCanceledCountAndRateRequest
  ): Promise<GetConsultationOnsiteCanceledCountAndRateResponse> {
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

    const redisKey = `onsite_canceled_${currentDoctorId ?? 'allDoctors'}_${
      granularity ?? 'allGranularity'
    }_${startDate}_${endDate}`

    const cachedData = await this.redis.get(redisKey)
    if (cachedData !== null) {
      return JSON.parse(cachedData)
    }

    const result =
      await this.consultationRepository.getDurationCanceledByGranularity(
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
