import { RedisServer } from '../../infrastructure/database/RedisServer'
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
  lastConsultations: number
  lastConsultationWithOnsiteCancel: number
  lastOnsiteCancelRate: number
  totalConsultations: number
  consultationWithOnsiteCancel: number
  onsiteCancelRate: number
  compareConsultations: number
  compareConsultationWithOnsiteCancel: number
  compareOsiteCancelRates: number
  isCutDown: boolean
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
      clinicId ?? 'allClinic'
    }_${timePeriod ?? 'allTimePeriod'}_${
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

    const { lastStartDate, lastEndDate } =
      await this.consultationRepository.getPreviousPeriodDates(
        startDate,
        endDate,
        granularity
      )

    const lastResult =
      await this.consultationRepository.getDurationCanceledByGranularity(
        lastStartDate,
        lastEndDate,
        clinicId,
        currentDoctorId,
        timePeriod,
        granularity
      )

    const compareConsultations =
      result.totalConsultations - lastResult.totalConsultations

    const compareConsultationWithOnsiteCancel =
      lastResult.consultationWithOnsiteCancel === 0
        ? result.consultationWithOnsiteCancel > 0
          ? 100
          : 0
        : Math.round(
            ((result.consultationWithOnsiteCancel -
              lastResult.consultationWithOnsiteCancel) /
              lastResult.consultationWithOnsiteCancel) *
              10000
          ) / 100

    const compareOsiteCancelRates =
      lastResult.onsiteCancelRate === 0
        ? result.onsiteCancelRate > 0
          ? 100
          : 0
        : Math.round(
            ((result.onsiteCancelRate - lastResult.onsiteCancelRate) /
              lastResult.onsiteCancelRate) *
              10000
          ) / 100
    const isCutDown = compareOsiteCancelRates < 0

    const finalResponse: GetConsultationOnsiteCanceledCountAndRateResponse = {
      lastConsultations: lastResult.totalConsultations,
      lastConsultationWithOnsiteCancel: lastResult.consultationWithOnsiteCancel,
      lastOnsiteCancelRate: lastResult.onsiteCancelRate,
      totalConsultations: result.totalConsultations,
      consultationWithOnsiteCancel: result.consultationWithOnsiteCancel,
      onsiteCancelRate: result.onsiteCancelRate,
      compareConsultations,
      compareConsultationWithOnsiteCancel,
      compareOsiteCancelRates,
      isCutDown,
      data: result.data,
    }

    await this.redis.set(redisKey, JSON.stringify(finalResponse), {
      expiresInSec: 31_536_000,
    })

    return finalResponse
  }
}
