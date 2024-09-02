import { RedisServer } from '../../infrastructure/database/RedisServer'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { User, UserRoleType } from '../../domain/user/User'
import { DoctorRepository } from '../../infrastructure/entities/doctor/DoctorRepository'
import { Granularity } from '../../domain/common'

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
  lastConsultations: number
  lastFirstTimeConsultationCount: number
  lastFirstTimeConsultationRate: number
  firstTimeConsultationCount: number
  firstTimeConsultationRate: number
  totalConsultations: number
  compareConsultations: number
  compareFirstTimeConsultation: number
  compareFirstTimeRates: number
  isGetMore: boolean
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

    const redisKey = `first_time_${currentDoctorId ?? 'allDoctors'}_${
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

    const { lastStartDate, lastEndDate } =
      await this.consultationRepository.getPreviousPeriodDates(
        startDate,
        endDate,
        granularity
      )

    const lastResult =
      await this.consultationRepository.getDurationFirstTimeByGranularity(
        lastStartDate,
        lastEndDate,
        clinicId,
        timePeriod,
        currentDoctorId,
        granularity
      )

    const compareConsultations =
      result.totalConsultations - lastResult.totalConsultations
    const compareFirstTimeConsultation =
      result.firstTimeConsultationCount - lastResult.firstTimeConsultationCount
    const compareFirstTimeRates =
      lastResult.firstTimeConsultationRate === 0
        ? result.firstTimeConsultationRate > 0
          ? 100
          : 0
        : Math.round(
            ((result.firstTimeConsultationRate -
              lastResult.firstTimeConsultationRate) /
              lastResult.firstTimeConsultationRate) *
              10000
          ) / 100
    const isGetMore = compareFirstTimeRates > 0

    const finalResponse: GetFirstTimeConsultationCountAndRateResponse = {
      lastConsultations: lastResult.totalConsultations,
      lastFirstTimeConsultationCount: lastResult.firstTimeConsultationCount,
      lastFirstTimeConsultationRate: lastResult.firstTimeConsultationRate,
      firstTimeConsultationCount: result.firstTimeConsultationCount,
      firstTimeConsultationRate: result.firstTimeConsultationRate,
      totalConsultations: result.totalConsultations,
      compareConsultations,
      compareFirstTimeConsultation,
      compareFirstTimeRates,
      isGetMore,
      data: result.data,
    }

    await this.redis.set(redisKey, JSON.stringify(finalResponse), {
      expiresInSec: 31_536_000,
    })

    return finalResponse
  }
}
