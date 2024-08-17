import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { UserEntity } from '../src/infrastructure/entities/user/UserEntity'
import { DoctorEntity } from '../src/infrastructure/entities/doctor/DoctorEntity'
import { ClinicEntity } from '../src/infrastructure/entities/clinic/ClinicEntity'
import { ConsultationRoomEntity } from '../src/infrastructure/entities/consultationRoom/ConsultationRoomEntity'
import { BcryptHashGenerator } from '../src/infrastructure/utils/BcryptHashGenerator'
import dotenv from 'dotenv'
import { DOCTORS } from './constant/users'
import { CLINICS, ROOMS } from './constant/clinics'
import { UserRoleType } from '../src/domain/user/User'

dotenv.config()

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const userRepository = dataSource.getRepository(UserEntity)
    const doctorRepository = dataSource.getRepository(DoctorEntity)
    const clinicRepository = dataSource.getRepository(ClinicEntity)
    const consultationRoomRepository = dataSource.getRepository(
      ConsultationRoomEntity
    )

    const hashGenerator = new BcryptHashGenerator()
    const hashedPassword = await hashGenerator.hash('123456')

    // Add Admin
    await userRepository.save({
      id: 'b4c8cfe8-9c1b-4336-9be4-8c3b6e960a6c',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRoleType.ADMIN,
    })

    for (const doctor of DOCTORS) {
      try {
        await userRepository.save({
          id: doctor.id,
          email: doctor.email,
          password: hashedPassword,
          role: doctor.role,
        })

        await doctorRepository.save({
          id: doctor.doctorId,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(
            Math.random() * 70
          )}`,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          gender: doctor.gender,
          birthDate: doctor.birthDate,
          onboardDate: doctor.onboardDate,
          user: { id: doctor.id },
        })
        console.log(`Inserted doctor with ID: ${doctor.id}`)
      } catch (error) {
        console.error('Error inserting doctor:', error)
      }
    }

    for (const clinic of CLINICS) {
      try {
        await clinicRepository.save({
          id: clinic.id,
          name: clinic.name,
          address: clinic.address,
        })

        console.log(`Inserted clinic with ID: ${clinic.id}`)
      } catch (error) {
        console.error('Error inserting clinic:', error)
      }
    }

    for (const room of ROOMS) {
      try {
        await consultationRoomRepository.save({
          id: room.id,
          clinicId: room.clinicId,
          roomNumber: room.roomNumber,
        })

        console.log(`Inserted room with ID: ${room.id}`)
      } catch (error) {
        console.error('Error inserting room:', error)
      }
    }
  }
}
