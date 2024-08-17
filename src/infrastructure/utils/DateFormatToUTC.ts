import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function formatToUTC8(date: Date): Date {
  const utc8Date = dayjs(date).tz('Asia/Taipei').startOf('second').toDate()
  return utc8Date
}

export function convertToUTC(date: Date): Date {
  return dayjs(date).subtract(8, 'hour').toDate()
}
