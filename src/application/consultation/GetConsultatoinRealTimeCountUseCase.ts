import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from 'domain/doctor/interfaces/repositories/IDoctorRepository'
import { ITimeSlotRepository } from 'domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { User, UserRoleType } from 'domain/user/User'

interface GetConsultationRealTimeCountRequest {
  clinicId?: string
  consultationRoomNumber?: string
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

    let currentDoctorId

    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id

      if (currentDoctorId !== undefined) {
        const currentTime = new Date()
        const timeSlotId =
          await this.timeSlotRepository.findCurrentTimeSlotForDoctor(
            currentDoctorId,
            currentTime
          )

        if (timeSlotId === null) {
          return {
            timeSlotId: '',
            waitForConsultationCount: 0,
            waitForBedAssignedCount: 0,
            waitForAcupunctureTreatmentCount: 0,
            waitForNeedleRemovedCount: 0,
            waitForMedicineCount: 0,
            completedCount: 0,
          }
        }

        const realTimeCounts =
          await this.consultationRepository.getRealTimeCounts(
            timeSlotId,
            undefined,
            undefined,
            currentDoctorId
          )

        return {
          ...realTimeCounts,
          timeSlotId,
        }
      }
    }

    if (currentUser.role === UserRoleType.ADMIN) {
      const currentTime = new Date()
      const timeSlotIds =
        await this.timeSlotRepository.findMatchingTimeSlotForAdmin(
          currentTime,
          clinicId,
          consultationRoomNumber,
          undefined
        )

      if (timeSlotIds.length === 0) {
        return {
          timeSlotId: [],
          waitForConsultationCount: 0,
          waitForBedAssignedCount: 0,
          waitForAcupunctureTreatmentCount: 0,
          waitForNeedleRemovedCount: 0,
          waitForMedicineCount: 0,
          completedCount: 0,
        }
      }

      const realTimeCounts =
        await this.consultationRepository.getRealTimeCounts(
          timeSlotIds,
          clinicId,
          consultationRoomNumber,
          undefined
        )

      return {
        ...realTimeCounts,
        timeSlotId: timeSlotIds,
      }
    }

    return null
  }
}
