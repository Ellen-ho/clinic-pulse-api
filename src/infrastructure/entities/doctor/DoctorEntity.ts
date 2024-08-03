import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'

import { UserEntity } from '../user/UserEntity'
import { GenderType } from '../../../domain/common'

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public avatar!: string | null

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  public firstName!: string

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  public lastName!: string

  @Column({ name: 'gender', type: 'varchar', length: 20 })
  public gender!: GenderType

  @Column({ name: 'birth_date' })
  public birthDate!: Date

  @Column({ name: 'onboard_date' })
  public onboardDate!: Date

  @Column({ name: 'resignation_date', type: 'date', nullable: true })
  public resignationDate!: Date | null

  @OneToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public user!: UserEntity
}
