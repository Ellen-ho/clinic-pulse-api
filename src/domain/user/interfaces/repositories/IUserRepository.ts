import { IBaseRepository } from '../../../../domain/shared/IBaseRepository'
import { User } from '../../User'

export interface IUserRepository extends IBaseRepository<User> {
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  findAdmin: () => Promise<User | null>
  save: (user: User) => Promise<void>
}
