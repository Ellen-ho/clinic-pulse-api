import { Granularity } from 'domain/common'
import { IReviewRepository } from 'domain/review/interfaces/repositories/IReviewRepository'
import { User, UserRoleType } from 'domain/user/User'
import { AuthorizationError } from 'infrastructure/error/AuthorizationError'

interface GetReviewCountAndRateRequest {
  startDate: string
  endDate: string
  clinicId?: string
  granularity?: Granularity
  currentUser: User
}

interface GetReviewCountAndRateResponse {
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
}

export class GetReviewCountAndRateUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}
  public async execute(
    request: GetReviewCountAndRateRequest
  ): Promise<GetReviewCountAndRateResponse> {
    const { startDate, endDate, clinicId, granularity, currentUser } = request

    if (currentUser.role !== UserRoleType.ADMIN) {
      throw new AuthorizationError('Only admin can get this report.')
    }

    const result = await this.reviewRepository.getStarReview(
      startDate,
      endDate,
      clinicId,
      granularity
    )

    if (result.totalReviews === 0) {
      return {
        totalReviews: 0,
        oneStarReviewCount: 0,
        twoStarReviewCount: 0,
        threeStarReviewCount: 0,
        fourStarReviewCount: 0,
        fiveStarReviewCount: 0,
        oneStarReviewRate: 0,
        twoStarReviewRate: 0,
        threeStarReviewRate: 0,
        fourStarReviewRate: 0,
        fiveStarReviewRate: 0,
        data: [],
      }
    }

    return result
  }
}
