import { GenderType } from 'domain/common'
import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { getOffset, getPagination } from 'infrastructure/utils/Pagination'

interface GetFeedbackListRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  doctorId?: string
  patientName?: string
  patientId?: string
  feedbackRating?: number
  page: number
  limit: number
}

interface GetFeedbackListResponse {
  data: Array<{
    doctor: {
      firstName: string
      lastName: string
      gender: GenderType
    }
    patient: {
      firstName: string
      lastName: string
      gender: GenderType
    }
    id: string
    receivedDate: string
    receivedAt: Date
    feedbackRating: number
    clinicId: string
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
      patientName,
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
      patientName,
      patientId,
      feedbackRating
    )

    return {
      data: feedbackList.data,
      pagination: getPagination(limit, page, feedbackList.totalCounts),
      totalCounts: feedbackList.totalCounts,
    }
  }
}
