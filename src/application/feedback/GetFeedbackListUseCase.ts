import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { NotFoundError } from 'infrastructure/error/NotFoundError'
import { getOffset, getPagination } from 'infrastructure/utils/Pagination'

interface GetFeedbackListRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  doctorId?: string
  patientId?: string
  feedbackRating?: number
  page: number
  limit: number
}

interface GetFeedbackListResponse {
  data: Array<{
    id: string
    receivedAt: Date
    feedbackRating: number
    clinicName: string
    consultationTimePeriod: TimePeriodType
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
  totalCounts: number
}

export class GetFeedbackListUseCase {
  constructor(private readonly feedbackRepository: IFeedbackRepository) {}

  public async execute(
    request: GetFeedbackListRequest
  ): Promise<GetFeedbackListResponse> {
    const {
      startDate,
      endDate,
      clinicId,
      timePeriod,
      doctorId,
      patientId,
      feedbackRating,
    } = request
    const page: number = 1
    const limit: number = 20
    const offset: number = getOffset(limit, page)

    const feedbackList = await this.feedbackRepository.findByQuery(
      limit,
      offset,
      startDate,
      endDate,
      clinicId,
      timePeriod,
      doctorId,
      patientId,
      feedbackRating
    )

    if (feedbackList.totalCounts === 0) {
      throw new NotFoundError(' No feedback exists.')
    }

    return {
      data: feedbackList.data,
      pagination: getPagination(limit, page, feedbackList.totalCounts),
      totalCounts: feedbackList.totalCounts,
    }
  }
}
