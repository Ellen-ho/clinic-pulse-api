import { Review } from 'domain/review/Review'
import { IBaseRepository } from '../../../shared/IBaseRepository'

export interface IReviewRepository extends IBaseRepository<Review> {
  findLatestReview: () => Promise<Review | null>
  findByQuery: (
    limit: number,
    offset: number,
    startDate: string,
    endDate: string,
    clinicId?: string,
    patientName?: string,
    reviewRating?: number
  ) => Promise<{
    data: Array<{
      id: string
      link: string
      receivedDate: string
      receivedDateOfLastEdit: string | null
      reviewRating: number
      clinicId: string
      clinicName: string
      reviewer: {
        name: string
      }
      response: {
        responseDate: string | null
        responseDateOfLastEdit: string | null
      }
    }>
    totalCounts: number
  }>
  findById: (id: string) => Promise<{
    id: string
    link: string
    reviewRating: number
    receivedDate: string
    receivedAt: Date
    reviewDateOfLastEdit: Date | null
    reviewerName: string
    snippet: string | null
    extractedSnippet: string | null
    likes: number | null
    responseDate: string | null
    responseAt: Date | null
    responseDateOfLastEdit: Date | null
    responseSnippet: string | null
    responseExtractedSnippet: string | null
    clinicId: string
  } | null>
}
