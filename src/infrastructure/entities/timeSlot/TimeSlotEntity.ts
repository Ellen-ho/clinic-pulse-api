import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'
import { DoctorEntity } from '../doctor/DoctorEntity'
import { ClinicEntity } from '../clinic/ClinicEntity'
import { TimePeriodType } from '../../../domain/timeSlot/TimeSlot'
import { ConsultationRoomEntity } from '../consultationRoom/ConsultationRoomEntity'

@Index('IDX_DOCTOR_ID', ['doctorId'])
@Index('IDX_CLINIC_CONSULTATION_ROOM', ['clinicId', 'consultationRoomId'])
@Entity('time_slots')
export class TimeSlotEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'start_at', type: 'timestamp' })
  public startAt!: Date

  @Column({ name: 'end_at', type: 'timestamp' })
  public endAt!: Date

  @Column({ name: 'time_period', type: 'varchar', length: 50 })
  public timePeriod!: TimePeriodType

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  public doctor!: DoctorEntity

  @Column({ name: 'doctor_id' })
  @RelationId((timeSlot: TimeSlotEntity) => timeSlot.doctor)
  public doctorId!: string

  @ManyToOne(() => ClinicEntity)
  @JoinColumn({ name: 'clinic_id' })
  public clinic!: ClinicEntity

  @Column({ name: 'clinic_id' })
  @RelationId((timeSlot: TimeSlotEntity) => timeSlot.clinic)
  public clinicId!: string

  @ManyToOne(() => ConsultationRoomEntity)
  @JoinColumn({ name: 'consultation_room_id' })
  public consultationRoom!: ConsultationRoomEntity

  @Column({ name: 'consultation_room_id' })
  @RelationId((timeSlot: TimeSlotEntity) => timeSlot.consultationRoom)
  public consultationRoomId!: string
}
