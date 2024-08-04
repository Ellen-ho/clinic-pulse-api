import { BaseRepository } from 'infrastructure/database/BaseRepository'
import { ConsultationEntity } from './ConsultationEntity'
import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import {
  Consultation,
  ConsultationStatus,
  OnsiteCancelReasonType,
  TreatmentType,
} from 'domain/consultation/Consultation'
import { DataSource } from 'typeorm'
import { ConsultationMapper } from './ConsultationMapper'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { GenderType } from 'domain/common'
import { RepositoryError } from 'infrastructure/error/RepositoryError'

export class ConsultationRepository
  extends BaseRepository<ConsultationEntity, Consultation>
  implements IConsultationRepository
{
  constructor(dataSource: DataSource) {
    super(ConsultationEntity, new ConsultationMapper(), dataSource)
  }

  public async findById(id: string): Promise<{
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
  } | null> {
    try {
      const rawConsultation = await this.getQuery<
        Array<{
          consultation_date: string
          consultation_time_period: TimePeriodType
          consultation_number: number
          onsite_cancel_at: Date | null
          onsite_cancel_reason: OnsiteCancelReasonType | null
          check_in_at: Date
          start_at: Date | null
          end_at: Date | null
          check_out_at: Date | null
          has_acupuncture: boolean
          has_medicine: boolean
          doctor_first_name: string
          doctor_last_name: string
          patient_first_name: string
          patient_last_name: string
          patient_gender: GenderType
          patient_age: number
          acupuncture_treatment_id: string | null
          acupuncture_treatment_start_at: Date | null
          acupuncture_treatment_end_at: Date | null
          acupuncture_treatment_assign_bed_at: Date | null
          acupuncture_treatment_remove_needle_at: Date | null
          medicine_treatment_id: string | null
          medicine_treatment_get_medicine_at: Date | null
        }>
      >(
        `
        SELECT
          TO_CHAR(c.check_in_at, 'YYYY-MM-DD') AS consultation_date,
          ts.time_period AS consultation_time_period,
          c.consultation_number,
          c.onsite_cancle_at AS onsite_cancel_at,
          c.onsite_cancle_reason AS onsite_cancel_reason,
          c.check_in_at,
          c.start_at,
          c.end_at,
          c.check_out_at,
          CASE WHEN at.id IS NOT NULL THEN true ELSE false END AS has_acupuncture,
          CASE WHEN mt.id IS NOT NULL THEN true ELSE false END AS has_medicine,
          at.id AS acupuncture_treatment_id,
          at.start_at AS acupuncture_treatment_start_at,
          at.end_at AS acupuncture_treatment_end_at,
          at.assign_bed_at AS acupuncture_treatment_assign_bed_at,
          at.remove_needle_at AS acupuncture_treatment_remove_needle_at,
          mt.id AS medicine_treatment_id,
          mt.get_medicine_at AS medicine_treatment_get_medicine_at,
          d.first_name AS doctor_first_name,
          d.last_name AS doctor_last_name,
          p.first_name AS patient_first_name,
          p.last_name AS patient_last_name,
          p.gender AS patient_gender,
          date_part('year', age(p.birth_date)) AS patient_age
        FROM consultations c
        LEFT JOIN time_slots ts ON ts.id = c.time_slot_id
        LEFT JOIN doctors d ON d.id = ts.doctor_id
        LEFT JOIN patients p ON p.id = c.patient_id
        LEFT JOIN acupuncture_treatments at ON at.id = c.acupuncture_treatment_id
        LEFT JOIN medicine_treatments mt ON mt.id = c.medicine_treatment_id
        WHERE c.id = $1
      `,
        [id]
      )

      return rawConsultation.length === 0
        ? null
        : {
            consultationDate: rawConsultation[0].consultation_date,
            consultationTimePeriod: rawConsultation[0].consultation_time_period,
            consultationNumber: rawConsultation[0].consultation_number,
            onsiteCancelAt: rawConsultation[0].onsite_cancel_at,
            onsiteCancelReason: rawConsultation[0].onsite_cancel_reason,
            checkInAt: rawConsultation[0].check_in_at,
            startAt: rawConsultation[0].start_at,
            endAt: rawConsultation[0].end_at,
            checkOutAt: rawConsultation[0].check_out_at,
            treatmentType: this.determineTreatmentType(
              rawConsultation[0].has_acupuncture,
              rawConsultation[0].has_medicine
            ),
            patient: {
              firstName: rawConsultation[0].patient_first_name,
              lastName: rawConsultation[0].patient_last_name,
              gender: rawConsultation[0].patient_gender,
              age: rawConsultation[0].patient_age,
            },
            doctor: {
              firstName: rawConsultation[0].doctor_first_name,
              lastName: rawConsultation[0].doctor_last_name,
            },
            acupunctureTreatment: rawConsultation[0].has_acupuncture
              ? {
                  id: rawConsultation[0].acupuncture_treatment_id,
                  startAt: rawConsultation[0].acupuncture_treatment_start_at,
                  endAt: rawConsultation[0].acupuncture_treatment_end_at,
                  assignBedAt:
                    rawConsultation[0].acupuncture_treatment_assign_bed_at,
                  removeNeedleAt:
                    rawConsultation[0].acupuncture_treatment_remove_needle_at,
                }
              : null,
            medicineTreatment: rawConsultation[0].has_medicine
              ? {
                  id: rawConsultation[0].medicine_treatment_id,
                  getMedicineAt:
                    rawConsultation[0].medicine_treatment_get_medicine_at,
                }
              : null,
          }
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository findById error',
        e as Error
      )
    }
  }

  public async findByQuery(
    limit: number,
    offset: number,
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    totalDurationMin?: number,
    totalDurationMax?: number,
    patientId?: string,
    doctorId?: string
  ): Promise<{
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
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null

      const modifiedTotalDurationMin =
        totalDurationMin !== undefined ? totalDurationMin : null
      const modifiedTotalDurationMax =
        totalDurationMax !== undefined ? totalDurationMax : null

      const modifiedPatientId = patientId !== undefined ? patientId : null

      const modifiedDoctorId = doctorId !== undefined ? doctorId : null

      const rawConsultations = await this.getQuery<
        Array<{
          id: string
          is_onsite_canceled: boolean
          onsite_cancel_reason: OnsiteCancelReasonType | null
          consultation_number: number
          consultation_date: string
          consultation_time_period: TimePeriodType
          doctor_first_name: string
          doctor_last_name: string
          patient_first_name: string
          patient_last_name: string
          patient_gender: GenderType
          patient_age: number
          has_acupuncture: boolean
          has_medicine: boolean
          total_duration: number
        }>
      >(
        `
          SELECT
          c.id,
          c.consultation_number,
          TO_CHAR(c.check_in_at, 'YYYY-MM-DD') AS consultation_date,
          ts.time_period AS consultation_time_period,
          d.first_name AS doctor_first_name,
          d.last_name AS doctor_last_name,
          p.first_name AS patient_first_name,
          p.last_name AS patient_last_name,
          p.gender AS patient_gender,
          date_part('year', age(p.birth_date)) AS patient_age,
          CASE WHEN c.onsite_cancle_at IS NOT NULL THEN true ELSE false END AS is_onsite_canceled,
          c.onsite_cancle_reason,
          CASE WHEN at.id IS NOT NULL THEN true ELSE false END AS has_acupuncture,
          CASE WHEN mt.id IS NOT NULL THEN true ELSE false END AS has_medicine,
          CASE
            WHEN c.check_out_at IS NOT NULL THEN
              EXTRACT(EPOCH FROM (c.check_out_at - c.check_in_at)) / 60
            WHEN c.onsite_cancle_at IS NOT NULL THEN
              EXTRACT(EPOCH FROM (c.onsite_cancle_at - c.check_in_at)) / 60
            ELSE
              NULL
          END AS total_duration
          FROM consultations c
          LEFT JOIN time_slots ts ON ts.id = c.time_slot_id
          LEFT JOIN doctors d ON d.id = ts.doctor_id
          LEFT JOIN patients p ON p.id = c.patient_id
          LEFT JOIN acupuncture_treatments at ON at.id = c.acupuncture_treatment_id
          LEFT JOIN medicine_treatments mt ON mt.id = c.medicine_treatment_id
          WHERE c.check_in_at BETWEEN $1 AND $2
            AND ($3::uuid IS NULL OR ts.clinic_id = $3::uuid)
            AND ($4::text IS NULL OR ts.time_period = $4::text)
            AND (
              $5::int IS NULL OR 
              (
                COALESCE(
                  EXTRACT(EPOCH FROM (c.check_out_at - c.check_in_at)), 
                  EXTRACT(EPOCH FROM (c.onsite_cancle_at - c.check_in_at))
                ) / 60 > $5::int
              )
            )
            AND (
              $6::int IS NULL OR 
              (
                COALESCE(
                  EXTRACT(EPOCH FROM (c.check_out_at - c.check_in_at)), 
                  EXTRACT(EPOCH FROM (c.onsite_cancle_at - c.check_in_at))
                ) / 60 < $6::int
              )
            )
            AND ($7::uuid IS NULL OR c.patient_id = $7::uuid)
            AND ($8::uuid IS NULL OR ts.doctor_id = $8::uuid)
          ORDER BY c.check_in_at ASC
          LIMIT $9 OFFSET $10
        `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedTotalDurationMin,
          modifiedTotalDurationMax,
          modifiedPatientId,
          modifiedDoctorId,
          limit,
          offset,
        ]
      )

      const totalCounts = await this.getQuery<Array<{ count: string }>>(
        `
        SELECT COUNT(*) AS count
        FROM consultations c
        LEFT JOIN time_slots ts ON ts.id = c.time_slot_id
        WHERE c.check_in_at BETWEEN $1 AND $2
          AND ($3::uuid IS NULL OR ts.clinic_id = $3::uuid)
          AND ($4::text IS NULL OR ts.time_period = $4::text)  
          AND (
            $5::int IS NULL OR 
            (
              COALESCE(
                EXTRACT(EPOCH FROM (c.check_out_at - c.check_in_at)), 
                EXTRACT(EPOCH FROM (c.onsite_cancle_at - c.check_in_at))
              ) / 60 > $5::int
            )
          )
          AND (
            $6::int IS NULL OR 
            (
              COALESCE(
                EXTRACT(EPOCH FROM (c.check_out_at - c.check_in_at)), 
                EXTRACT(EPOCH FROM (c.onsite_cancle_at - c.check_in_at))
              ) / 60 < $6::int
            )
          )
          AND ($7::uuid IS NULL OR c.patient_id = $7::uuid)
          AND ($8::uuid IS NULL OR ts.doctor_id = $8::uuid)
        `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedTotalDurationMin,
          modifiedTotalDurationMax,
          modifiedPatientId,
          modifiedDoctorId,
        ]
      )

      const data = rawConsultations.map((rawConsultation) => ({
        id: rawConsultation.id,
        isOnsiteCanceled: rawConsultation.is_onsite_canceled,
        onsiteCancelReason: rawConsultation.onsite_cancel_reason,
        consultationNumber: rawConsultation.consultation_number,
        consultationDate: rawConsultation.consultation_date,
        consultationTimePeriod: rawConsultation.consultation_time_period,
        doctor: {
          firstName: rawConsultation.doctor_first_name,
          lastName: rawConsultation.doctor_last_name,
        },
        patient: {
          firstName: rawConsultation.patient_first_name,
          lastName: rawConsultation.patient_last_name,
          gender: rawConsultation.patient_gender,
          age: rawConsultation.patient_age,
        },
        treatmentType: this.determineTreatmentType(
          rawConsultation.has_acupuncture,
          rawConsultation.has_medicine
        ),
        totalDuration:
          rawConsultation.total_duration != null
            ? Math.floor(rawConsultation.total_duration)
            : 0,
      }))

      return {
        data,
        totalCounts: parseInt(totalCounts[0].count, 10),
      }
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository findByQuery error',
        e as Error
      )
    }
  }

  public async findByDateRangeAndClinic(
    startDate: string,
    endDate: string,
    clinicId?: string
  ): Promise<{
    totalConsultation: number
    consultationWithOnlineBooking: number
    consultationWithOnsiteCancel: number
  }> {
    try {
      let baseQuery = `
      SELECT COUNT(*) 
      FROM consultations
      JOIN time_slots ON consultations.time_slot_id = time_slots.id
      WHERE check_in_at >= $1 AND check_in_at <= $2
    `
      const queryParams = [startDate, endDate]

      if (clinicId !== undefined) {
        baseQuery += ' AND time_slots.clinic_id = $3'
        queryParams.push(clinicId)
      }

      const totalResult = await this.getQuery<Array<{ count: string }>>(
        baseQuery,
        queryParams
      )
      const totalConsultation = parseInt(totalResult[0].count, 10)

      const onlineQuery = `${baseQuery} AND source = 'ONLINE_BOOKING'`
      const onlineResult = await this.getQuery<Array<{ count: string }>>(
        onlineQuery,
        queryParams
      )
      const consultationWithOnlineBooking = parseInt(onlineResult[0].count, 10)

      const onsiteCancelQuery = `${baseQuery} AND onsite_cancle_at IS NOT NULL`
      const onsiteCancelResult = await this.getQuery<Array<{ count: string }>>(
        onsiteCancelQuery,
        queryParams
      )
      const consultationWithOnsiteCancel = parseInt(
        onsiteCancelResult[0].count,
        10
      )

      return {
        totalConsultation,
        consultationWithOnlineBooking,
        consultationWithOnsiteCancel,
      }
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository findByDateRangeAndClinic error',
        e as Error
      )
    }
  }

  public async getRealTimeCounts(
    clinicId?: string,
    consultationRoomNumber?: string
  ): Promise<{
    waitForConsultationCount: number
    waitForBedAssignedCount: number
    waitForAcupunctureTreatmentCount: number
    waitForNeedleRemovedCount: number
    waitForMedicineCount: number
    completedCount: number
  }> {
    try {
      let baseQuery = `
        SELECT status, COUNT(*) as count
        FROM consultations
        JOIN time_slots ON consultations.time_slot_id = time_slots.id
        WHERE 1=1
      `

      const queryParams = []

      if (clinicId !== undefined) {
        baseQuery += ' AND time_slots.clinic_id = $1'
        queryParams.push(clinicId)
      }

      if (consultationRoomNumber !== undefined) {
        baseQuery +=
          ' AND time_slots.consultation_room_id = (SELECT id FROM consultation_rooms WHERE room_number = $2)'
        queryParams.push(consultationRoomNumber)
      }

      baseQuery += ' GROUP BY status'

      const results = await this.getQuery<
        Array<{ status: ConsultationStatus; count: string }>
      >(baseQuery, queryParams)

      const response = {
        waitForConsultationCount: 0,
        waitForBedAssignedCount: 0,
        waitForAcupunctureTreatmentCount: 0,
        waitForNeedleRemovedCount: 0,
        waitForMedicineCount: 0,
        completedCount: 0,
      }

      results.forEach((result) => {
        const count = parseInt(result.count, 10)
        switch (result.status) {
          case ConsultationStatus.WAITING_FOR_CONSULTATION:
            response.waitForConsultationCount = count
            break
          case ConsultationStatus.WAITING_FOR_BED_ASSIGNMENT:
            response.waitForBedAssignedCount = count
            break
          case ConsultationStatus.WAITING_FOR_ACUPUNCTURE_TREATMENT:
            response.waitForAcupunctureTreatmentCount = count
            break
          case ConsultationStatus.WAITING_FOR_NEEDLE_REMOVAL:
            response.waitForNeedleRemovedCount = count
            break
          case ConsultationStatus.CONSULTATION_COMPLETED:
            response.completedCount = count
            break
        }
      })

      return response
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository getRealTimeCounts error',
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
