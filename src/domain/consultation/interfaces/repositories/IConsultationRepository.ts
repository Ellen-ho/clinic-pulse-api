import { GenderType, Granularity } from '../../../../domain/common'
import {
  Consultation,
  ConsultationStatus,
  OnsiteCancelReasonType,
  TreatmentType,
} from '../../../../domain/consultation/Consultation'
import { IBaseRepository } from '../../../../domain/shared/IBaseRepository'
import { TimePeriodType } from '../../../../domain/timeSlot/TimeSlot'

export interface IConsultationRepository extends IBaseRepository<Consultation> {
  findById: (id: string) => Promise<{
    id: string
    consultationDate: string
    consultationTimePeriod: TimePeriodType
    consultationNumber: number
    onsiteCancelAt: Date | null
    onsiteCancelReason: OnsiteCancelReasonType | null
    checkInAt: Date
    startAt: Date | null
    endAt: Date | null
    checkOutAt: Date | null
    treatmentType: TreatmentType
    patient: {
      firstName: string
      lastName: string
      gender: GenderType
      age: number
    }
    doctor: {
      id: string
      firstName: string
      lastName: string
      gender: GenderType
    }
    acupunctureTreatment: {
      id: string | null
      startAt: Date | null
      endAt: Date | null
      assignBedAt: Date | null
      removeNeedleAt: Date | null
    } | null
    medicineTreatment: {
      id: string | null
      getMedicineAt: Date | null
    } | null
  } | null>
  findByQuery: (
    limit: number,
    offset: number,
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    totalDurationMin?: number,
    totalDurationMax?: number,
    patientName?: string,
    patientId?: string,
    doctorId?: string
  ) => Promise<{
    data: Array<{
      id: string
      isOnsiteCanceled: boolean
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
    totalCounts: number
  }>
  getDurationCanceledAndBookingByGranularity: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType,
    granularity?: Granularity
  ) => Promise<{
    totalConsultations: number
    consultationWithOnlineBooking: number
    consultationWithOnsiteCancel: number
    onlineBookingRate: number
    onsiteCancelRate: number
    data: Array<{
      date: string
      onlineBookingCount: number
      onsiteCancelCount: number
      consultationCount: number
      onlineBookingRate: number
      onsiteCancelRate: number
    }>
  }>
  getRealTimeCounts: (timeSlotId: string | Array<{ id: string }>) => Promise<{
    waitForConsultationCount: number
    waitForBedAssignedCount: number
    waitForAcupunctureTreatmentCount: number
    waitForNeedleRemovedCount: number
    waitForMedicineCount: number
    completedCount: number
  }>
  getAverageWaitingTime: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string,
    patientId?: string,
    granularity?: Granularity
  ) => Promise<{
    totalAverageConsultationWait: number
    totalAverageBedAssignmentWait: number
    totalAverageAcupunctureWait: number
    totalAverageNeedleRemovalWait: number
    totalAverageMedicationWait: number
    data: Array<{
      date: string
      averageConsultationWait: number
      averageBedAssignmentWait: number
      averageAcupunctureWait: number
      averageNeedleRemovalWait: number
      averageMedicationWait: number
    }>
  }>
  getFirstTimeConsultationCounts: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string
  ) => Promise<{
    totalConsultationCount: number
    firstTimeConsultationCount: number
  }>
  getDurationCountByGranularity: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType,
    granularity?: Granularity
  ) => Promise<{
    totalConsultations: number
    data: Array<{
      date: string
      consultationCount: number
    }>
  }>
  getDifferentTreatmentConsultation: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType,
    granularity?: Granularity
  ) => Promise<{
    totalConsultations: number
    totalConsultationWithAcupuncture: number
    totalConsultationWithMedicine: number
    totalConsultationWithBothTreatment: number
    totalOnlyAcupunctureCount: number
    totalOnlyMedicineCount: number
    data: Array<{
      date: string
      consultationCount: number
      consultationWithAcupuncture: number
      consultationWithMedicine: number
      consultationWithBothTreatment: number
      onlyAcupunctureCount: number
      onlyMedicineCount: number
    }>
  }>
  isFirstTimeVisit: (patientId: string) => Promise<boolean>
  getLatestOddConsultationNumber: (timeSlotId: string) => Promise<number>
  getById: (id: string) => Promise<Consultation | null>
  findSocketData: (id: string) => Promise<{
    timeSlotId: string
    clinicId: string
    consultationRoomNumber: string
  }>
  getRealTimeLists: (
    timeSlotId: string | Array<{ id: string }>,
    limit: number,
    offset: number
  ) => Promise<{
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
      consultationRoomNumber: string
    }>
    totalCounts: number
  }>
  getSocketUpdatedData: (id: string) => Promise<{
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
    consultationRoomNumber: string
  }>
}
