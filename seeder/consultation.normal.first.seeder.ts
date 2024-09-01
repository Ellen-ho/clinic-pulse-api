import { DataSource, Repository } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { random } from 'lodash'
import {
  ConsultationSource,
  ConsultationStatus,
} from '../src/domain/consultation/Consultation'
import { ConsultationEntity } from '../src/infrastructure/entities/consultation/ConsultationEntity'
import { PatientEntity } from '../src/infrastructure/entities/patient/PatientEntity'
import { TimeSlotEntity } from '../src/infrastructure/entities/timeSlot/TimeSlotEntity'
import { AcupunctureTreatmentEntity } from '../src/infrastructure/entities/treatment/AcupunctureTreatmentEntity'
import { MedicineTreatmentEntity } from '../src/infrastructure/entities/treatment/MedicineTreatmentEntity'
import { generateRandomChineseName, getRandomBirthDate } from './utils'
import dayjs from 'dayjs'
import { TARGET_MONTH } from './constant/setting'
import dotenv from 'dotenv'

dotenv.config()

export default class ConsultationNormalFirstSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const consultationRepository = dataSource.getRepository(ConsultationEntity)
    const timeSlotRepository = dataSource.getRepository(TimeSlotEntity)
    const patientRepository = dataSource.getRepository(PatientEntity)
    const acupunctureTreatmentRepository = dataSource.getRepository(
      AcupunctureTreatmentEntity
    )
    const medicineTreatmentRepository = dataSource.getRepository(
      MedicineTreatmentEntity
    )
    /**
     * SETTING
     */
    const months = TARGET_MONTH
    const range = [10, 20]

    for (const month of months) {
      const startOfMonth = `${month}-01T00:00:00.000Z`
      const endOfMonth = dayjs(startOfMonth).add(1, 'month').toISOString()

      const timeSlots = await timeSlotRepository
        .createQueryBuilder('timeSlot')
        .where('timeSlot.startAt >= :start', { start: startOfMonth })
        .andWhere('timeSlot.startAt < :end', { end: endOfMonth })
        .getMany()

      if (!timeSlots.length) {
        console.error(`No time slots found for the month: ${month}.`)
        continue
      }

      for (const timeSlot of timeSlots) {
        const numRecords = random(range[0], range[1])
        for (let i = 0; i < numRecords; i++) {
          await this.createConsultation(
            consultationRepository,
            patientRepository,
            acupunctureTreatmentRepository,
            medicineTreatmentRepository,
            timeSlot
          )
        }
      }
    }
  }

  private async createConsultation(
    consultationRepository: Repository<ConsultationEntity>,
    patientRepository: Repository<PatientEntity>,
    acupunctureTreatmentRepository: Repository<AcupunctureTreatmentEntity>,
    medicineTreatmentRepository: Repository<MedicineTreatmentEntity>,
    timeSlot: TimeSlotEntity
  ) {
    const { firstName, lastName, fullName, gender } =
      generateRandomChineseName()
    const patient = await patientRepository.save({
      firstName,
      lastName,
      fullName,
      gender,
      birthDate: getRandomBirthDate(),
    })

    const treatmentType =
      Math.random() > 0.5 ? 'ACUPUNCTURE_TREATMENT' : 'MEDICINE_TREATMENT'
    const consultationSource =
      Math.random() > 0.5
        ? ConsultationSource.ONLINE_BOOKING
        : ConsultationSource.ONSITE_REGISTRATION

    const timeSlotStart = dayjs(timeSlot.startAt).add(8, 'hour')
    let currentTime = timeSlotStart

    const checkInAt = currentTime.add(random(0, 120), 'minute')
    const startAt = checkInAt.add(random(5, 20), 'minute')
    const endAt = startAt.add(random(5, 20), 'minute')
    let checkOutAt

    let acupunctureTreatment: AcupunctureTreatmentEntity | null = null
    let medicineTreatment: MedicineTreatmentEntity | null = null

    if (treatmentType === 'ACUPUNCTURE_TREATMENT') {
      const assignBedAt = endAt.add(random(5, 20), 'minute')

      const acupunctureStartAt = assignBedAt.add(random(5, 20), 'minute')
      const acupunctureEndAt = acupunctureStartAt.add(15, 'minute')
      const removeNeedleAt = acupunctureEndAt.add(random(5, 20), 'minute')
      checkOutAt = removeNeedleAt.add(random(5, 20), 'minute')

      acupunctureTreatment = await acupunctureTreatmentRepository.save({
        startAt: acupunctureStartAt,
        endAt: acupunctureEndAt,
        bedId: `bed-0${random(1, 6)}`,
        assignBedAt: assignBedAt,
        removeNeedleAt: removeNeedleAt,
        needleCounts: random(4, 20),
      })
    } else {
      const getMedicineAt = endAt.add(random(5, 20), 'minute')
      checkOutAt = getMedicineAt

      medicineTreatment = await medicineTreatmentRepository.save({
        getMedicineAt: getMedicineAt,
      })
    }

    await consultationRepository.save({
      status: ConsultationStatus.CHECK_OUT,
      source: consultationSource,
      consultationNumber: random(100, 999),
      checkInAt: checkInAt,
      startAt: startAt,
      endAt: endAt,
      checkOutAt: checkOutAt,
      patient: patient,
      timeSlot: timeSlot,
      isFirstTimeVisit: true,
      acupunctureTreatment: acupunctureTreatment,
      medicineTreatment: medicineTreatment,
    })

    console.log(`Inserted consultation for patient ${fullName}`)
  }
}
