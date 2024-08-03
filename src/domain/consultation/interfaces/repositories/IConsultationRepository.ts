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
}
