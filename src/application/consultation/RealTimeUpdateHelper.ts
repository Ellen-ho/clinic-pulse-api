import { GenderType } from 'domain/common'
import { ConsultationStatus } from 'domain/consultation/Consultation'
import { IRealTimeSocketService } from 'domain/network/interfaces/IRealTimeSocketService'

interface ISendUpdatedWaitingCountsProps {
  clinicId: string
  consultationRoomNumber: string
  content: {
    waitForConsultationCount: number
    waitForBedAssignedCount: number
    waitForAcupunctureTreatmentCount: number
    waitForNeedleRemovedCount: number
    waitForMedicineCount: number
    completedCount: number
  }
}

interface ISendUpdatedRealTimeListProps {
  clinicId: string
  consultationRoomNumber: string
  content: {
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

export interface IRealTimeUpdateHelper {
  sendUpdatedWaitingCounts: (
    props: ISendUpdatedWaitingCountsProps
  ) => Promise<void>
  sendUpdatedRealTimeList: (
    props: ISendUpdatedRealTimeListProps
  ) => Promise<void>
}

export class RealTimeUpdateHelper implements IRealTimeUpdateHelper {
  constructor(private readonly realTimeSocketService: IRealTimeSocketService) {}

  public async sendUpdatedWaitingCounts(
    props: ISendUpdatedWaitingCountsProps
  ): Promise<void> {
    const { content, clinicId, consultationRoomNumber } = props

    this.realTimeSocketService.sendToUser({
      clinicId,
      consultationRoomNumber,
      event: 'realTimeCounts',
      message: content,
    })
  }

  public async sendUpdatedRealTimeList(
    props: ISendUpdatedRealTimeListProps
  ): Promise<void> {
    const { content, clinicId, consultationRoomNumber } = props

    this.realTimeSocketService.sendToUser({
      clinicId,
      consultationRoomNumber,
      event: 'realTimeList',
      message: content,
    })
  }
}
