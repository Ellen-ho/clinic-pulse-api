import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'
import { ConsultationEntity } from '../consultation/ConsultationEntity'
import { SelectedContent } from '../../../domain/feedback/Feedback'

@Entity('feedbacks')
export class FeedbackEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({
    name: 'feedback_rating',
    type: 'int',
  })
  public feedbackRating!: number

  @Column({
    name: 'selected_content',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public selectedContent!: SelectedContent | null

  @Column({ name: 'detailed_content', type: 'text', nullable: true })
  public detailedContent!: string | null

  @Column({ name: 'received_at', type: 'timestamp' })
  public receivedAt!: Date

  @OneToOne(() => ConsultationEntity, { nullable: false })
  @JoinColumn({ name: 'consultation_id' })
  public consultation!: ConsultationEntity

  @Column({ name: 'consultation_id' })
  @RelationId((feedback: FeedbackEntity) => feedback.consultation)
  public consultationId!: string
}
