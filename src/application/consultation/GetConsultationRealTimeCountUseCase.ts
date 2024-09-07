import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { ITimeSlotRepository } from '../../domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { RoomNumberType } from '../../domain/consultationRoom/ConsultationRoom'
import { getCurrentTime } from '../../infrastructure/utils/DateFormatToUTC'

interface GetConsultationRealTimeCountRequest {
  clinicId?: string
  consultationRoomNumber?: RoomNumberType
  currentUser: User
}

interface GetConsultationRealTimeCountResponse {
  timeSlotId: string | Array<{ id: string }>
  waitForConsultationCount: number
  waitForBedAssignedCount: number
  waitForAcupunctureTreatmentCount: number
  waitForNeedleRemovedCount: number
  waitForMedicineCount: number
  completedCount: number
  onsiteCancelCount: number
  clinicId: string | Array<{ clinicId: string }>
  consultationRoomNumber:
    | RoomNumberType
    | Array<{ consultationRoomNumber: RoomNumberType }>
  timePeriod: TimePeriodType | Array<{ timePeriod: string }> | null
}

export class GetConsultationRealTimeCountUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly timeSlotRepository: ITimeSlotRepository
  ) {}

  public async execute(
    request: GetConsultationRealTimeCountRequest
  ): Promise<GetConsultationRealTimeCountResponse | null> {
    const { clinicId, consultationRoomNumber, currentUser } = request

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
            timeSlotId: '',
            waitForConsultationCount: 0,
            waitForBedAssignedCount: 0,
            waitForAcupunctureTreatmentCount: 0,
            waitForNeedleRemovedCount: 0,
            waitForMedicineCount: 0,
            completedCount: 0,
            onsiteCancelCount: 0,
            clinicId: '',
            consultationRoomNumber: RoomNumberType.ROOM_ONE,
            timePeriod: null,
          }
        }

        const realTimeCounts =
          await this.consultationRepository.getRealTimeCounts(result.timeSlotId)

        return {
          ...realTimeCounts,
          ...result,
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
          timeSlotId: [],
          waitForConsultationCount: 0,
          waitForBedAssignedCount: 0,
          waitForAcupunctureTreatmentCount: 0,
          waitForNeedleRemovedCount: 0,
          waitForMedicineCount: 0,
          completedCount: 0,
          onsiteCancelCount: 0,
          clinicId: [],
          consultationRoomNumber: [],
          timePeriod: null,
        }
      }

      const timeSlotIds: Array<{ id: string }> = results.map((result) => ({
        id: result.id,
      }))

      const clinicIds: Array<{ clinicId: string }> = results.map((result) => ({
        clinicId: result.clinicId,
      }))

      const consultationRoomNumbers: Array<{
        consultationRoomNumber: RoomNumberType
      }> = results.map((result) => ({
        consultationRoomNumber: result.consultationRoomNumber,
      }))

      const timePeriods: Array<{ timePeriod: TimePeriodType }> = results.map(
        (result) => ({
          timePeriod: result.timePeriod,
        })
      )

      const realTimeCounts =
        await this.consultationRepository.getRealTimeCounts(timeSlotIds)

      return {
        ...realTimeCounts,
        timeSlotId: timeSlotIds,
        clinicId: clinicIds,
        consultationRoomNumber: consultationRoomNumbers,
        timePeriod: timePeriods,
      }
    }

    return null
  }
}
