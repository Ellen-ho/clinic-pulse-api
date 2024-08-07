import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetFeedbackCountAndRateRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  doctorId?: string
  patientId?: string
}

interface GetFeedbackCountAndRateResponse {
  totalFeedbacks: number
  oneStarFeedBackCount: number
  twoStarFeedbackCount: number
  threeStarFeedbackCount: number
  fourStarFeedbackCount: number
  fiveStarFeedbackCount: number
  oneStarFeedBackRate: number
  twoStarFeedbackRate: number
  threeStarFeedbackRate: number
  fourStarFeedbackRate: number
  fiveStarFeedbackRate: number
}

export class GetFeedbackCountAndRateUseCase {
  constructor(private readonly feedbackRepository: IFeedbackRepository) {}

  public async execute(
    request: GetFeedbackCountAndRateRequest
  ): Promise<GetFeedbackCountAndRateResponse> {
    const { startDate, endDate, clinicId, timePeriod, doctorId, patientId } =
      request

    const result = await this.feedbackRepository.getStarFeedback(
      startDate,
      endDate,
      clinicId,
      timePeriod,
      doctorId,
      patientId
    )

    if (result.totalFeedbackCounts === 0) {
      throw new NotFoundError(' No feedback exists.')
    }

    const oneStarFeedBackRate = Math.round(
      (result.oneStarFeedBackCount / result.totalFeedbackCounts) * 100
    )

    const twoStarFeedbackRate = Math.round(
      (result.twoStarFeedbackCount / result.totalFeedbackCounts) * 100
    )

    const threeStarFeedbackRate = Math.round(
      (result.threeStarFeedbackCount / result.totalFeedbackCounts) * 100
    )

    const fourStarFeedbackRate = Math.round(
      (result.fourStarFeedbackCount / result.totalFeedbackCounts) * 100
    )

    const fiveStarFeedbackRate = Math.round(
      (result.fiveStarFeedbackCount / result.totalFeedbackCounts) * 100
    )

    return {
      totalFeedbacks: result.totalFeedbackCounts,
      oneStarFeedBackCount: result.oneStarFeedBackCount,
      twoStarFeedbackCount: result.twoStarFeedbackCount,
      threeStarFeedbackCount: result.threeStarFeedbackCount,
      fourStarFeedbackCount: result.fourStarFeedbackCount,
      fiveStarFeedbackCount: result.fiveStarFeedbackCount,
      oneStarFeedBackRate,
      twoStarFeedbackRate,
      threeStarFeedbackRate,
      fourStarFeedbackRate,
      fiveStarFeedbackRate,
    }
  }
}
