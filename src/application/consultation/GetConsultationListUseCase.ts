import { GenderType } from '../../domain/common'
import {
  OnsiteCancelReasonType,
  TreatmentType,
} from 'domain/consultation/Consultation'
import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { NotFoundError } from 'infrastructure/error/NotFoundError'
import { getOffset, getPagination } from 'infrastructure/utils/Pagination'

interface GetConsultationListRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  totalDurationMin?: number
  totalDurationMax?: number
  doctorId?: string
  patientId?: string
  page: number
  limit: number
}

interface GetConsultationListResponse {
  data: Array<{
    id: string
    isOnsiteCanceled: boolean | null
    onsiteCancelReason: OnsiteCancelReasonType | null
    consultationNumber: number
    consultationDate: string
    consultationTimePeriod: TimePeriodType
    doctor: {
      firstName: string
      lastName: string
    }
    patient: {
      firstName: string
      lastName: string
      gender: GenderType
      age: number
    }
    treatmentType: TreatmentType
    totalDuration: number
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

export class GetConsultationListUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetConsultationListRequest
  ): Promise<GetConsultationListResponse> {
    const {
      startDate,
      endDate,
      clinicId,
      timePeriod,
      totalDurationMin,
      totalDurationMax,
      doctorId,
      patientId,
    } = request
    const page: number = 1
    const limit: number = 20
    const offset: number = getOffset(limit, page)

    const consultationList = await this.consultationRepository.findByQuery(
      limit,
      offset,
      startDate,
      endDate,
      clinicId,
      timePeriod,
      totalDurationMin,
      totalDurationMax,
      doctorId,
      patientId
    )

    if (consultationList.totalCounts === 0) {
      throw new NotFoundError(' No consultation exists.')
    }

    return {
      data: consultationList.data,
      pagination: getPagination(limit, page, consultationList.totalCounts),
      totalCounts: consultationList.totalCounts,
    }
  }
}
