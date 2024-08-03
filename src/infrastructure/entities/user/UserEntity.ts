import { UserRoleType } from '../../../domain/user/User'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'email', unique: true, type: 'varchar', length: 100 })
  public email!: string

  @Column({ name: 'password', type: 'varchar', length: 255 })
  public password!: string

  @Column({ name: 'role', type: 'varchar', length: 50 })
  public role!: UserRoleType

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}
