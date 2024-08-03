import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('acupuncture_treatments')
export class AcupunctureTreatmentEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'start_at', type: 'timestamp', nullable: true })
  public startAt!: Date | null

  @Column({ name: 'end_at', type: 'timestamp', nullable: true })
  public endAt!: Date | null

  @Column({ name: 'bed_id', type: 'varchar', unique: true, nullable: true })
  public bedId!: string | null

  @Column({ name: 'assign_bed_at', type: 'timestamp', nullable: true })
  public assignBedAt!: Date | null

  @Column({
    name: 'remove_needle_at',
    type: 'timestamp',
    nullable: true,
  })
  public removeNeedleAt!: Date | null

  @Column({ name: 'needle_counts', type: 'int', nullable: true })
  public needleCounts!: number | null
}
