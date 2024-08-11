import { GenderType } from 'domain/common'
import { IDoctorRepository } from 'domain/doctor/interfaces/repositories/IDoctorRepository'
import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { User, UserRoleType } from 'domain/user/User'
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
  currentUser: User
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
  constructor(
    private readonly feedbackRepository: IFeedbackRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

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
      currentUser,
    } = request
    const page: number = 1
    const limit: number = 20
    const offset: number = getOffset(limit, page)

    let currentDoctorId
    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id
    }

    const feedbackList = await this.feedbackRepository.findByQuery(
      limit,
      offset,
      startDate,
      endDate,
      clinicId,
      timePeriod,
      currentDoctorId !== undefined ? currentDoctorId : doctorId,
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
