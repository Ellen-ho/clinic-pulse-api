import { GenderType } from 'domain/common'
import {
  Consultation,
  OnsiteCancelReasonType,
  TreatmentType,
} from 'domain/consultation/Consultation'
import { IBaseRepository } from 'domain/shared/IBaseRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'

export interface IConsultationRepository extends IBaseRepository<Consultation> {
  save: (consultation: Consultation) => Promise<void>
  findById: (id: string) => Promise<{
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
      firstName: string
      lastName: string
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
    doctorId?: string,
    patientId?: string
  ) => Promise<{
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
    totalCounts: number
  }>
  findByDateRangeAndClinic: (
    startDate: string,
    endDate: string,
    clinicId?: string
  ) => Promise<{
    totalConsultation: number
    consultationWithOnlineBooking: number
    consultationWithOnsiteCancel: number
  }>
  getRealTimeCounts: (
    clinicId?: string,
    consultationRoomNumber?: string
  ) => Promise<{
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
    patientId?: string
  ) => Promise<{
    averageConsultationWait: number
    averageBedAssignmentWait: number
    averageAcupunctureWait: number
    averageNeedleRemovalWait: number
    averageMedicationWait: number
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
  getAveragePatientCount: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType
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
    timePeriod?: TimePeriodType
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
}
