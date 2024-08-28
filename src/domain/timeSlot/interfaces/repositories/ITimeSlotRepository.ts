import { RoomNumberType } from 'domain/consultationRoom/ConsultationRoom'
import { Granularity } from '../../../../domain/common'
import { IBaseRepository } from '../../../../domain/shared/IBaseRepository'
import { TimePeriodType, TimeSlot } from '../../../../domain/timeSlot/TimeSlot'

export interface ITimeSlotRepository extends IBaseRepository<TimeSlot> {
  getDurationCountByGranularity: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    doctorId?: string,
    timePeriod?: TimePeriodType,
    granularity?: Granularity
  ) => Promise<{
    totalTimeSlots: number
    data: Array<{
      date: string
      timeSlotCount: number
    }>
  }>
  findMatchingTimeSlot: (
    doctorId: string,
    checkInAt: Date
  ) => Promise<{ timeSlotId: string }>
  findCurrentTimeSlotForDoctor: (
    doctorId: string,
    currentTime: Date
  ) => Promise<{
    timeSlotId: string
    clinicId: string
    consultationRoomNumber: string
    timePeriod: TimePeriodType
  } | null>
  findMatchingTimeSlotForAdmin: (
    currentTime: Date,
    clinicId?: string,
    consultationRoomNumber?: RoomNumberType,
    doctorId?: string
  ) => Promise<
    Array<{
      id: string
      clinicId: string
      consultationRoomNumber: RoomNumberType
      timePeriod: TimePeriodType
    }>
  >
  getById: (id: string) => Promise<TimeSlot | null>
}
