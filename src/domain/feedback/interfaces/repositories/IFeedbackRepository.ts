import { GenderType, Granularity } from 'domain/common'
import {
  OnsiteCancelReasonType,
  TreatmentType,
} from 'domain/consultation/Consultation'
import { Feedback, SelectedContent } from 'domain/feedback/Feedback'
import { IBaseRepository } from 'domain/shared/IBaseRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'

export interface IFeedbackRepository extends IBaseRepository<Feedback> {
  findById: (id: string) => Promise<{
    id: string
    receivedDate: string
    receivedAt: Date
    feedbackRating: number
    selectedContent: SelectedContent
    detailedContent: string | null
    consultation: {
      id: string
      consultationDate: string
      consultationTimePeriod: TimePeriodType
      onsiteCancelAt: Date | null
      onsiteCancelReason: OnsiteCancelReasonType | null
      treatmentType: TreatmentType
    }
    doctor: {
      id: string
      firstName: string
      lastName: string
      gender: GenderType
    }
    patient: {
      firstName: string
      lastName: string
      gender: GenderType
    }
  } | null>
  findByQuery: (
    limit: number,
    offset: number,
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string,
    patientName?: string,
    patientId?: string,
    feedbackRating?: number
  ) => Promise<{
    data: Array<{
      patient: {
        firstName: string
        lastName: string
        gender: GenderType
      }
      doctor: {
        firstName: string
        lastName: string
        gender: GenderType
      }
      id: string
      receivedDate: string
      receivedAt: Date
      feedbackRating: number
      clinicId: string
      clinicName: string
      consultationTimePeriod: TimePeriodType
      consultationId: string
    }>
    totalCounts: number
  }>
  getStarFeedback: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string,
    granularity?: Granularity
  ) => Promise<{
    totalFeedbacks: number
    oneStarFeedbackCount: number
    twoStarFeedbackCount: number
    threeStarFeedbackCount: number
    fourStarFeedbackCount: number
    fiveStarFeedbackCount: number
    oneStarFeedbackRate: number
    twoStarFeedbackRate: number
    threeStarFeedbackRate: number
    fourStarFeedbackRate: number
    fiveStarFeedbackRate: number
    data: Array<{
      date: string
      feedbackCount: number
      oneStarFeedbackCount: number
      twoStarFeedbackCount: number
      threeStarFeedbackCount: number
      fourStarFeedbackCount: number
      fiveStarFeedbackCount: number
      oneStarFeedbackRate: number
      twoStarFeedbackRate: number
      threeStarFeedbackRate: number
      fourStarFeedbackRate: number
      fiveStarFeedbackRate: number
    }>
  }>
}
