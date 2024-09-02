import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { ReviewEntity } from './ReviewEntity'
import { Review } from '../../../domain/review/Review'

export class ReviewMapper implements IEntityMapper<ReviewEntity, Review> {
  public toDomainModel(entity: ReviewEntity): Review {
    const review = new Review({
      id: entity.id,
      link: entity.link,
      rating: entity.rating,
      date: entity.date,
      isoDate: entity.isoDate,
      isoDateOfLastEdit: entity.isoDateOfLastEdit,
      reviewerName: entity.reviewerName,
      reviewerLink: entity.reviewerLink,
      reviewerLocalGuide: entity.reviewerLocalGuide,
      snippet: entity.snippet,
      extractedSnippet: entity.extractedSnippet,
      likes: entity.likes,
      responseDate: entity.responseDate,
      responseIsoDate: entity.responseIsoDate,
      responseIsoDateOfLastEdit: entity.responseIsoDateOfLastEdit,
      responseSnippet: entity.responseSnippet,
      responseExtractedSnippet: entity.responseExtractedSnippet,
      clinicId: entity.clinicId,
    })
    return review
  }

  public toPersistence(domainModel: Review): ReviewEntity {
    const reviewEntity = new ReviewEntity()
    reviewEntity.id = domainModel.id
    reviewEntity.link = domainModel.link
    reviewEntity.rating = domainModel.rating
    reviewEntity.date = domainModel.date
    reviewEntity.isoDate = domainModel.isoDate
    reviewEntity.isoDateOfLastEdit = domainModel.isoDateOfLastEdit
    reviewEntity.reviewerName = domainModel.reviewerName
    reviewEntity.reviewerLink = domainModel.reviewerLink
    reviewEntity.reviewerLocalGuide = domainModel.reviewerLocalGuide
    reviewEntity.snippet = domainModel.snippet
    reviewEntity.extractedSnippet = domainModel.extractedSnippet
    reviewEntity.likes = domainModel.likes
    reviewEntity.responseDate = domainModel.responseDate
    reviewEntity.responseIsoDate = domainModel.responseIsoDate
    reviewEntity.responseIsoDateOfLastEdit =
      domainModel.responseIsoDateOfLastEdit
    reviewEntity.responseSnippet = domainModel.responseSnippet
    reviewEntity.responseExtractedSnippet = domainModel.responseExtractedSnippet
    reviewEntity.clinicId = domainModel.clinicId
    return reviewEntity
  }
}
