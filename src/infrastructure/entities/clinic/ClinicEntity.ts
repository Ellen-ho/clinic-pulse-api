import { IAddress } from '../../../domain/clinic/Clinic'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('clinics')
export class ClinicEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'name', type: 'varchar', length: 50 })
  public name!: string

  @Column({ name: 'address', type: 'jsonb' })
  public address!: IAddress
}
