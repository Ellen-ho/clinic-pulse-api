import { Granularity } from '../../domain/common'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { ITimeSlotRepository } from '../../domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetAverageConsultationCountRequest {
  startDate: string
  endDate: string
  clinicId?: string
  doctorId?: string
  timePeriod?: TimePeriodType
  granularity?: Granularity
  currentUser: User
}

interface GetAverageConsultationCountResponse {
  totalConsultations: number
  totalSlots: number
  averagePatientPerSlot: number
  data: Array<{
    date: string
    consultationCount: number
    timeSlotCount: number
    averageCount: number
  }>
}

export class GetAverageConsultationCountUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly timeSlotRepository: ITimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetAverageConsultationCountRequest
  ): Promise<GetAverageConsultationCountResponse> {
    const {
      startDate,
      endDate,
      clinicId,
      doctorId,
      timePeriod,
      granularity,
      currentUser,
    } = request

    let currentDoctorId
    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id
    }

    const consultaionResult =
      await this.consultationRepository.getDurationCountByGranularity(
        startDate,
        endDate,
        clinicId,
        currentDoctorId !== undefined ? currentDoctorId : doctorId,
        timePeriod,
        granularity
      )

    const timeSlotResult =
      await this.timeSlotRepository.getDurationCountByGranularity(
        startDate,
        endDate,
        clinicId,
        currentDoctorId !== undefined ? currentDoctorId : doctorId,
        timePeriod,
        granularity
      )

    if (timeSlotResult.totalTimeSlots === 0) {
      return {
        totalConsultations: 0,
        totalSlots: 0,
        averagePatientPerSlot: 0,
        data: [],
      }
    }

    const mergedData = consultaionResult.data.map((consultationItem) => {
      const timeSlotItem = timeSlotResult.data.find(
        (slot) => slot.date === consultationItem.date
      )

      if (
        timeSlotItem === undefined ||
        timeSlotItem === null ||
        timeSlotItem.timeSlotCount === 0
      ) {
        throw new NotFoundError('Matching slot not found.')
      }

      const averageCount = Math.round(
        consultationItem.consultationCount / timeSlotItem.timeSlotCount
      )

      return {
        date: consultationItem.date,
        consultationCount: consultationItem.consultationCount,
        timeSlotCount: timeSlotItem.timeSlotCount,
        averageCount,
      }
    })

    return {
      totalConsultations: consultaionResult.totalConsultations,
      totalSlots: timeSlotResult.totalTimeSlots,
      averagePatientPerSlot: Math.round(
        consultaionResult.totalConsultations / timeSlotResult.totalTimeSlots
      ),
      data: mergedData,
    }
  }
}
