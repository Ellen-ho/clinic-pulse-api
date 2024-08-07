import { BaseRepository } from 'infrastructure/database/BaseRepository'
import { FeedbackEntity } from './FeedbackEntity'
import { DataSource } from 'typeorm'
import { FeedbackMapper } from './FeedbackMapper'
import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { RepositoryError } from 'infrastructure/error/RepositoryError'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { Feedback, SelectedContent } from 'domain/feedback/Feedback'

export class FeedbackRepository
  extends BaseRepository<FeedbackEntity, Feedback>
  implements IFeedbackRepository
{
  constructor(dataSource: DataSource) {
    super(FeedbackEntity, new FeedbackMapper(), dataSource)
  }

  public async findById(id: string): Promise<{
    receivedAt: Date
    feedbackRating: number
    selectedContent: SelectedContent
    detailedContent: string | null
    consultationId: string
  } | null> {
    try {
      const rawFeedback = await this.getQuery<
        Array<{
          received_at: Date
          feedback_rating: number
          selected_content: SelectedContent
          detailed_content: string | null
          consultation_id: string
        }>
      >(
        `
          SELECT
            f.received_at,
            f.feedback_rating,
            f.selected_content,
            f.detailed_content,
            f.consultation_id
          FROM feedbacks f
          WHERE f.id = $1
        `,
        [id]
      )

      if (rawFeedback.length === 0) {
        return null
      } else {
        return {
          receivedAt: rawFeedback[0].received_at,
          feedbackRating: rawFeedback[0].feedback_rating,
          selectedContent: rawFeedback[0].selected_content,
          detailedContent: rawFeedback[0].detailed_content,
          consultationId: rawFeedback[0].consultation_id,
        }
      }
    } catch (e) {
      console.error(e)
      throw new RepositoryError('FeedbackRepository findById error', e as Error)
    }
  }

  public async findByQuery(
    limit: number,
    offset: number,
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string,
    patientId?: string,
    feedbackRating?: number
  ): Promise<{
    data: Array<{
      id: string
      receivedAt: Date
      feedbackRating: number
      clinicName: string
      consultationTimePeriod: TimePeriodType
    }>
    totalCounts: number
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null

      const modifiedPatientId = patientId !== undefined ? patientId : null

      const modifiedDoctorId = doctorId !== undefined ? doctorId : null

      const rawFeedbacks = await this.getQuery<
        Array<{
          id: string
          received_at: Date
          feedback_rating: number
          clinic_name: string
          consultation_time_period: TimePeriodType
        }>
      >(
        `
            SELECT
                f.id,
                f.received_at,
                f.feedback_rating,
                cl.name AS clinic_name,
                ts.time_period AS consultation_time_period
                FROM
                feedbacks f
                JOIN consultations c ON f.consultation_id = c.id
                JOIN time_slots ts ON c.time_slot_id = ts.id
                JOIN clinics cl ON ts.clinic_id = cl.id
                WHERE
                f.received_at::date BETWEEN $1 AND $2
                AND ($3::uuid IS NULL OR cl.id = $3::uuid)
                AND ($4::text IS NULL OR ts.time_period = $4::text)
                AND ($5::uuid IS NULL OR c.patient_id = $5::uuid)
                AND ($6::uuid IS NULL OR ts.doctor_id = $6::uuid)
                AND ($7::int IS NULL OR f.feedback_rating = $7::int)
                ORDER BY
                f.received_at DESC
                LIMIT $8 OFFSET $9
         `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedPatientId,
          modifiedDoctorId,
          feedbackRating,
          limit,
          offset,
        ]
      )

      const totalCounts = await this.getQuery<Array<{ count: number }>>(
        `SELECT COUNT(*) FROM feedbacks f
            JOIN consultations c ON f.consultation_id = c.id
            JOIN time_slots ts ON c.time_slot_id = ts.id
            JOIN clinics cl ON ts.clinic_id = cl.id
            WHERE
              f.received_at::date BETWEEN $1 AND $2
              AND ($3::uuid IS NULL OR cl.id = $3::uuid)
              AND ($4::text IS NULL OR ts.time_period = $4::text)
              AND ($5::uuid IS NULL OR c.patient_id = $5::uuid)
              AND ($6::uuid IS NULL OR ts.doctor_id = $6::uuid)
              AND ($7::int IS NULL OR f.feedback_rating = $7::int)
              `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedPatientId,
          modifiedDoctorId,
          feedbackRating,
        ]
      )

      const data = rawFeedbacks.map((rawFeedback) => ({
        id: rawFeedback.id,
        receivedAt: rawFeedback.received_at,
        feedbackRating: rawFeedback.feedback_rating,
        clinicName: rawFeedback.clinic_name,
        consultationTimePeriod: rawFeedback.consultation_time_period,
      }))

      return {
        data,
        totalCounts: totalCounts[0].count,
      }
    } catch (e) {
      throw new RepositoryError(
        'FeedbackRepository findByQuery error',
        e as Error
      )
    }
  }

  public async getStarFeedback(
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string,
    patientId?: string
  ): Promise<{
    totalFeedbackCounts: number
    oneStarFeedBackCount: number
    twoStarFeedbackCount: number
    threeStarFeedbackCount: number
    fourStarFeedbackCount: number
    fiveStarFeedbackCount: number
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null

      const modifiedPatientId = patientId !== undefined ? patientId : null

      const modifiedDoctorId = doctorId !== undefined ? doctorId : null

      const result = await this.getQuery<
        Array<{
          totalfeedbackcounts: string
          onestarfeedbackcount: string
          twostarfeedbackcount: string
          threestarfeedbackcount: string
          fourstarfeedbackcount: string
          fivestarfeedbackcount: string
        }>
      >(
        `SELECT 
          COUNT(*) AS totalfeedbackcounts,
          COUNT(CASE WHEN f.feedback_rating = 1 THEN 1 END) AS onestarfeedbackcount,
          COUNT(CASE WHEN f.feedback_rating = 2 THEN 1 END) AS twostarfeedbackcount,
          COUNT(CASE WHEN f.feedback_rating = 3 THEN 1 END) AS threestarfeedbackcount,
          COUNT(CASE WHEN f.feedback_rating = 4 THEN 1 END) AS fourstarfeedbackcount,
          COUNT(CASE WHEN f.feedback_rating = 5 THEN 1 END) AS fivestarfeedbackcount
          FROM 
              feedbacks f
          JOIN 
              consultations c ON f.consultation_id = c.id
          JOIN 
              time_slots ts ON c.time_slot_id = ts.id
          WHERE 
              f.received_at BETWEEN $1 AND $2
              AND ($3::uuid IS NULL OR ts.clinic_id = $3::uuid)
              AND ($4::text IS NULL OR ts.time_period = $4::text)
              AND ($5::uuid IS NULL OR ts.doctor_id = $5::uuid)
              AND ($6::uuid IS NULL OR c.patient_id = $6::uuid);
        `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedDoctorId,
          modifiedPatientId,
        ]
      )

      return {
        totalFeedbackCounts: parseInt(result[0].totalfeedbackcounts, 10),
        oneStarFeedBackCount: parseInt(result[0].onestarfeedbackcount, 10),
        twoStarFeedbackCount: parseInt(result[0].twostarfeedbackcount, 10),
        threeStarFeedbackCount: parseInt(result[0].threestarfeedbackcount, 10),
        fourStarFeedbackCount: parseInt(result[0].fourstarfeedbackcount, 10),
        fiveStarFeedbackCount: parseInt(result[0].fivestarfeedbackcount, 10),
      }
    } catch (e) {
      throw new RepositoryError(
        'FeedbackRepository getStarFeedback error',
        e as Error
      )
    }
  }
}
