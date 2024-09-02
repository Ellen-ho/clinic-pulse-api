import { Granularity } from '../../domain/common'
import { IReviewRepository } from '../../domain/review/interfaces/repositories/IReviewRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { RedisServer } from '../../infrastructure/database/RedisServer'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'

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
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly redis: RedisServer
  ) {}

  public async execute(
    request: GetReviewCountAndRateRequest
  ): Promise<GetReviewCountAndRateResponse> {
    const { startDate, endDate, clinicId, granularity, currentUser } = request

    if (currentUser.role !== UserRoleType.ADMIN) {
      throw new AuthorizationError('Only admin can get this report.')
    }

    const redisKey = `review_counts_and_rate_${
      granularity ?? 'allGranularity'
    }_${startDate}_${endDate}`

    const cachedData = await this.redis.get(redisKey)
    if (cachedData !== null) {
      return JSON.parse(cachedData)
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

    await this.redis.set(redisKey, JSON.stringify(result), {
      expiresInSec: 31_536_000,
    })

    return result
  }
}
