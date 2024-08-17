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
import { GenderType, Granularity } from 'domain/common'
import { RepositoryError } from 'infrastructure/error/RepositoryError'
import { getDateFormat } from 'infrastructure/utils/SqlDateFormat'
import dayjs from 'dayjs'

export class ConsultationRepository
  extends BaseRepository<ConsultationEntity, Consultation>
  implements IConsultationRepository
{
  constructor(dataSource: DataSource) {
    super(ConsultationEntity, new ConsultationMapper(), dataSource)
  }

  public async findById(id: string): Promise<{
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
  } | null> {
    try {
      const rawConsultation = await this.getQuery<
        Array<{
          id: string
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
          doctor_id: string
          doctor_first_name: string
          doctor_last_name: string
          doctor_gender: GenderType
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
          c.id,
          c.consultation_number,
          c.onsite_cancel_at AS onsite_cancel_at,
          c.onsite_cancel_reason AS onsite_cancel_reason,
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
          d.id AS doctor_id,
          d.first_name AS doctor_first_name,
          d.last_name AS doctor_last_name,
          d.gender AS doctor_gender,
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
            id: rawConsultation[0].id,
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
              id: rawConsultation[0].doctor_id,
              firstName: rawConsultation[0].doctor_first_name,
              lastName: rawConsultation[0].doctor_last_name,
              gender: rawConsultation[0].doctor_gender,
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
    patientName?: string,
    patientId?: string,
    doctorId?: string
  ): Promise<{
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
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null

      const modifiedTotalDurationMin =
        totalDurationMin !== undefined ? totalDurationMin : null
      const modifiedTotalDurationMax =
        totalDurationMax !== undefined ? totalDurationMax : null

      const modifiedPatientName =
        patientName !== undefined && patientName.trim() !== ''
          ? patientName.trim()
          : null

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
          CASE WHEN c.onsite_cancel_at IS NOT NULL THEN true ELSE false END AS is_onsite_canceled,
          c.onsite_cancel_reason,
          CASE WHEN at.id IS NOT NULL THEN true ELSE false END AS has_acupuncture,
          CASE WHEN mt.id IS NOT NULL THEN true ELSE false END AS has_medicine,
          CASE
            WHEN c.check_out_at IS NOT NULL THEN
              EXTRACT(EPOCH FROM (c.check_out_at - c.check_in_at)) / 60
            WHEN c.onsite_cancel_at IS NOT NULL THEN
              EXTRACT(EPOCH FROM (c.onsite_cancel_at - c.check_in_at)) / 60
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
                  EXTRACT(EPOCH FROM (c.onsite_cancel_at - c.check_in_at))
                ) / 60 > $5::int
              )
            )
            AND (
              $6::int IS NULL OR 
              (
                COALESCE(
                  EXTRACT(EPOCH FROM (c.check_out_at - c.check_in_at)), 
                  EXTRACT(EPOCH FROM (c.onsite_cancel_at - c.check_in_at))
                ) / 60 < $6::int
              )
            )
            AND (
              $7::text IS NULL OR
              p.full_name ILIKE ('%' || $7 || '%')
            )
            AND ($8::uuid IS NULL OR c.patient_id = $8::uuid)
            AND ($9::uuid IS NULL OR ts.doctor_id = $9::uuid)
          ORDER BY c.check_in_at ASC
          LIMIT $10 OFFSET $11
        `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedTotalDurationMin,
          modifiedTotalDurationMax,
          modifiedPatientName,
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
        LEFT JOIN doctors d ON d.id = ts.doctor_id
        LEFT JOIN patients p ON p.id = c.patient_id 
        WHERE c.check_in_at BETWEEN $1 AND $2
          AND ($3::uuid IS NULL OR ts.clinic_id = $3::uuid)
          AND ($4::text IS NULL OR ts.time_period = $4::text)  
          AND (
            $5::int IS NULL OR 
            (
              COALESCE(
                EXTRACT(EPOCH FROM (c.check_out_at - c.check_in_at)), 
                EXTRACT(EPOCH FROM (c.onsite_cancel_at - c.check_in_at))
              ) / 60 > $5::int
            )
          )
          AND (
            $6::int IS NULL OR 
            (
              COALESCE(
                EXTRACT(EPOCH FROM (c.check_out_at - c.check_in_at)), 
                EXTRACT(EPOCH FROM (c.onsite_cancel_at - c.check_in_at))
              ) / 60 < $6::int
            )
          )
          AND (
            $7::text IS NULL OR
            p.full_name ILIKE ('%' || $7 || '%')
          )
          AND ($8::uuid IS NULL OR c.patient_id = $8::uuid)
          AND ($9::uuid IS NULL OR ts.doctor_id = $9::uuid)
        `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedTotalDurationMin,
          modifiedTotalDurationMax,
          modifiedPatientName,
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

  public async getDurationCanceledAndBookingByGranularity(
    startDate: string,
    endDate: string,
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType,
    granularity: Granularity = Granularity.DAY
  ): Promise<{
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
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedDoctorId = doctorId !== undefined ? doctorId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null
      const startDateTime = dayjs(startDate)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const endDateTime = dayjs(endDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

      const dateFormat = getDateFormat(granularity)

      const result = await this.getQuery<
        Array<{
          date: string
          online_booking_count: string
          onsite_cancel_count: string
          consultation_count: string
        }>
      >(
        `
          SELECT 
            TO_CHAR(c.check_in_at, $6) AS date,
            COUNT(*) AS consultation_count,
            COUNT(CASE WHEN c.source = 'ONLINE_BOOKING' THEN 1 END) AS online_booking_count,
            COUNT(CASE WHEN c.onsite_cancel_at IS NOT NULL THEN 1 END) AS onsite_cancel_count
          FROM consultations c
          LEFT JOIN time_slots ts ON ts.id = c.time_slot_id
          WHERE c.check_in_at BETWEEN $1 AND $2
            AND ($3::uuid IS NULL OR ts.clinic_id = $3::uuid)
            AND ($4::uuid IS NULL OR ts.doctor_id = $4::uuid)
            AND ($5::varchar IS NULL OR ts.time_period = $5::varchar)
          GROUP BY TO_CHAR(c.check_in_at, $6)
          ORDER BY date
        `,
        [
          startDateTime,
          endDateTime,
          modifiedClinicId,
          modifiedDoctorId,
          modifiedTimePeriod,
          dateFormat,
        ]
      )
      const data = result.map((row) => ({
        date: row.date,
        onlineBookingCount: parseInt(row.online_booking_count, 10),
        onsiteCancelCount: parseInt(row.onsite_cancel_count, 10),
        consultationCount: parseInt(row.consultation_count, 10),
        onlineBookingRate:
          parseInt(row.consultation_count, 10) > 0
            ? Math.round(
                (parseInt(row.online_booking_count, 10) /
                  parseInt(row.consultation_count, 10)) *
                  100
              )
            : 0,
        onsiteCancelRate:
          parseInt(row.consultation_count, 10) > 0
            ? Math.round(
                (parseInt(row.onsite_cancel_count, 10) /
                  parseInt(row.consultation_count, 10)) *
                  100
              )
            : 0,
      }))

      const totalConsultations = data.reduce(
        (acc, cur) => acc + cur.consultationCount,
        0
      )
      const consultationWithOnlineBooking = data.reduce(
        (acc, cur) => acc + cur.onlineBookingCount,
        0
      )
      const consultationWithOnsiteCancel = data.reduce(
        (acc, cur) => acc + cur.onsiteCancelCount,
        0
      )
      const onlineBookingRate =
        totalConsultations > 0
          ? Math.round(
              (consultationWithOnlineBooking / totalConsultations) * 100
            )
          : 0
      const onsiteCancelRate =
        totalConsultations > 0
          ? Math.round(
              (consultationWithOnsiteCancel / totalConsultations) * 100
            )
          : 0

      return {
        totalConsultations,
        consultationWithOnlineBooking,
        consultationWithOnsiteCancel,
        onlineBookingRate,
        onsiteCancelRate,
        data,
      }
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository getDurationCanceledAndBookingByGranularity error',
        e as Error
      )
    }
  }

  public async getRealTimeCounts(
    timeSlotId: string | Array<{ id: string }>,
    clinicId?: string,
    consultationRoomNumber?: string,
    doctorId?: string
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

      const queryParams: any[] = []

      if (Array.isArray(timeSlotId)) {
        const placeholders = timeSlotId
          .map((_, index) => `$${index + 1}`)
          .join(', ')
        baseQuery += ` AND time_slot_id IN (${placeholders})`
        queryParams.push(...timeSlotId.map((slot) => slot.id))
      } else {
        baseQuery += ' AND time_slot_id = $1'
        queryParams.push(timeSlotId)
      }

      let paramIndex = queryParams.length + 1

      if (clinicId !== undefined) {
        baseQuery += ` AND time_slots.clinic_id = $${paramIndex++}`
        queryParams.push(clinicId)
      }

      if (consultationRoomNumber !== undefined) {
        baseQuery += `
        AND time_slots.consultation_room_id = (
          SELECT id FROM consultation_rooms WHERE room_number = $${paramIndex++}
        )
      `
        queryParams.push(consultationRoomNumber)
      }

      if (doctorId !== undefined) {
        baseQuery += ` AND time_slots.doctor_id = $${paramIndex++}`
        queryParams.push(doctorId)
      }

      baseQuery += ' GROUP BY status'

      const results = await this.getQuery<
        Array<{ status: ConsultationStatus; count: string }>
      >(baseQuery, queryParams)

      const response = {
        timeSlotId,
        waitForConsultationCount: 0,
        waitForBedAssignedCount: 0,
        waitForAcupunctureTreatmentCount: 0,
        waitForNeedleRemovedCount: 0,
        waitForMedicineCount: 0,
        completedCount: 0,
      }

      results.forEach((result) => {
        const statusTrimmed = result.status.trim()
        const count = parseInt(result.count, 10)
        switch (statusTrimmed) {
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
          case ConsultationStatus.WAITING_FOR_GET_MEDICINE:
            response.waitForMedicineCount = count
            break
          case ConsultationStatus.CHECK_OUT:
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

  public async getAverageWaitingTime(
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string,
    patientId?: string,
    granularity: Granularity = Granularity.DAY
  ): Promise<{
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
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null

      const modifiedPatientId = patientId !== undefined ? patientId : null

      const modifiedDoctorId = doctorId !== undefined ? doctorId : null

      const startDateTime = dayjs(startDate)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const endDateTime = dayjs(endDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

      const dateFormat = getDateFormat(granularity)

      const totalAverages = await this.getQuery<
        Array<{
          total_average_consultation_wait: number
          total_average_bed_assignment_wait: number
          total_average_acupuncture_wait: number
          total_average_needle_removal_wait: number
          total_average_medication_wait: number
        }>
      >(
        `
        SELECT
          ROUND(AVG(EXTRACT(EPOCH FROM 
            CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN c.onsite_cancel_at - c.check_in_at
              ELSE c.start_at - c.check_in_at 
            END) / 60)) AS total_average_consultation_wait,
          
          ROUND(AVG(EXTRACT(EPOCH FROM 
            CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN INTERVAL '0'
              WHEN at.id IS NOT NULL THEN at.assign_bed_at - c.end_at
              ELSE NULL
            END) / 60)) AS  total_average_bed_assignment_wait,

          ROUND(AVG(EXTRACT(EPOCH FROM 
            CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN INTERVAL '0'
              WHEN at.id IS NOT NULL THEN at.start_at - at.assign_bed_at
              ELSE NULL
            END) / 60)) AS total_average_acupuncture_wait,

          ROUND(AVG(EXTRACT(EPOCH FROM 
            CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN INTERVAL '0'
              WHEN at.id IS NOT NULL THEN at.remove_needle_at - at.end_at
              ELSE NULL
            END) / 60)) AS total_average_needle_removal_wait,

          ROUND(AVG(EXTRACT(EPOCH FROM 
            CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN INTERVAL '0'
              WHEN at.id IS NOT NULL AND mt.id IS NOT NULL THEN mt.get_medicine_at - at.end_at
              WHEN mt.id IS NOT NULL THEN mt.get_medicine_at - c.end_at
              ELSE NULL
            END) / 60)) AS total_average_medication_wait

        FROM consultations c
        LEFT JOIN acupuncture_treatments at ON c.acupuncture_treatment_id = at.id
        LEFT JOIN medicine_treatments mt ON c.medicine_treatment_id = mt.id
        LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
        WHERE c.check_in_at BETWEEN $1 AND $2
          AND ($3::uuid IS NULL OR ts.clinic_id = $3::uuid)
          AND ($4::varchar IS NULL OR ts.time_period = $4::varchar)
          AND ($5::uuid IS NULL OR ts.doctor_id = $5::uuid)
          AND ($6::uuid IS NULL OR c.patient_id = $6::uuid);
        `,
        [
          startDateTime,
          endDateTime,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedDoctorId,
          modifiedPatientId,
        ]
      )

      const granularityAverages = await this.getQuery<
        Array<{
          date: string
          average_consultation_wait: number
          average_bed_assignment_wait: number
          average_acupuncture_wait: number
          average_needle_removal_wait: number
          average_medication_wait: number
        }>
      >(
        ` SELECT
            TO_CHAR(c.check_in_at, '${dateFormat}') AS date,
            ROUND(AVG(EXTRACT(EPOCH FROM CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN c.onsite_cancel_at - c.check_in_at
              ELSE c.start_at - c.check_in_at 
            END) / 60)) AS average_consultation_wait,
          
            ROUND(AVG(EXTRACT(EPOCH FROM CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN INTERVAL '0'
              WHEN at.id IS NOT NULL THEN at.assign_bed_at - c.end_at
              ELSE NULL
            END) / 60)) AS average_bed_assignment_wait,

            ROUND(AVG(EXTRACT(EPOCH FROM CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN INTERVAL '0'
              WHEN at.id IS NOT NULL THEN at.start_at - at.assign_bed_at
              ELSE NULL
            END) / 60)) AS average_acupuncture_wait,

            ROUND(AVG(EXTRACT(EPOCH FROM CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN INTERVAL '0'
              WHEN at.id IS NOT NULL THEN at.remove_needle_at - at.end_at
              ELSE NULL
            END) / 60)) AS average_needle_removal_wait,

            ROUND(AVG(EXTRACT(EPOCH FROM CASE 
              WHEN c.onsite_cancel_at IS NOT NULL THEN INTERVAL '0'
              WHEN at.id IS NOT NULL AND mt.id IS NOT NULL THEN mt.get_medicine_at - at.end_at
              WHEN mt.id IS NOT NULL THEN mt.get_medicine_at - c.end_at
              ELSE NULL
            END) / 60)) AS average_medication_wait

            FROM consultations c
            LEFT JOIN acupuncture_treatments at ON c.acupuncture_treatment_id = at.id
            LEFT JOIN medicine_treatments mt ON c.medicine_treatment_id = mt.id
            LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
            WHERE c.check_in_at BETWEEN $1 AND $2
              AND ($3::uuid IS NULL OR ts.clinic_id = $3::uuid)
              AND ($4::varchar IS NULL OR ts.time_period = $4::varchar)
              AND ($5::uuid IS NULL OR ts.doctor_id = $5::uuid)
              AND ($6::uuid IS NULL OR c.patient_id = $6::uuid)
            GROUP BY TO_CHAR(c.check_in_at, '${dateFormat}')
            ORDER BY date;
          `,
        [
          startDateTime,
          endDateTime,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedDoctorId,
          modifiedPatientId,
        ]
      )

      return {
        totalAverageConsultationWait: Number(
          totalAverages[0].total_average_consultation_wait
        ),
        totalAverageBedAssignmentWait: Number(
          totalAverages[0].total_average_bed_assignment_wait
        ),
        totalAverageAcupunctureWait: Number(
          totalAverages[0].total_average_acupuncture_wait
        ),
        totalAverageNeedleRemovalWait: Number(
          totalAverages[0].total_average_needle_removal_wait
        ),
        totalAverageMedicationWait: Number(
          totalAverages[0].total_average_medication_wait
        ),
        data: granularityAverages.map((item) => ({
          date: item.date,
          averageConsultationWait: Number(item.average_consultation_wait),
          averageBedAssignmentWait: Number(item.average_bed_assignment_wait),
          averageAcupunctureWait: Number(item.average_acupuncture_wait),
          averageNeedleRemovalWait: Number(item.average_needle_removal_wait),
          averageMedicationWait: Number(item.average_medication_wait),
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository getAverageWaitingTime error',
        e as Error
      )
    }
  }

  public async getFirstTimeConsultationCounts(
    startDate: string,
    endDate: string,
    clinicId?: string,
    timePeriod?: TimePeriodType,
    doctorId?: string
  ): Promise<{
    totalConsultationCount: number
    firstTimeConsultationCount: number
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null
      const modifiedDoctorId = doctorId !== undefined ? doctorId : null
      const result = await this.getQuery<
        Array<{
          totalConsultationCount: number
          firstTimeConsultationCount: number
        }>
      >(
        `
        SELECT 
        COUNT(*) AS "totalConsultationCount",
        COUNT(CASE WHEN c.is_first_time_visit THEN 1 END) AS "firstTimeConsultationCount"
        FROM consultations c
        LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
        WHERE c.check_in_at BETWEEN $1 AND $2
          AND ($3::uuid IS NULL OR ts.clinic_id = $3::uuid)
          AND ($4::varchar IS NULL OR ts.time_period = $4::varchar)
          AND ($5::uuid IS NULL OR ts.doctor_id = $5::uuid);
      `,
        [
          startDate,
          endDate,
          modifiedClinicId,
          modifiedTimePeriod,
          modifiedDoctorId,
        ]
      )

      const totalConsultationCount = isNaN(
        Number(result[0].totalConsultationCount)
      )
        ? 0
        : Number(result[0].totalConsultationCount)

      const firstTimeConsultationCount = isNaN(
        Number(result[0].firstTimeConsultationCount)
      )
        ? 0
        : Number(result[0].firstTimeConsultationCount)

      return {
        totalConsultationCount,
        firstTimeConsultationCount,
      }
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository getFirstTimeConsultationCounts error',
        e as Error
      )
    }
  }

  public async getDurationCountByGranularity(
    startDate: string,
    endDate: string,
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType,
    granularity: Granularity = Granularity.DAY
  ): Promise<{
    totalConsultations: number
    data: Array<{
      date: string
      consultationCount: number
    }>
  }> {
    try {
      const modifiedClinicId =
        clinicId !== undefined && clinicId !== '' ? clinicId : null
      const modifiedTimePeriod = timePeriod !== undefined ? timePeriod : null
      const modifiedDoctorId = doctorId !== undefined ? doctorId : null
      const startDateTime = dayjs(startDate)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const endDateTime = dayjs(endDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

      const dateFormat = getDateFormat(granularity)

      const rawConsultations = await this.getQuery<
        Array<{
          date: string
          count: string
        }>
      >(
        `
        SELECT 
        TO_CHAR(c.check_in_at, '${dateFormat}') AS date,
        COUNT(*) AS count
        FROM consultations c
        LEFT JOIN time_slots ts ON ts.id = c.time_slot_id
        WHERE c.check_in_at BETWEEN $1 AND $2
          AND c.onsite_cancel_at IS NULL
          AND ($3::uuid IS NULL OR ts.clinic_id = $3::uuid)
          AND ($4::uuid IS NULL OR ts.doctor_id = $4::uuid)
          AND ($5::varchar IS NULL OR ts.time_period = $5::varchar)
        GROUP BY TO_CHAR(c.check_in_at, '${dateFormat}')
        ORDER BY date
        `,
        [
          startDateTime,
          endDateTime,
          modifiedClinicId,
          modifiedDoctorId,
          modifiedTimePeriod,
        ]
      )

      const totalConsultations = rawConsultations.reduce(
        (acc, curr) => acc + parseInt(curr.count, 10),
        0
      )

      const data = rawConsultations.map((consultation) => ({
        date: consultation.date,
        consultationCount: parseInt(consultation.count, 10),
      }))

      return {
        totalConsultations,
        data,
      }
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository getDurationCountByGranularity error',
        e as Error
      )
    }
  }

  public async getDifferentTreatmentConsultation(
    startDate: string,
    endDate: string,
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType,
    granularity: Granularity = Granularity.DAY
  ): Promise<{
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
  }> {
    try {
      const startDateTime = dayjs(startDate)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const endDateTime = dayjs(endDate)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

      const dateFormat = getDateFormat(granularity)
      const { conditionString, params } = this.generateSQLConditions(
        clinicId,
        doctorId,
        timePeriod
      )

      const baseQueryParams = [startDateTime, endDateTime, ...params]

      const totalConsultationsResult = await this.getQuery<
        Array<{
          count: string
        }>
      >(
        `SELECT COUNT(*) AS count
          FROM consultations c
          LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
          WHERE c.check_in_at BETWEEN $1 AND $2
          AND c.onsite_cancel_at IS NULL ${conditionString}`,
        baseQueryParams
      )

      const totalWithAcupuncture = await this.getQuery<
        Array<{ count: string }>
      >(
        ` SELECT COUNT(*) AS count
          FROM consultations c
          LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
          WHERE c.acupuncture_treatment_id IS NOT NULL
            AND c.check_in_at::date BETWEEN TO_DATE($1, 'YYYY-MM-DD') AND TO_DATE($2, 'YYYY-MM-DD')
            AND c.onsite_cancel_at IS NULL ${conditionString}`,
        baseQueryParams
      )

      const totalWithMedicine = await this.getQuery<Array<{ count: string }>>(
        ` SELECT COUNT(*) AS count
            FROM consultations c
          LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
          WHERE c.medicine_treatment_id IS NOT NULL
            AND c.check_in_at BETWEEN $1 AND $2
            AND c.onsite_cancel_at IS NULL ${conditionString}`,
        baseQueryParams
      )

      const totalWithBoth = await this.getQuery<Array<{ count: string }>>(
        `SELECT COUNT(*) AS count
          FROM consultations c
          LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
          WHERE c.acupuncture_treatment_id IS NOT NULL
            AND c.medicine_treatment_id IS NOT NULL
            AND c.check_in_at BETWEEN $1 AND $2
            AND c.onsite_cancel_at IS NULL ${conditionString}`,
        baseQueryParams
      )

      const totalOnlyAcupuncture = await this.getQuery<
        Array<{ count: string }>
      >(
        `SELECT COUNT(*) AS count
          FROM consultations c
          LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
          WHERE c.acupuncture_treatment_id IS NOT NULL
            AND c.medicine_treatment_id IS NULL
            AND c.check_in_at BETWEEN $1 AND $2
            AND c.onsite_cancel_at IS NULL ${conditionString}`,
        baseQueryParams
      )

      const totalOnlyMedicine = await this.getQuery<Array<{ count: string }>>(
        ` SELECT COUNT(*) AS count
            FROM consultations c
          LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
          WHERE c.medicine_treatment_id IS NOT NULL
            AND c.acupuncture_treatment_id IS NULL
            AND c.check_in_at BETWEEN $1 AND $2
            AND c.onsite_cancel_at IS NULL ${conditionString}`,
        baseQueryParams
      )

      const dailyData = await this.getQuery<
        Array<{
          date: string
          consultationcount: string
          consultationwithacupuncture: string
          consultationwithmedicine: string
          consultationwithbothtreatment: string
          onlyacupuncturecount: string
          onlymedicinecount: string
        }>
      >(
        `
          SELECT 
            TO_CHAR(c.check_in_at, '${dateFormat}') AS date,
            COUNT(*) AS consultationcount,
            COUNT(c.acupuncture_treatment_id) AS consultationwithacupuncture,
            COUNT(c.medicine_treatment_id) AS consultationwithmedicine,
            COUNT(*) FILTER (WHERE c.acupuncture_treatment_id IS NOT NULL AND c.medicine_treatment_id IS NOT NULL) AS consultationwithbothtreatment,
            COUNT(*) FILTER (WHERE c.acupuncture_treatment_id IS NOT NULL AND c.medicine_treatment_id IS NULL) AS onlyacupuncturecount,
            COUNT(*) FILTER (WHERE c.acupuncture_treatment_id IS NULL AND c.medicine_treatment_id IS NOT NULL) AS onlymedicinecount
          FROM consultations c
          LEFT JOIN time_slots ts ON c.time_slot_id = ts.id
          WHERE c.check_in_at BETWEEN $1 AND $2
            AND c.onsite_cancel_at IS NULL ${conditionString}
          GROUP BY TO_CHAR(c.check_in_at, '${dateFormat}')
          ORDER BY date;
        `,
        baseQueryParams
      )

      return {
        totalConsultations: parseInt(totalConsultationsResult[0].count, 10),
        totalConsultationWithAcupuncture: parseInt(
          totalWithAcupuncture[0].count,
          10
        ),
        totalConsultationWithMedicine: parseInt(totalWithMedicine[0].count, 10),
        totalConsultationWithBothTreatment: parseInt(
          totalWithBoth[0].count,
          10
        ),
        totalOnlyAcupunctureCount: parseInt(totalOnlyAcupuncture[0].count, 10),
        totalOnlyMedicineCount: parseInt(totalOnlyMedicine[0].count, 10),
        data: dailyData.map((day) => ({
          date: day.date,
          consultationCount: parseInt(day.consultationcount, 10),
          consultationWithAcupuncture: Number(day.consultationwithacupuncture),
          consultationWithMedicine: Number(day.consultationwithmedicine),
          consultationWithBothTreatment: Number(
            day.consultationwithbothtreatment
          ),
          onlyAcupunctureCount: Number(day.onlyacupuncturecount),
          onlyMedicineCount: Number(day.onlymedicinecount),
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository getDifferentTreatmentConsultation error',
        e as Error
      )
    }
  }

  public async isFirstTimeVisit(patientId: string): Promise<boolean> {
    const rawQuery = `
      SELECT COUNT(*) AS count
      FROM consultations
      WHERE patient_id = $1;
    `
    const result = await this.getQuery<Array<{ count: number }>>(rawQuery, [
      patientId,
    ])
    return result[0].count === 0
  }

  public async getLatestOddConsultationNumber(
    timeSlotId: string
  ): Promise<number> {
    try {
      const rawQuery = `
        SELECT MAX(consultation_number) AS max_odd_number
        FROM consultations
        WHERE time_slot_id = $1 AND consultation_number % 2 <> 0;
      `

      const result = await this.getQuery<
        Array<{ max_odd_number: number | null }>
      >(rawQuery, [timeSlotId])

      if (result.length === 0 || result[0].max_odd_number === null) {
        return 1
      }

      return result[0].max_odd_number
    } catch (e) {
      throw new RepositoryError(
        'ConsultationRepository getLatestOddConsultationNumber error',
        e as Error
      )
    }
  }

  public async getById(id: string): Promise<Consultation | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
        relations: ['acupunctureTreatment', 'medicineTreatment'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'ConsultAppointmentEntity getById error',
        e as Error
      )
    }
  }

  private generateSQLConditions(
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType
  ): { conditionString: string; params: any[] } {
    const params = [clinicId ?? null, doctorId ?? null, timePeriod ?? null]
    const conditionString = `
      AND ($3::uuid IS NULL OR ts.clinic_id = $3)
      AND ($4::uuid IS NULL OR ts.doctor_id = $4)
      AND ($5::varchar IS NULL OR ts.time_period = $5)
    `
    return {
      conditionString,
      params,
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
