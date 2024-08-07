import { Feedback, SelectedContent } from 'domain/feedback/Feedback'
import { IBaseRepository } from 'domain/shared/IBaseRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'

export interface IFeedbackRepository extends IBaseRepository<Feedback> {
  findById: (id: string) => Promise<{
    feedbackRating: number
    selectedContent: SelectedContent
    detailedContent: string | null
    consultationId: string
  } | null>
  findByQuery: (
    limit: number,
    offset: number,
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string,
    patientId?: string,
    feedbackRating?: number
  ) => Promise<{
    data: Array<{
      id: string
      receivedAt: Date
      feedbackRating: number
      clinicName: string
      consultationTimePeriod: TimePeriodType
    }>
    totalCounts: number
  }>
  getStarFeedback: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string,
    patientId?: string
  ) => Promise<{
    totalFeedbackCounts: number
    oneStarFeedBackCount: number
    twoStarFeedbackCount: number
    threeStarFeedbackCount: number
    fourStarFeedbackCount: number
    fiveStarFeedbackCount: number
  }>
}
