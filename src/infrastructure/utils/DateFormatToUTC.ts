import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function formatToUTC8(date: Date): Date {
  const utc8Date = dayjs(date).tz('Asia/Taipei').startOf('second').toDate()
  console.table({
    date: date.toDateString(),
    utc8Date: utc8Date.toDateString(),
  })
  return utc8Date
}
