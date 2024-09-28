import { faker } from '@faker-js/faker'
import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { ConsultationRepository } from '../../../infrastructure/entities/consultation/ConsultationRepository'
import {
  ConsultationStatus,
  ConsultationSource,
} from '../../../domain/consultation/Consultation'
import { CreateConsultationUseCase } from '../CreateConsultationUseCase'
import { IUuidService } from '../../../domain/utils/IUuidService'
import {
  CONSULTATION_JOB_NAME,
  IConsultationQueueService,
} from '../../../application/queue/ConsultationQueueService'
import { TimeSlotRepository } from '../../../infrastructure/entities/timeSlot/TimeSlotRepository'
import { PatientRepository } from '../../../infrastructure/entities/patient/PatientRepository'
import { GenderType } from '../../../domain/common'
import { Patient } from '../../../domain/patient/Patient'
import { TimePeriodType, TimeSlot } from '../../../domain/timeSlot/TimeSlot'
import { Doctor } from '../../../domain/doctor/Doctor'
import { Clinic } from '../../../domain/clinic/Clinic'
import {
  ConsultationRoom,
  RoomNumberType,
} from '../../../domain/consultationRoom/ConsultationRoom'
import { DoctorRepository } from '../../../infrastructure/entities/doctor/DoctorRepository'
import { ClinicRepository } from '../../../infrastructure/entities/clinic/ClinicRepository'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { UserRoleType } from '../../../domain/user/User'
import { ConsultationRoomRepository } from '../../../infrastructure/entities/consultationRoom/consultationRoomRepository'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

describe('Integration test: CreateConsultationUseCase', () => {
  let database: PostgresDatabase
  let consultationRepo: ConsultationRepository
  let patientRepo: PatientRepository
  let timeSlotRepo: TimeSlotRepository
  let doctorRepo: DoctorRepository
  let clinicRepo: ClinicRepository
  let consultationRoomRepo: ConsultationRoomRepository
  let userRepo: UserRepository
  let uuidService: IUuidService
  let consultationQueueService: IConsultationQueueService
  let useCase: CreateConsultationUseCase
  const mockUuidService = mock<IUuidService>()

  beforeAll(async () => {
    database = await PostgresDatabase.getInstance()
    patientRepo = new PatientRepository(database.getDataSource())
    consultationRepo = new ConsultationRepository(database.getDataSource())
    timeSlotRepo = new TimeSlotRepository(database.getDataSource())
    doctorRepo = new DoctorRepository(database.getDataSource())
    clinicRepo = new ClinicRepository(database.getDataSource())
    consultationRoomRepo = new ConsultationRoomRepository(
      database.getDataSource()
    )
    userRepo = new UserRepository(database.getDataSource())

    consultationQueueService = {
      addConsultationJob: jest.fn(),
    } as unknown as IConsultationQueueService

    useCase = new CreateConsultationUseCase(
      consultationRepo,
      mockUuidService,
      consultationQueueService
    )
  }, 300000)

  afterEach(async () => {
    await consultationRepo.clear()
    await timeSlotRepo.clear()

    await doctorRepo.clear()
    await userRepo.clear()
    mockUuidService.generateUuid.mockReset()
    MockDate.reset()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  it('should create a consultation successfully', async () => {
    const patientId = faker.string.uuid()
    const timeSlotId = faker.string.uuid()
    const doctorId = faker.string.uuid()
    const clinicId = faker.string.uuid()
    const consultationRoomId = faker.string.uuid()
    const userId = faker.string.uuid()

    const user = UserFactory.build({
      id: userId,
      email: faker.internet.email(),
      role: UserRoleType.DOCTOR,
      createdAt: new Date('2023-07-01T05:48:55.694Z'),
      updatedAt: new Date('2023-07-01T05:48:55.694Z'),
    })

    await userRepo.save(user)

    const doctor = new Doctor({
      id: doctorId,
      firstName: 'Jane',
      lastName: 'Smith',
      gender: GenderType.FEMALE,
      birthDate: new Date('1980-01-01'),
      onboardDate: new Date('2022-01-01'),
      resignationDate: null,
      avatar: null,
      user,
    })

    await doctorRepo.save(doctor)

    const clinic = new Clinic({
      id: clinicId,
      name: 'Test Clinic',
      address: {
        line1: '123 Main St',
        line2: 'Suite 101',
        city: 'Test City',
        stateProvince: 'Test State',
        postalCode: '12345',
        country: 'Test Country',
        countryCode: 'TC',
      },
    })

    await clinicRepo.save(clinic)

    const consultationRoom = new ConsultationRoom({
      id: consultationRoomId,
      roomNumber: RoomNumberType.ROOM_ONE,
      clinicId,
    })

    await consultationRoomRepo.save(consultationRoom)

    const patient = new Patient({
      id: patientId,
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      gender: GenderType.MALE,
      birthDate: new Date('1990-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await patientRepo.save(patient)

    const timeSlot = new TimeSlot({
      id: timeSlotId,
      startAt: new Date(),
      endAt: new Date(new Date().getTime() + 60 * 60 * 1000),
      timePeriod: TimePeriodType.MORNING_SESSION,
      doctorId,
      clinicId,
      consultationRoomId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await timeSlotRepo.save(timeSlot)

    jest.spyOn(consultationRepo, 'isFirstTimeVisit').mockResolvedValueOnce(true)
    jest
      .spyOn(consultationRepo, 'getLatestOddConsultationNumber')
      .mockResolvedValueOnce(1)

    const request = {
      patientId,
      timeSlotId,
    }

    mockUuidService.generateUuid.mockReturnValue(faker.string.uuid())

    const result = await useCase.execute(request)

    expect(result).toMatchObject({
      id: expect.any(String),
    })

    const savedConsultation = await consultationRepo.getById(result.id)
    expect(savedConsultation).toBeDefined()
    expect(savedConsultation?.status).toBe(
      ConsultationStatus.WAITING_FOR_CONSULTATION
    )
    expect(savedConsultation?.source).toBe(
      ConsultationSource.ONSITE_REGISTRATION
    )
    expect(savedConsultation?.consultationNumber).toBe(3)
    expect(savedConsultation?.isFirstTimeVisit).toBe(true)
    expect(consultationQueueService.addConsultationJob).toHaveBeenCalledWith(
      CONSULTATION_JOB_NAME.CHECK_CONSULTATION_WAITING_TIME,
      { consultationId: result.id },
      { delay: 3600 * 1000 }
    )
  })

  it('should throw an error if consultation cannot be created', async () => {
    const patientId = faker.string.uuid()
    const timeSlotId = faker.string.uuid()

    jest
      .spyOn(consultationRepo, 'isFirstTimeVisit')
      .mockRejectedValueOnce(new Error('Database error'))

    const useCase = new CreateConsultationUseCase(
      consultationRepo,
      uuidService,
      consultationQueueService
    )

    const request = {
      patientId,
      timeSlotId,
    }

    await expect(useCase.execute(request)).rejects.toThrow('Database error')
  })
})
