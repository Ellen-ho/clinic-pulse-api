import { BaseRepository } from '../../../infrastructure/database/BaseRepository'
import { TimeSlotEntity } from './TimeSlotEntity'
import { TimePeriodType, TimeSlot } from '../../../domain/timeSlot/TimeSlot'
import { DataSource } from 'typeorm'
import { TimeSlotMapper } from './TimeSlotMapper'
import { Granularity } from '../../../domain/common'
import { getDateFormat } from '../../../infrastructure/utils/SqlDateFormat'
import { ITimeSlotRepository } from '../../../domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { RepositoryError } from '../../../infrastructure/error/RepositoryError'
import dayjs from 'dayjs'
import { RoomNumberType } from 'domain/consultationRoom/ConsultationRoom'

export class TimeSlotRepository
  extends BaseRepository<TimeSlotEntity, TimeSlot>
  implements ITimeSlotRepository
{
  constructor(dataSource: DataSource) {
    super(TimeSlotEntity, new TimeSlotMapper(), dataSource)
  }

  public async getDurationCountByGranularity(
    startDate: string,
    endDate: string,
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType,
    granularity: Granularity = Granularity.DAY
  ): Promise<{
    totalTimeSlots: number
    data: Array<{
      date: string
      timeSlotCount: number
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

      const rawTimeSlots = await this.getQuery<
        Array<{
          date: string
          count: string
        }>
      >(
        `
        SELECT TO_CHAR(start_at, '${dateFormat}') AS date, 
        COUNT(*) AS count
        FROM time_slots ts
        WHERE ts.start_at BETWEEN $1 AND $2
            AND ($3::uuid IS NULL OR ts.clinic_id = $3)
            AND ($4::uuid IS NULL OR ts.doctor_id = $4)
            AND ($5::varchar IS NULL OR ts.time_period = $5)
        GROUP BY TO_CHAR(ts.start_at, '${dateFormat}')
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

      const totalTimeSlots = rawTimeSlots.reduce(
        (acc, curr) => acc + parseInt(curr.count, 10),
        0
      )

      const data = rawTimeSlots.map((timeSlot) => ({
        date: timeSlot.date,
        timeSlotCount: parseInt(timeSlot.count, 10),
      }))

      return {
        totalTimeSlots,
        data,
      }
    } catch (e) {
      throw new RepositoryError(
        'TimeSlotRepository getDurationCountByGranularity error',
        e as Error
      )
    }
  }

  public async findMatchingTimeSlot(
    doctorId: string,
    checkInAt: Date
  ): Promise<{ timeSlotId: string }> {
    try {
      const result = await this.getQuery<Array<{ time_slot_id: string }>>(
        `
          SELECT id AS time_slot_id
          FROM time_slots
          WHERE doctor_id = $1
            AND DATE(start_at) = DATE($2)
            AND TIME($2) BETWEEN TIME(start_at) AND TIME(end_at)
          LIMIT 1;
        `,
        [doctorId, checkInAt]
      )

      if (result.length === 0) {
        throw new RepositoryError(
          'No matching time slot found for the given doctor and check-in time.'
        )
      }

      return { timeSlotId: result[0].time_slot_id }
    } catch (e) {
      throw new RepositoryError(
        'TimeSlotRepository findMatchingTimeSlot error',
        e as Error
      )
    }
  }

  public async findCurrentTimeSlotForDoctor(
    doctorId: string,
    currentTime: Date
  ): Promise<{
    timeSlotId: string
    clinicId: string
    consultationRoomNumber: string
    timePeriod: TimePeriodType
  } | null> {
    const utc8Time = currentTime
    try {
      const result = await this.getQuery<
        Array<{
          id: string
          clinic_id: string
          consultation_room_number: string
          time_period: TimePeriodType
        }>
      >(
        `
        SELECT ts.id, ts.clinic_id, cr.room_number AS consultation_room_number, ts.time_period
        FROM time_slots ts
        LEFT JOIN consultation_rooms cr ON ts.consultation_room_id = cr.id
        WHERE ts.doctor_id = $1
          AND ts.start_at <= $2
          AND ts.end_at + interval '1 hour' >= $2
        LIMIT 1
        `,
        [doctorId, utc8Time]
      )

      if (result.length === 0) {
        return null
      }

      return {
        timeSlotId: result[0].id,
        clinicId: result[0].clinic_id,
        consultationRoomNumber: result[0].consultation_room_number,
        timePeriod: result[0].time_period,
      }
    } catch (e) {
      throw new RepositoryError(
        'TimeSlotRepository findCurrentTimeSlotForDoctor error',
        e as Error
      )
    }
  }

  public async findMatchingTimeSlotForAdmin(
    currentTime: Date,
    clinicId?: string,
    consultationRoomNumber?: RoomNumberType,
    doctorId?: string
  ): Promise<
    Array<{
      id: string
      clinicId: string
      consultationRoomNumber: RoomNumberType
      timePeriod: TimePeriodType
    }>
  > {
    try {
      let query = `
        SELECT ts.id, ts.clinic_id, cr.room_number AS consultation_room_number, ts.time_period
        FROM time_slots ts
        LEFT JOIN consultation_rooms cr ON ts.consultation_room_id = cr.id
        WHERE ts.start_at <= $1
          AND ts.end_at + interval '1 hour' >= $1
      `

      const queryParams: any[] = [currentTime]
      let paramIndex = 2

      if (clinicId !== undefined) {
        query += ` AND ts.clinic_id = $${paramIndex}`
        queryParams.push(clinicId)
        paramIndex++
      }

      if (consultationRoomNumber !== undefined) {
        query += ` AND cr.room_number = $${paramIndex}`
        queryParams.push(consultationRoomNumber)
        paramIndex++
      }

      if (doctorId !== undefined) {
        query += ` AND ts.doctor_id = $${paramIndex}`
        queryParams.push(doctorId)
      }

      const result = await this.getQuery<
        Array<{
          id: string
          clinic_id: string
          consultation_room_number: RoomNumberType
          time_period: TimePeriodType
        }>
      >(query, queryParams)

      return result.map((row) => ({
        id: row.id,
        clinicId: row.clinic_id,
        consultationRoomNumber: row.consultation_room_number,
        timePeriod: row.time_period,
      }))
    } catch (e) {
      throw new RepositoryError(
        'TimeSlotRepository findMatchingTimeSlotForAdmin error',
        e as Error
      )
    }
  }

  public async getById(id: string): Promise<TimeSlot | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError('TimeSlotRepository findById error', e as Error)
    }
  }
}
