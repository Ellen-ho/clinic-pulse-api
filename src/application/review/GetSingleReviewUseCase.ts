import { IReviewRepository } from 'domain/review/interfaces/repositories/IReviewRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { AuthorizationError } from 'infrastructure/error/AuthorizationError'

interface GetSingleReviewRequest {
  reviewId: string
  currentUser: User
}

interface GetSingleReviewResponse {
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
}

export class GetSingleReviewUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  public async execute(
    request: GetSingleReviewRequest
  ): Promise<GetSingleReviewResponse> {
    const { reviewId, currentUser } = request

    if (currentUser.role !== UserRoleType.ADMIN) {
      throw new AuthorizationError('Only admin can access review.')
    }

    const existingReview = await this.reviewRepository.findById(reviewId)

    if (existingReview == null) {
      throw new NotFoundError('Review does not exist.')
    }

    return existingReview
  }
}
