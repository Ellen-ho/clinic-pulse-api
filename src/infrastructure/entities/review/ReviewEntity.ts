import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'
import { ClinicEntity } from '../clinic/ClinicEntity'

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({
    name: 'link',
    type: 'varchar',
    length: 255,
  })
  public link!: string

  @Column({
    name: 'rating',
    type: 'int',
  })
  public rating!: number

  @Column({ name: 'date', type: 'varchar', length: 30 })
  public date!: string

  @Column({ name: 'iso_date', type: 'timestamp' })
  public isoDate!: Date

  @Column({
    name: 'iso_date_of_last_edit',
    type: 'timestamp',
    nullable: true,
  })
  public isoDateOfLastEdit!: Date | null

  @Column({
    name: 'reviewer_name',
    type: 'varchar',
    length: 255,
  })
  public reviewerName!: string

  @Column({
    name: 'reviewer_link',
    type: 'varchar',
    length: 255,
  })
  public reviewerLink!: string

  @Column({
    name: 'reviewer_local_guide',
    type: 'boolean',
  })
  public reviewerLocalGuide!: boolean

  @Column({ name: 'snippet', type: 'text', nullable: true })
  public snippet!: string | null

  @Column({ name: 'extracted_snippet', type: 'text', nullable: true })
  public extractedSnippet!: string | null

  @Column({
    name: 'likes',
    type: 'int',
    nullable: true,
  })
  public likes!: number | null

  @Column({
    name: 'response_date',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public responseDate!: string | null

  @Column({
    name: 'response_iso_date',
    type: 'timestamp',
    nullable: true,
  })
  public responseIsoDate!: Date | null

  @Column({
    name: 'response_iso_date_of_last_edit',
    type: 'timestamp',
    nullable: true,
  })
  public responseIsoDateOfLastEdit!: Date | null

  @Column({
    name: 'response_snippet',
    type: 'text',
    nullable: true,
  })
  public responseSnippet!: string | null

  @Column({
    name: 'response_extracted_snippet',
    type: 'text',
    nullable: true,
  })
  public responseExtractedSnippet!: string | null

  @ManyToOne(() => ClinicEntity)
  @JoinColumn({ name: 'clinic_id' })
  clinic!: ClinicEntity

  @Column({ name: 'clinic_id' })
  @RelationId((review: ReviewEntity) => review.clinic)
  public clinicId!: string
}
