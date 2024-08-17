import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('medicine_treatments')
export class MedicineTreatmentEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'get_medicine_at', type: 'timestamp', nullable: true })
  public getMedicineAt!: Date | null
}
