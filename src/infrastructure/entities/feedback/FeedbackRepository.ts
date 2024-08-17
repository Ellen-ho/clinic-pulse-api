import { BaseRepository } from 'infrastructure/database/BaseRepository'
import { FeedbackEntity } from './FeedbackEntity'
import { DataSource } from 'typeorm'
import { FeedbackMapper } from './FeedbackMapper'
import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { RepositoryError } from 'infrastructure/error/RepositoryError'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { Feedback, SelectedContent } from 'domain/feedback/Feedback'
import { GenderType, Granularity } from 'domain/common'
import {
  OnsiteCancelReasonType,
  TreatmentType,
} from 'domain/consultation/Consultation'
import { getDateFormat } from 'infrastructure/utils/SqlDateFormat'
import dayjs from 'dayjs'

export class FeedbackRepository
  extends BaseRepository<FeedbackEntity, Feedback>
  implements IFeedbackRepository
{
  constructor(dataSource: DataSource) {
    super(FeedbackEntity, new FeedbackMapper(), dataSource)
  }

  public async findById(id: string): Promise<{
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
  } | null> {
    try {
      const rawFeedback = await this.getQuery<
        Array<{
          id: string
          received_date: string
          received_at: Date
          feedback_rating: number
          selected_content: SelectedContent
          detailed_content: string | null
          consultation_id: string
          consultation_date: string
          consultation_time_period: TimePeriodType
          onsite_cancel_at: Date | null
          onsite_cancel_reason: OnsiteCancelReasonType | null
          has_acupuncture: boolean
          has_medicine: boolean
          doctor_id: string
          doctor_first_name: string
          doctor_last_name: string
          doctor_gender: GenderType
          patient_first_name: string
          patient_last_name: string
          patient_gender: GenderType
        }>
      >(
        `
            SELECT
            f.id,
            TO_CHAR(f.received_at, 'YYYY-MM-DD') AS received_date,
            f.received_at,
            f.feedback_rating,
            f.selected_content,
            f.detailed_content,
            c.id AS consultation_id,
            TO_CHAR(c.check_in_at, 'YYYY-MM-DD') AS consultation_date,
            ts.time_period AS consultation_time_period,
            c.onsite_cancel_at,
            c.onsite_cancel_reason,
            CASE WHEN at.id IS NOT NULL THEN true ELSE false END AS has_acupuncture,
            CASE WHEN mt.id IS NOT NULL THEN true ELSE false END AS has_medicine,
            p.first_name AS patient_first_name,
            p.last_name AS patient_last_name,
            p.gender AS patient_gender,
            d.id AS doctor_id,
            d.first_name AS doctor_first_name,
            d.last_name AS doctor_last_name,
            d.gender AS doctor_gender
          FROM feedbacks f
          JOIN consultations c ON f.consultation_id = c.id
          JOIN time_slots ts ON c.time_slot_id = ts.id
          LEFT JOIN patients p ON c.patient_id = p.id
          LEFT JOIN doctors d ON ts.doctor_id = d.id
          LEFT JOIN acupuncture_treatments at ON c.acupuncture_treatment_id = at.id
          LEFT JOIN medicine_treatments mt ON c.medicine_treatment_id = mt.id
          WHERE f.id = $1
        `,
        [id]
      )

      if (rawFeedback.length === 0) {
        return null
      } else {
        return {
          id: rawFeedback[0].id,
          receivedDate: rawFeedback[0].received_date,
          receivedAt: rawFeedback[0].received_at,
          feedbackRating: rawFeedback[0].feedback_rating,
          selectedContent: rawFeedback[0].selected_content,
          detailedContent: rawFeedback[0].detailed_content,
          consultation: {
            id: rawFeedback[0].consultation_id,
            consultationDate: rawFeedback[0].consultation_date,
            consultationTimePeriod: rawFeedback[0].consultation_time_period,
            onsiteCancelAt: rawFeedback[0].onsite_cancel_at,
            onsiteCancelReason: rawFeedback[0].onsite_cancel_reason,
            treatmentType: this.determineTreatmentType(
              rawFeedback[0].has_acupuncture,
              rawFeedback[0].has_medicine
            ),
          },
          doctor: {
            id: rawFeedback[0].doctor_id,
            firstName: rawFeedback[0].doctor_first_name,
            lastName: rawFeedback[0].doctor_last_name,
            gender: rawFeedback[0].doctor_gender,
          },
          patient: {
            firstName: rawFeedback[0].patient_first_name,
            lastName: rawFeedback[0].patient_last_name,
            gender: rawFeedback[0].patient_gender,
          },
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
    patientName?: string,
    patientId?: string,
    feedbackRating?: number
  ): Promise<{
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
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null

      const modifiedPatientId = patientId !== undefined ? patientId : null

      const modifiedPatientName =
        patientName !== undefined && patientName.trim() !== ''
          ? patientName.trim()
          : null

      const modifiedDoctorId = doctorId !== undefined ? doctorId : null

      const rawFeedbacks = await this.getQuery<
        Array<{
          id: string
          received_date: string
          received_at: Date
          feedback_rating: number
          doctor_first_name: string
          doctor_last_name: string
          doctor_gender: GenderType
          patient_first_name: string
          patient_last_name: string
          patient_gender: GenderType
          clinic_id: string
          clinic_name: string
          consultation_time_period: TimePeriodType
          consultation_id: string
        }>
      >(
        `
            SELECT
                f.id,
                TO_CHAR(f.received_at, 'YYYY-MM-DD') AS received_date,
                f.received_at,
                f.feedback_rating,
                d.first_name AS doctor_first_name,
                d.last_name AS doctor_last_name,
                d.gender AS doctor_gender,
                p.first_name AS patient_first_name,
                p.last_name AS patient_last_name,
                p.gender AS patient_gender,
                cl.id AS clinic_id,
                cl.name AS clinic_name,
                ts.time_period AS consultation_time_period,
                c.id AS consultation_id
                FROM
                feedbacks f
                JOIN consultations c ON f.consultation_id = c.id
                JOIN time_slots ts ON c.time_slot_id = ts.id
                JOIN clinics cl ON ts.clinic_id = cl.id
                LEFT JOIN doctors d ON ts.doctor_id = d.id
                LEFT JOIN patients p ON c.patient_id = p.id
                WHERE
                f.received_at::date BETWEEN $1 AND $2
                AND ($3::uuid IS NULL OR cl.id = $3::uuid)
                AND ($4::text IS NULL OR ts.time_period = $4::text)
                AND (
                  $5::text IS NULL OR
                  p.full_name ILIKE ('%' || $5 || '%')
                )
                AND ($6::uuid IS NULL OR c.patient_id = $6::uuid)
                AND ($7::uuid IS NULL OR ts.doctor_id = $7::uuid)
                AND ($8::int IS NULL OR f.feedback_rating = $8::int)
                ORDER BY
                f.received_at DESC
                LIMIT $9 OFFSET $10
         `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedPatientName,
          modifiedPatientId,
          modifiedDoctorId,
          feedbackRating,
          limit,
          offset,
        ]
      )

      const totalCounts = await this.getQuery<Array<{ count: string }>>(
        `SELECT COUNT(*) FROM feedbacks f
            JOIN consultations c ON f.consultation_id = c.id
            JOIN time_slots ts ON c.time_slot_id = ts.id
            JOIN clinics cl ON ts.clinic_id = cl.id
            LEFT JOIN doctors d ON ts.doctor_id = d.id
            LEFT JOIN patients p ON c.patient_id = p.id
            WHERE
              f.received_at::date BETWEEN $1 AND $2
              AND ($3::uuid IS NULL OR cl.id = $3::uuid)
              AND ($4::text IS NULL OR ts.time_period = $4::text)
              AND (
                $5::text IS NULL OR
                p.full_name ILIKE ('%' || $5 || '%')
              )
              AND ($6::uuid IS NULL OR c.patient_id = $6::uuid)
              AND ($7::uuid IS NULL OR ts.doctor_id = $7::uuid)
              AND ($8::int IS NULL OR f.feedback_rating = $8::int)
              `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedPatientName,
          modifiedPatientId,
          modifiedDoctorId,
          feedbackRating,
        ]
      )

      const data = rawFeedbacks.map((rawFeedback) => ({
        patient: {
          firstName: rawFeedback.patient_first_name,
          lastName: rawFeedback.patient_last_name,
          gender: rawFeedback.patient_gender,
        },
        doctor: {
          firstName: rawFeedback.doctor_first_name,
          lastName: rawFeedback.doctor_last_name,
          gender: rawFeedback.doctor_gender,
        },
        id: rawFeedback.id,
        receivedDate: rawFeedback.received_date,
        receivedAt: rawFeedback.received_at,
        feedbackRating: rawFeedback.feedback_rating,
        clinicId: rawFeedback.clinic_id,
        clinicName: rawFeedback.clinic_name,
        consultationTimePeriod: rawFeedback.consultation_time_period,
        consultationId: rawFeedback.consultation_id,
      }))

      return {
        data,
        totalCounts: parseInt(totalCounts[0].count, 10),
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
    granularity: Granularity = Granularity.DAY
  ): Promise<{
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
  }> {
    try {
      const startDateTime = dayjs(startDate)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const endDateTime = dayjs(endDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null

      const modifiedDoctorId = doctorId !== undefined ? doctorId : null

      const dateFormat = getDateFormat(granularity)

      const result = await this.getQuery<
        Array<{
          date: string
          feedbackcount: string
          onestarfeedbackcount: string
          twostarfeedbackcount: string
          threestarfeedbackcount: string
          fourstarfeedbackcount: string
          fivestarfeedbackcount: string
        }>
      >(
        `SELECT 
        TO_CHAR(f.received_at, '${dateFormat}') AS date,
        COUNT(*) AS feedbackcount,
        COUNT(CASE WHEN f.feedback_rating = 1 THEN 1 END) AS onestarfeedbackcount,
        COUNT(CASE WHEN f.feedback_rating = 2 THEN 1 END) AS twostarfeedbackcount,
        COUNT(CASE WHEN f.feedback_rating = 3 THEN 1 END) AS threestarfeedbackcount,
        COUNT(CASE WHEN f.feedback_rating = 4 THEN 1 END) AS fourstarfeedbackcount,
        COUNT(CASE WHEN f.feedback_rating = 5 THEN 1 END) AS fivestarfeedbackcount
        FROM feedbacks f
        JOIN consultations c ON f.consultation_id = c.id
        JOIN time_slots ts ON c.time_slot_id = ts.id
        WHERE f.received_at BETWEEN $1 AND $2
          AND ($3::uuid IS NULL OR ts.clinic_id = $3)
          AND ($4::text IS NULL OR ts.time_period = $4)
          AND ($5::uuid IS NULL OR ts.doctor_id = $5)
        GROUP BY TO_CHAR(f.received_at, '${dateFormat}')
        ORDER BY date;
      `,
        [
          startDateTime,
          endDateTime,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedDoctorId,
        ]
      )

      const totalFeedbackCounts = result.reduce(
        (sum, row) => sum + parseInt(row.feedbackcount, 10),
        0
      )
      const totalOneStarFeedbackCount = result.reduce(
        (sum, row) => sum + parseInt(row.onestarfeedbackcount, 10),
        0
      )
      const totalTwoStarFeedbackCount = result.reduce(
        (sum, row) => sum + parseInt(row.twostarfeedbackcount, 10),
        0
      )
      const totalThreeStarFeedbackCount = result.reduce(
        (sum, row) => sum + parseInt(row.threestarfeedbackcount, 10),
        0
      )
      const totalFourStarFeedbackCount = result.reduce(
        (sum, row) => sum + parseInt(row.fourstarfeedbackcount, 10),
        0
      )
      const totalFiveStarFeedbackCount = result.reduce(
        (sum, row) => sum + parseInt(row.fivestarfeedbackcount, 10),
        0
      )

      return {
        totalFeedbacks: totalFeedbackCounts,
        oneStarFeedbackCount: totalOneStarFeedbackCount,
        twoStarFeedbackCount: totalTwoStarFeedbackCount,
        threeStarFeedbackCount: totalThreeStarFeedbackCount,
        fourStarFeedbackCount: totalFourStarFeedbackCount,
        fiveStarFeedbackCount: totalFiveStarFeedbackCount,
        oneStarFeedbackRate: Math.round(
          (totalOneStarFeedbackCount / totalFeedbackCounts) * 100
        ),
        twoStarFeedbackRate: Math.round(
          (totalTwoStarFeedbackCount / totalFeedbackCounts) * 100
        ),
        threeStarFeedbackRate: Math.round(
          (totalThreeStarFeedbackCount / totalFeedbackCounts) * 100
        ),
        fourStarFeedbackRate: Math.round(
          (totalFourStarFeedbackCount / totalFeedbackCounts) * 100
        ),
        fiveStarFeedbackRate: Math.round(
          (totalFiveStarFeedbackCount / totalFeedbackCounts) * 100
        ),
        data: result.map((row) => ({
          date: row.date,
          feedbackCount: parseInt(row.feedbackcount, 10),
          oneStarFeedbackCount: parseInt(row.onestarfeedbackcount, 10),
          twoStarFeedbackCount: parseInt(row.twostarfeedbackcount, 10),
          threeStarFeedbackCount: parseInt(row.threestarfeedbackcount, 10),
          fourStarFeedbackCount: parseInt(row.fourstarfeedbackcount, 10),
          fiveStarFeedbackCount: parseInt(row.fivestarfeedbackcount, 10),
          oneStarFeedbackRate: Math.round(
            (parseInt(row.onestarfeedbackcount, 10) /
              parseInt(row.feedbackcount, 10)) *
              100
          ),
          twoStarFeedbackRate: Math.round(
            (parseInt(row.twostarfeedbackcount, 10) /
              parseInt(row.feedbackcount, 10)) *
              100
          ),
          threeStarFeedbackRate: Math.round(
            (parseInt(row.threestarfeedbackcount, 10) /
              parseInt(row.feedbackcount, 10)) *
              100
          ),
          fourStarFeedbackRate: Math.round(
            (parseInt(row.fourstarfeedbackcount, 10) /
              parseInt(row.feedbackcount, 10)) *
              100
          ),
          fiveStarFeedbackRate: Math.round(
            (parseInt(row.fivestarfeedbackcount, 10) /
              parseInt(row.feedbackcount, 10)) *
              100
          ),
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'FeedbackRepository getStarFeedback error',
        e as Error
      )
    }
  }

  private determineTreatmentType(
    hasAcupuncture: boolean,
    hasMedicine: boolean
  ): TreatmentType {
    if (hasAcupuncture && hasMedicine) {
      return TreatmentType.BOTH_TREATMENT
    } else if (hasAcupuncture) {
      return TreatmentType.ACUPUNTURE_TREATMENT
    } else if (hasMedicine) {
      return TreatmentType.MEDICINE_TREATMENT
    } else {
      return TreatmentType.NO_TREATMENT
    }
  }
}
