import { RedisServer } from '../../infrastructure/database/RedisServer'
import { Granularity } from '../../domain/common'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IFeedbackRepository } from '../../domain/feedback/interfaces/repositories/IFeedbackRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { User, UserRoleType } from '../../domain/user/User'

interface GetFeedbackCountAndRateRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  doctorId?: string
  granularity?: Granularity
  currentUser: User
}

interface GetFeedbackCountAndRateResponse {
  lastTotalFeedbacks: number
  lastOneStarFeedbackCount: number
  lastTwoStarFeedbackCount: number
  lastThreeStarFeedbackCount: number
  lastFourStarFeedbackCount: number
  lastFiveStarFeedbackCount: number
  totalFeedbacks: number
  oneStarFeedbackCount: number
  twoStarFeedbackCount: number
  threeStarFeedbackCount: number
  fourStarFeedbackCount: number
  fiveStarFeedbackCount: number
  oneStarFeedbackRate: number
  twoStarFeedbackRate: number
  threeStarFeedbackRate: number
  fourStarFeedbackRate: number
  fiveStarFeedbackRate: number
  compareTotalFeedbacks: number
  compareOneStarFeedbackCount: number
  compareTwoStarFeedbackCount: number
  compareThreeStarFeedbackCount: number
  compareFourStarFeedbackCount: number
  compareFiveStarFeedbackCount: number
  data: Array<{
    date: string
    feedbackCount: number
    oneStarFeedbackCount: number
    twoStarFeedbackCount: number
    threeStarFeedbackCount: number
    fourStarFeedbackCount: number
    fiveStarFeedbackCount: number
    oneStarFeedbackRate: number
    twoStarFeedbackRate: number
    threeStarFeedbackRate: number
    fourStarFeedbackRate: number
    fiveStarFeedbackRate: number
    totalReasonsCount: number
    waitAcupunctureReason: number
    waitBedReason: number
    waitConsultationReason: number
    waitMedicineReason: number
    doctorPoorAttitude: number
    waitAcupunctureReasonRate: number
    waitBedReasonRate: number
    waitConsultationReasonRate: number
    waitMedicineReasonRate: number
    doctorPoorAttitudeRate: number
  }>
}

export class GetFeedbackCountAndRateUseCase {
  constructor(
    private readonly feedbackRepository: IFeedbackRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly redis: RedisServer
  ) {}

  public async execute(
    request: GetFeedbackCountAndRateRequest
  ): Promise<GetFeedbackCountAndRateResponse> {
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

    const redisKey = `feedback_counts_and_rate_${
      currentDoctorId ?? 'allDoctors'
    }_${clinicId ?? 'allClinic'}_${timePeriod ?? 'allTimePeriod'}_${
      granularity ?? 'allGranularity'
    }_${startDate}_${endDate}`

    const cachedData = await this.redis.get(redisKey)
    if (cachedData !== null) {
      return JSON.parse(cachedData)
    }

    const result = await this.feedbackRepository.getStarFeedback(
      startDate,
      endDate,
      clinicId,
      timePeriod,
      currentDoctorId,
      granularity
    )

    const { lastStartDate, lastEndDate } =
      await this.feedbackRepository.getPreviousPeriodDates(
        startDate,
        endDate,
        granularity
      )

    const lastResult = await this.feedbackRepository.getStarFeedback(
      lastStartDate,
      lastEndDate,
      clinicId,
      timePeriod,
      currentDoctorId,
      granularity
    )

    const compareTotalFeedbacks =
      lastResult.totalFeedbacks === 0
        ? result.totalFeedbacks > 0
          ? 100
          : 0
        : Math.round(
            ((result.totalFeedbacks - lastResult.totalFeedbacks) /
              lastResult.totalFeedbacks) *
              10000
          ) / 100

    const compareOneStarFeedbackCount =
      lastResult.totalFeedbacks === 0
        ? result.totalFeedbacks > 0
          ? 100
          : 0
        : Math.round(
            ((result.totalFeedbacks - lastResult.totalFeedbacks) /
              lastResult.totalFeedbacks) *
              10000
          ) / 100

    const compareTwoStarFeedbackCount =
      lastResult.twoStarFeedbackCount === 0
        ? result.twoStarFeedbackCount > 0
          ? 100
          : 0
        : Math.round(
            ((result.twoStarFeedbackCount - lastResult.twoStarFeedbackCount) /
              lastResult.twoStarFeedbackCount) *
              10000
          ) / 100

    const compareThreeStarFeedbackCount =
      lastResult.threeStarFeedbackCount === 0
        ? result.threeStarFeedbackCount > 0
          ? 100
          : 0
        : Math.round(
            ((result.threeStarFeedbackCount -
              lastResult.threeStarFeedbackCount) /
              lastResult.threeStarFeedbackCount) *
              10000
          ) / 100

    const compareFourStarFeedbackCount =
      lastResult.fourStarFeedbackCount === 0
        ? result.fourStarFeedbackCount > 0
          ? 100
          : 0
        : Math.round(
            ((result.fourStarFeedbackCount - lastResult.fourStarFeedbackCount) /
              lastResult.fourStarFeedbackCount) *
              10000
          ) / 100

    const compareFiveStarFeedbackCount =
      lastResult.fiveStarFeedbackCount === 0
        ? result.fiveStarFeedbackCount > 0
          ? 100
          : 0
        : Math.round(
            ((result.fiveStarFeedbackCount - lastResult.fiveStarFeedbackCount) /
              lastResult.fiveStarFeedbackCount) *
              10000
          ) / 100

    const finalResponse: GetFeedbackCountAndRateResponse = {
      lastTotalFeedbacks: lastResult.totalFeedbacks,
      lastOneStarFeedbackCount: lastResult.oneStarFeedbackCount,
      lastTwoStarFeedbackCount: lastResult.twoStarFeedbackCount,
      lastThreeStarFeedbackCount: lastResult.threeStarFeedbackCount,
      lastFourStarFeedbackCount: lastResult.fourStarFeedbackCount,
      lastFiveStarFeedbackCount: lastResult.fiveStarFeedbackCount,
      totalFeedbacks: result.totalFeedbacks,
      oneStarFeedbackCount: result.oneStarFeedbackCount,
      twoStarFeedbackCount: result.twoStarFeedbackCount,
      threeStarFeedbackCount: result.threeStarFeedbackCount,
      fourStarFeedbackCount: result.fourStarFeedbackCount,
      fiveStarFeedbackCount: result.fiveStarFeedbackCount,
      oneStarFeedbackRate: result.oneStarFeedbackRate,
      twoStarFeedbackRate: result.twoStarFeedbackRate,
      threeStarFeedbackRate: result.threeStarFeedbackRate,
      fourStarFeedbackRate: result.fourStarFeedbackRate,
      fiveStarFeedbackRate: result.fiveStarFeedbackRate,
      compareTotalFeedbacks,
      compareOneStarFeedbackCount,
      compareTwoStarFeedbackCount,
      compareThreeStarFeedbackCount,
      compareFourStarFeedbackCount,
      compareFiveStarFeedbackCount,
      data: result.data,
    }

    await this.redis.set(redisKey, JSON.stringify(finalResponse), {
      expiresInSec: 31_536_000,
    })

    return finalResponse
  }
}
