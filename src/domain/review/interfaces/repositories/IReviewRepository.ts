import { Review } from '../../../../domain/review/Review'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { Granularity } from '../../../../domain/common'

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
  getStarReview: (
    startDate: string,
    endDate: string,
    clinicId?: string,
    granularity?: Granularity
  ) => Promise<{
    totalReviews: number
    oneStarReviewCount: number
    twoStarReviewCount: number
    threeStarReviewCount: number
    fourStarReviewCount: number
    fiveStarReviewCount: number
    oneStarReviewRate: number
    twoStarReviewRate: number
    threeStarReviewRate: number
    fourStarReviewRate: number
    fiveStarReviewRate: number
    data: Array<{
      date: string
      reviewCount: number
      oneStarReviewCount: number
      twoStarReviewCount: number
      threeStarReviewCount: number
      fourStarReviewCount: number
      fiveStarReviewCount: number
      oneStarReviewRate: number
      twoStarReviewRate: number
      threeStarReviewRate: number
      fourStarReviewRate: number
      fiveStarReviewRate: number
    }>
  }>
  getPreviousPeriodDates: (
    startDate: string,
    endDate: string,
    granularity?: Granularity
  ) => Promise<{ lastStartDate: string; lastEndDate: string }>
}
