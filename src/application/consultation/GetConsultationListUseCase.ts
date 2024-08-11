import { GenderType } from '../../domain/common'
import {
  OnsiteCancelReasonType,
  TreatmentType,
} from '../../domain/consultation/Consultation'
import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'
import { User, UserRoleType } from '../../domain/user/User'
import { DoctorRepository } from '../../infrastructure/entities/doctor/DoctorRepository'

interface GetConsultationListRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  totalDurationMin?: number
  totalDurationMax?: number
  patientName?: string
  patientId?: string
  doctorId?: string
  page: number
  limit: number
  currentUser: User
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
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: DoctorRepository
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
      patientName,
      patientId,
      doctorId,
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

    const consultationList = await this.consultationRepository.findByQuery(
      limit,
      offset,
      startDate,
      endDate,
      clinicId,
      timePeriod,
      totalDurationMin,
      totalDurationMax,
      patientName,
      patientId,
      currentDoctorId !== undefined ? currentDoctorId : doctorId
    )

    return {
      data: consultationList.data,
      pagination: getPagination(limit, page, consultationList.totalCounts),
      totalCounts: consultationList.totalCounts,
    }
  }
}
