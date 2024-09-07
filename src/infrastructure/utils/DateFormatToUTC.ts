import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dotenv from 'dotenv'

dotenv.config()
const env = process.env
const isDev = env.NODE_ENV === 'development'

dayjs.extend(utc)
dayjs.extend(timezone)

export function formatToUTC8(date: Date): Date {
  const utc8Date = dayjs(date).tz('Asia/Taipei').startOf('second').toDate()
  return utc8Date
}

export function convertToUTC8(date: Date): Date {
  return dayjs(date).add(8, 'hour').toDate()
}

export function getCurrentTime(): Date {
  return isDev ? dayjs().toDate() : dayjs().add(8, 'hour').toDate()
}
