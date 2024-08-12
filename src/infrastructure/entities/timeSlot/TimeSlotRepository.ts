import { BaseRepository } from 'infrastructure/database/BaseRepository'
import { TimeSlotEntity } from './TimeSlotEntity'
import { TimePeriodType, TimeSlot } from 'domain/timeSlot/TimeSlot'
import { DataSource } from 'typeorm'
import { TimeSlotMapper } from './TimeSlotMapper'
import { Granularity } from 'domain/common'
import { getDateFormat } from 'infrastructure/utils/SqlDateFormat'
import { ITimeSlotRepository } from 'domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { RepositoryError } from 'infrastructure/error/RepositoryError'
import dayjs from 'dayjs'

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
}
