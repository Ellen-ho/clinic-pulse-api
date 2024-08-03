import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'
import { TimeSlotEntity } from '../timeSlot/TimeSlotEntity'
import { ClinicEntity } from '../clinic/ClinicEntity'

@Entity('consultation_rooms')
export class ConsultationRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @ManyToOne(() => ClinicEntity)
  @JoinColumn({ name: 'clinic_id' })
  public clinic!: ClinicEntity

  @Column({ name: 'clinic_id' })
  @RelationId((timeSlot: TimeSlotEntity) => timeSlot.clinic)
  public clinicId!: string
}
