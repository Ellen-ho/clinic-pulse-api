import { GenderType } from '../../../domain/common'
import { ConsultationStatus } from '../../../domain/consultation/Consultation'
import { RoomNumberType } from '../../../domain/consultationRoom/ConsultationRoom'

export interface ISendToUser {
  clinicId: string
  consultationRoomNumber: RoomNumberType
  event: 'realTimeCounts' | 'realTimeList'
  message:
    | {
        waitForConsultationCount: number
        waitForBedAssignedCount: number
        waitForAcupunctureTreatmentCount: number
        waitForNeedleRemovedCount: number
        waitForMedicineCount: number
        completedCount: number
      }
    | {
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
      }
}

export interface IRealTimeSocketService {
  sendToUser: (props: ISendToUser) => void
}
