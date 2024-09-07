import { RoomNumberType } from '../../domain/consultationRoom/ConsultationRoom'
import { GenderType } from '../../domain/common'
import { ConsultationStatus } from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { ITimeSlotRepository } from '../../domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'
import { getCurrentTime } from '../../infrastructure/utils/DateFormatToUTC'

interface GetConsultationRealTimeListRequest {
  clinicId?: string
  consultationRoomNumber?: RoomNumberType
  page: number
  limit: number
  currentUser: User
}

interface GetConsultationRealTimeListResponse {
  data: Array<{
    id: string
    isOnsiteCanceled: boolean
    consultationNumber: number
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
    status: ConsultationStatus
    timeSlotId: string
    clinicId: string
    consultationRoomNumber: RoomNumberType
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

export class GetConsultationRealTimeListUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly timeSlotRepository: ITimeSlotRepository
  ) {}

  public async execute(
    request: GetConsultationRealTimeListRequest
  ): Promise<GetConsultationRealTimeListResponse | null> {
    const { clinicId, consultationRoomNumber, currentUser, page, limit } =
      request
    const offset: number = getOffset(limit, page)

    const currentTime = getCurrentTime()

    let currentDoctorId

    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id

      if (currentDoctorId !== undefined) {
        const result =
          await this.timeSlotRepository.findCurrentTimeSlotForDoctor(
            currentDoctorId,
            currentTime
          )

        if (result === null) {
          return {
            data: [],
            pagination: {
              pages: [],
              totalPage: 0,
              currentPage: 0,
              prev: 0,
              next: 0,
            },
            totalCounts: 0,
          }
        }

        const realTimeLists =
          await this.consultationRepository.getRealTimeLists(
            result.timeSlotId,
            limit,
            offset
          )

        return {
          data: realTimeLists.data,
          pagination: getPagination(limit, page, realTimeLists.totalCounts),
          totalCounts: realTimeLists.totalCounts,
        }
      }
    }

    if (currentUser.role === UserRoleType.ADMIN) {
      const results =
        await this.timeSlotRepository.findMatchingTimeSlotForAdmin(
          currentTime,
          clinicId,
          consultationRoomNumber,
          undefined
        )

      if (results.length === 0) {
        return {
          data: [],
          pagination: {
            pages: [],
            totalPage: 0,
            currentPage: 0,
            prev: 0,
            next: 0,
          },
          totalCounts: 0,
        }
      }

      const timeSlotIds: Array<{ id: string }> = results.map((result) => ({
        id: result.id,
      }))

      const realTimeLists = await this.consultationRepository.getRealTimeLists(
        timeSlotIds,
        limit,
        offset
      )

      return {
        data: realTimeLists.data,
        pagination: getPagination(limit, page, realTimeLists.totalCounts),
        totalCounts: realTimeLists.totalCounts,
      }
    }

    return null
  }
}
