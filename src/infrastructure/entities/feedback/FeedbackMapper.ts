import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { FeedbackEntity } from './FeedbackEntity'
import { Feedback } from '../../../domain/feedback/Feedback'

export class FeedbackMapper implements IEntityMapper<FeedbackEntity, Feedback> {
  public toDomainModel(entity: FeedbackEntity): Feedback {
    const feedback = new Feedback({
      id: entity.id,
      feedbackRating: entity.feedbackRating,
      selectedContent: entity.selectedContent,
      detailedContent: entity.detailedContent,
      receivedAt: entity.receivedAt,
      consultationId: entity.consultationId,
    })
    return feedback
  }

  public toPersistence(domainModel: Feedback): FeedbackEntity {
    const feedbackEntity = new FeedbackEntity()
    feedbackEntity.id = domainModel.id
    feedbackEntity.feedbackRating = domainModel.feedbackRating
    feedbackEntity.selectedContent = domainModel.selectedContent
    feedbackEntity.detailedContent = domainModel.detailedContent
    feedbackEntity.receivedAt = domainModel.receivedAt
    feedbackEntity.consultationId = domainModel.consultationId

    return feedbackEntity
  }
}
