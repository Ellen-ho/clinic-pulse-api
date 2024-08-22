import { BaseRepository } from '../../../infrastructure/database/BaseRepository'
import { UserEntity } from './UserEntity'
import { DataSource } from 'typeorm'
import { User, UserRoleType } from '../../../domain/user/User'
import { UserMapper } from './UserMapper'
import { RepositoryError } from '../../../infrastructure/error/RepositoryError'
import { IUserRepository } from '../../../domain/user/interfaces/repositories/IUserRepository'

export class UserRepository
  extends BaseRepository<UserEntity, User>
  implements IUserRepository
{
  constructor(dataSource: DataSource) {
    super(UserEntity, new UserMapper(), dataSource)
  }

  public async findById(id: string): Promise<User | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError('UserRepository findById error', e as Error)
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { email },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError('UserRepository findByEmail error', e as Error)
    }
  }

  public async findAdmin(): Promise<User | null> {
    try {
      const query = `
        SELECT * 
        FROM users 
        WHERE role = $1
        LIMIT 1
      `
      const result = await this.getQuery<UserEntity[]>(query, [
        UserRoleType.ADMIN,
      ])

      if (result.length > 0) {
        const userEntity = result[0]
        const userDomainModel = this.getMapper().toDomainModel(userEntity)
        return userDomainModel
      } else {
        return null
      }
    } catch (e) {
      throw new RepositoryError('UserRepository findAdmin error', e as Error)
    }
  }
}
