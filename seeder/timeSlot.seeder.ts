import { DataSource, Repository } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { TimeSlotEntity } from '../src/infrastructure/entities/timeSlot/TimeSlotEntity'
import { DOCTORS } from './constant/users'
import { ROOMS } from './constant/clinics'
import { TimePeriodType } from '../src/domain/timeSlot/TimeSlot'

dayjs.extend(utc)

export default class TimeSlotSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const timeSlotRepository = dataSource.getRepository(TimeSlotEntity)
    await generateTimeSlotsForMonth({
      month: '2024-01',
      timeSlotRepository,
    })
  }
}

interface GenerateTimeSlotsForMonthParams {
  month: string // 'YYYY-MM'
  timeSlotRepository: Repository<TimeSlotEntity>
}

async function generateTimeSlotsForMonth({
  month,
  timeSlotRepository,
}: GenerateTimeSlotsForMonthParams) {
  const targetMonth = dayjs.utc(`${month}-01`)
  const daysInMonth = targetMonth.daysInMonth()
  const timePeriods = [
    {
      label: TimePeriodType.MORNING_SESSION,
      startHour: 8,
      startMinute: 30,
      endHour: 12,
      endMinute: 0,
    },
    {
      label: TimePeriodType.AFTERNOON_SESSION,
      startHour: 14,
      startMinute: 30,
      endHour: 17,
      endMinute: 30,
    },
    {
      label: TimePeriodType.EVENING_SESSION,
      startHour: 18,
      startMinute: 30,
      endHour: 21,
      endMinute: 30,
    },
  ]

  const doctorsGroupedByClinic = {
    '16458ab0-4bb6-4141-9bf0-6d7398942d9b': DOCTORS.slice(0, 6),
    'bf51c88e-9587-479e-994a-d15ec484c333': DOCTORS.slice(6, 12),
    '690d0ea3-9f8d-4143-b160-0661a003bf08': DOCTORS.slice(12, 18),
  }

  const roomsGroupedByClinic = {
    '16458ab0-4bb6-4141-9bf0-6d7398942d9b': ROOMS.filter(
      (room) => room.clinicId === '16458ab0-4bb6-4141-9bf0-6d7398942d9b'
    ),
    'bf51c88e-9587-479e-994a-d15ec484c333': ROOMS.filter(
      (room) => room.clinicId === 'bf51c88e-9587-479e-994a-d15ec484c333'
    ),
    '690d0ea3-9f8d-4143-b160-0661a003bf08': ROOMS.filter(
      (room) => room.clinicId === '690d0ea3-9f8d-4143-b160-0661a003bf08'
    ),
  }

  const doctorSchedule = {
    // doctor id and the schedule day
    '8545ef60-a94d-4160-829f-f4fd7ed77551': [1, 2],
    '96bb6dee-8236-4293-b3ab-29180fb9b8bb': [3, 4],
    '3fd009a5-5129-4cca-b65b-9e10a2557461': [5, 6],
    'c977a3b5-20af-40aa-a26a-e563e44a18a8': [1, 2],
    'f13b0580-2adb-4da4-a0f4-ef3dc67f3357': [3, 4],
    'd6851101-04a1-4063-8c83-14999b9758b4': [5, 6],
    'afcccc59-0d93-4d69-93a7-883dbd334d2d': [1, 2],
    'f5d374d2-f3c1-431f-8615-b6bbdd3b5b53': [3, 4],
    '88fdc8e4-29fa-4664-91a7-bc88f3f2c997': [5, 6],
    '9659d814-71ad-4e8a-91ba-d233b340c5c8': [1, 2],
    '566be38a-4cb9-449a-b652-0b9bcee85eff': [3, 4],
    '67e4f2c6-3ce2-4c49-bc87-2dba00997ca4': [5, 6],
    'c4009084-cee5-41d1-ad18-b1664783591c': [1, 2],
    'bb37f423-542c-4d04-8168-3764770b1138': [3, 4],
    '8f99ad8f-1d4b-4937-a011-d6605eeac78a': [5, 6],
    '1b115170-4990-46d3-8691-bdf55189ca6a': [1, 2],
    '05f41d04-691f-4ed7-a2a7-16f65efb4054': [3, 4],
    '4bfdf86a-7c71-40c3-8db6-c4293c31213f': [5, 6],
  }

  for (const clinicId in doctorsGroupedByClinic) {
    const doctors = doctorsGroupedByClinic[clinicId]
    const rooms = roomsGroupedByClinic[clinicId]

    for (let i = 0; i < doctors.length; i++) {
      const doctor = doctors[i]
      const room = rooms[i % rooms.length]

      const scheduleDays = doctorSchedule[doctor.doctorId]

      for (let dayOffset = 0; dayOffset < daysInMonth; dayOffset++) {
        const currentDate = targetMonth.add(dayOffset, 'day')
        const dayOfWeek = currentDate.day()

        if (scheduleDays.includes(dayOfWeek)) {
          for (const period of timePeriods) {
            const startAt = currentDate
              .hour(period.startHour)
              .minute(period.startMinute)
              .second(0)
              .toDate()
            const endAt = currentDate
              .hour(period.endHour)
              .minute(period.endMinute)
              .second(0)
              .toDate()

            try {
              await timeSlotRepository.save({
                startAt,
                endAt,
                timePeriod: period.label,
                doctorId: doctor.doctorId,
                clinicId: clinicId,
                consultationRoomId: room.id,
              })

              console.log(
                `Inserted time slot for doctor ${
                  doctor.doctorId
                } in clinic ${clinicId} on ${currentDate.format(
                  'YYYY-MM-DD HH:mm'
                )}`
              )
            } catch (error) {
              console.error('Error inserting time slot:', error)
            }
          }
        }
      }
    }
  }
}
