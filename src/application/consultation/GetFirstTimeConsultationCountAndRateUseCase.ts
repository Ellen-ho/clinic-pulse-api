import { RedisServer } from 'infrastructure/database/RedisServer'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { User, UserRoleType } from 'domain/user/User'
import { DoctorRepository } from 'infrastructure/entities/doctor/DoctorRepository'
import { Granularity } from 'domain/common'

interface GetFirstTimeConsultationCountAndRateRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  doctorId?: string
  granularity?: Granularity
  currentUser: User
}

interface GetFirstTimeConsultationCountAndRateResponse {
  firstTimeConsultationCount: number
  firstTimeConsultationRate: number
  totalConsultations: number
  data: Array<{
    date: string
    firstTimeCount: number
    consultationCount: number
    firstTimeRate: number
  }>
}

export class GetFirstTimeConsultationCountAndRateUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly redis: RedisServer
  ) {}

  public async execute(
    request: GetFirstTimeConsultationCountAndRateRequest
  ): Promise<GetFirstTimeConsultationCountAndRateResponse> {
    const {
      startDate,
      endDate,
      clinicId,
      timePeriod,
      doctorId,
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
      await this.consultationRepository.getDurationFirstTimeByGranularity(
        startDate,
        endDate,
        clinicId,
        timePeriod,
        currentDoctorId,
        granularity
      )

    if (result.totalConsultations === 0) {
      return {
        firstTimeConsultationCount: 0,
        firstTimeConsultationRate: 0,
        totalConsultations: 0,
        data: [],
      }
    }

    await this.redis.set(redisKey, JSON.stringify(result), {
      expiresInSec: 31_536_000,
    })

    return result
  }
}
