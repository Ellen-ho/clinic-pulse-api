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
  }>
}

export class GetFeedbackCountAndRateUseCase {
  constructor(
    private readonly feedbackRepository: IFeedbackRepository,
    private readonly doctorRepository: IDoctorRepository
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

    let currentDoctorId
    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id
    }

    const result = await this.feedbackRepository.getStarFeedback(
      startDate,
      endDate,
      clinicId,
      timePeriod,
      currentDoctorId !== undefined ? currentDoctorId : doctorId,
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

    return result
  }
}
