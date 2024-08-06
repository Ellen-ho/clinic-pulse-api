import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  RelationId,
  ManyToOne,
} from 'typeorm'
import {
  ConsultationSource,
  ConsultationStatus,
  OnsiteCancelReasonType,
} from '../../../domain/consultation/Consultation'

import { TimeSlotEntity } from '../timeSlot/TimeSlotEntity'

import { PatientEntity } from '../patient/PatientEntity'
import { AcupunctureTreatmentEntity } from '../treatement/AcupunctureTreatementEntity'
import { MedicineTreatmentEntity } from '../treatement/MedicineTreatmentEntity'

@Entity('consultations')
export class ConsultationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({
    name: 'status',
    type: 'varchar',
    length: 255,
    default: ConsultationStatus.WAITING_FOR_CONSULTATION,
  })
  public status!: ConsultationStatus

  @Column({
    name: 'source',
    type: 'varchar',
    length: 50,
  })
  public source!: ConsultationSource

  @Column({ name: 'consultation_number', type: 'int' })
  public consultationNumber!: number

  @Column({ name: 'check_in_at', type: 'timestamp' })
  public checkInAt!: Date

  @Column({ name: 'start_at', type: 'timestamp', nullable: true })
  public startAt!: Date | null

  @Column({ name: 'end_at', type: 'timestamp', nullable: true })
  public endAt!: Date | null

  @Column({ name: 'check_out_at', type: 'timestamp', nullable: true })
  public checkOutAt!: Date | null

  @Column({ name: 'onsite_cancle_at', type: 'timestamp', nullable: true })
  public onsiteCancelAt!: Date | null

  @Column({
    name: 'onsite_cancle_reason',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public onsiteCancelReason!: OnsiteCancelReasonType | null

  @Column({ name: 'is_first_time_visit', type: 'boolean', default: false })
  public isFirstTimeVisit!: boolean

  @OneToOne(() => AcupunctureTreatmentEntity, { nullable: true })
  @JoinColumn({ name: 'acupuncture_treatment_id' })
  public acupunctureTreatment!: AcupunctureTreatmentEntity | null

  @OneToOne(() => MedicineTreatmentEntity, { nullable: true })
  @JoinColumn({ name: 'medicine_treatment_id' })
  public medicineTreatment!: MedicineTreatmentEntity | null

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  public patient!: PatientEntity

  @Column({ name: 'patient_id' })
  @RelationId((consultation: ConsultationEntity) => consultation.patient)
  public patientId!: string

  @ManyToOne(() => TimeSlotEntity)
  @JoinColumn({ name: 'time_slot_id' })
  timeSlot!: TimeSlotEntity

  @Column({ name: 'time_slot_id' })
  @RelationId((consultation: ConsultationEntity) => consultation.timeSlot)
  public timeSlotId!: string
}
