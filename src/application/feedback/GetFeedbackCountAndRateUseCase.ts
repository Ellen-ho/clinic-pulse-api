import { RedisServer } from 'infrastructure/database/RedisServer'
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

    const redisKey = `feedback_counts_and_rate${
      currentDoctorId ?? 'allDoctors'
    }_${granularity ?? 'allGranularity'}_${startDate}_${endDate}`

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

    if (result.totalFeedbacks === 0) {
      return {
        totalFeedbacks: 0,
        oneStarFeedbackCount: 0,
        twoStarFeedbackCount: 0,
        threeStarFeedbackCount: 0,
        fourStarFeedbackCount: 0,
        fiveStarFeedbackCount: 0,
        oneStarFeedbackRate: 0,
        twoStarFeedbackRate: 0,
        threeStarFeedbackRate: 0,
        fourStarFeedbackRate: 0,
        fiveStarFeedbackRate: 0,
        data: [],
      }
    }

    await this.redis.set(redisKey, JSON.stringify(result), {
      expiresInSec: 31_536_000,
    })

    return result
  }
}
