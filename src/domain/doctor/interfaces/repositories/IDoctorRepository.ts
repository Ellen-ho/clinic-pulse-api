import { Doctor } from '../../../../domain/doctor/Doctor'
import { IBaseRepository } from '../../../../domain/shared/IBaseRepository'

export interface IDoctorRepository extends IBaseRepository<Doctor> {
  findByUserId: (userId: string) => Promise<Doctor | null>
  findByAll: () => Promise<Array<{ id: string; fullName: string }>>
  findById: (doctorId: string) => Promise<Doctor | null>
  save: (doctor: Doctor) => Promise<void>
}
