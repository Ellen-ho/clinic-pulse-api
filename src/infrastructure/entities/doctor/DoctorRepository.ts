import { BaseRepository } from '../../../infrastructure/database/BaseRepository'
import { DoctorEntity } from './DoctorEntity'
import { DataSource } from 'typeorm'
import { DoctorMapper } from './DoctorMapper'
import { Doctor } from '../../../domain/doctor/Doctor'
import { RepositoryError } from '../../../infrastructure/error/RepositoryError'
import { IDoctorRepository } from '../../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../../domain/common'
import { UserRoleType } from '../../../domain/user/User'

export class DoctorRepository
  extends BaseRepository<DoctorEntity, Doctor>
  implements IDoctorRepository
{
  constructor(dataSource: DataSource) {
    super(DoctorEntity, new DoctorMapper(), dataSource)
  }

  public async findByUserId(userId: string): Promise<Doctor | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'DoctorRepository findByUserId error',
        e as Error
      )
    }
  }

  public async findByAll(): Promise<Array<{ id: string; fullName: string }>> {
    try {
      const result = await this.getQuery<
        Array<{ id: string; full_name: string }>
      >(
        `SELECT
                id,
                CONCAT(last_name, first_name) AS full_name
            FROM
                doctors`
      )
      return result.map((doc) => ({
        id: doc.id,
        fullName: doc.full_name,
      }))
    } catch (e) {
      throw new RepositoryError('DoctorRepository findByAll error', e as Error)
    }
  }

  public async findById(doctorId: string): Promise<Doctor | null> {
    try {
      const result = await this.getQuery<
        Array<{
          id: string
          first_name: string
          last_name: string
          avatar: string | null
          gender: GenderType
          birth_date: Date
          onboard_date: Date
          resignation_date: Date | null
          email: string
          hashedPassword: string
          createdAt: Date
          updatedAt: Date
          user_id: string
          role: UserRoleType
        }>
      >(
        `SELECT d.id, 
              d.first_name,
              d.last_name, 
              d.avatar, 
              d.gender, 
              d.birth_date, 
              d.onboard_date, 
              d.resignation_date,
              u.id AS user_id,
              u.email, 
              u.password AS hashedPassword, 
              u.created_at AS createdAt, 
              u.updated_at AS updatedAt,
              u.role
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = $1`,
        [doctorId]
      )

      if (result.length === 0) {
        return null
      }
      const entity = result[0]

      return this.getMapper().toDomainModel({
        id: entity.id,
        firstName: entity.first_name,
        lastName: entity.last_name,
        avatar: entity.avatar,
        gender: entity.gender,
        birthDate: new Date(entity.birth_date),
        onboardDate: new Date(entity.onboard_date),
        resignationDate:
          entity.resignation_date !== null
            ? new Date(entity.resignation_date)
            : null,
        user: {
          id: entity.user_id,
          email: entity.email,
          password: entity.hashedPassword,
          role: entity.role,
          createdAt: new Date(entity.createdAt),
          updatedAt: new Date(entity.updatedAt),
        },
      })
    } catch (e) {
      throw new RepositoryError('DoctorRepository findById error', e as Error)
    }
  }
}
