import { faker } from '@faker-js/faker'
import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import { UserRoleType } from '../../../domain/user/User'
import { DoctorFactory } from '../../../domain/doctor/test/DoctorFactory'
import {
  GetDoctorProfileRequest,
  GetDoctorProfileUseCase,
} from '../GetDoctorProfieUseCase'
import { DoctorRepository } from '../../../infrastructure/entities/doctor/DoctorRepository'

import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../../infrastructure/error/NotFoundError'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { GenderType } from '../../../domain/common'

describe('Integration test: GetDoctorProfieUseCase', () => {
  let database: PostgresDatabase
  let userRepo: UserRepository
  let doctorRepo: DoctorRepository

  beforeAll(async () => {
    database = await PostgresDatabase.getInstance()
    userRepo = new UserRepository(database.getDataSource())
    doctorRepo = new DoctorRepository(database.getDataSource())
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    await doctorRepo.clear()
    await userRepo.clear()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  it('should get the correct doctor profile', async () => {
    const uuid = faker.string.uuid()
    const user = UserFactory.build({
      id: faker.string.uuid(),
      email: 'test@gmail.com',
      role: UserRoleType.DOCTOR,
      createdAt: new Date('2023-07-01T05:48:55.694Z'),
      updatedAt: new Date('2023-07-01T05:48:55.694Z'),
    })
    const doctor = DoctorFactory.build({
      id: uuid,
      avatar: null,
      firstName: 'John',
      lastName: 'Doe',
      gender: GenderType.MALE,
      birthDate: new Date('1985-02-15'),
      onboardDate: new Date('2020-01-10'),
      resignationDate: null,
      user,
    })
    await userRepo.save(doctor.user)
    await doctorRepo.save(doctor)

    const useCase = new GetDoctorProfileUseCase(doctorRepo)
    const request = {
      doctorId: doctor.id,
      currentUser: doctor.user,
    }

    const result = await useCase.execute(request)

    const expected = {
      id: uuid,
      avatar: null,
      firstName: 'John',
      lastName: 'Doe',
      gender: GenderType.MALE,
      birthDate: new Date('1985-02-15'),
      onboardDate: new Date('2020-01-10'),
      resignationDate: null,
      email: 'test@gmail.com',
      createdAt: new Date('2023-07-01T05:48:55.694Z'),
      updatedAt: new Date('2023-07-01T05:48:55.694Z'),
    }

    expect(result).toMatchObject(expected)
  })

  it("should throw an error if a doctor tries to access another doctor's profile", async () => {
    const doctorId1 = faker.string.uuid() // Doctor 1 的 UUID
    const doctorId2 = faker.string.uuid() // Doctor 2 的 UUID
    const userId1 = faker.string.uuid() // User 1 的 UUID
    const userId2 = faker.string.uuid() // User 2 的 UUID

    const user1 = UserFactory.build({
      id: userId1, // 不同的 user ID
      email: 'test@gmail.com',
      role: UserRoleType.DOCTOR,
      createdAt: new Date('2023-07-01T05:48:55.694Z'),
      updatedAt: new Date('2023-07-01T05:48:55.694Z'),
    })

    const user2 = UserFactory.build({
      id: userId2,
      email: 'doctor2@gmail.com',
      role: UserRoleType.DOCTOR,
      createdAt: new Date('2023-07-01T05:48:55.694Z'),
      updatedAt: new Date('2023-07-01T05:48:55.694Z'),
    })

    const doctor1 = DoctorFactory.build({
      id: doctorId1,
      user: user1,
    })

    const doctor2 = DoctorFactory.build({
      id: doctorId2,
      user: user2,
    })

    await userRepo.save(doctor1.user)
    await doctorRepo.save(doctor1)
    await userRepo.save(doctor2.user)
    await doctorRepo.save(doctor2)

    const useCase = new GetDoctorProfileUseCase(doctorRepo)

    const request = {
      doctorId: doctor2.id,
      currentUser: doctor1.user,
    }

    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })

  it('should throw a NotFoundError if the doctor does not exist', async () => {
    const useCase = new GetDoctorProfileUseCase(doctorRepo)

    const request: GetDoctorProfileRequest = {
      doctorId: faker.string.uuid(),
      currentUser: UserFactory.build({
        id: faker.string.uuid(),
        role: UserRoleType.ADMIN,
        email: faker.internet.email(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    }

    await expect(useCase.execute(request)).rejects.toThrow(NotFoundError)
  })
})
