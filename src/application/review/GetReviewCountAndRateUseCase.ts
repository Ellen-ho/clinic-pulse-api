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
  lastTotalReviews: number
  lastOneStarReviewCount: number
  lastTwoStarReviewCount: number
  lastThreeStarReviewCount: number
  lastFourStarReviewCount: number
  lastFiveStarReviewCount: number
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
  compareTotalReviews: number
  compareOneStarReviewCount: number
  compareTwoStarReviewCount: number
  compareThreeStarReviewCount: number
  compareFourStarReviewCount: number
  compareFiveStarReviewCount: number
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

    const { lastStartDate, lastEndDate } =
      await this.reviewRepository.getPreviousPeriodDates(
        startDate,
        endDate,
        granularity
      )

    const lastResult = await this.reviewRepository.getStarReview(
      lastStartDate,
      lastEndDate,
      clinicId,
      granularity
    )

    const compareTotalReviews =
      lastResult.totalReviews === 0
        ? result.totalReviews > 0
          ? 100
          : 0
        : Math.round(
            ((result.totalReviews - lastResult.totalReviews) /
              lastResult.totalReviews) *
              10000
          ) / 100

    const compareOneStarReviewCount =
      lastResult.oneStarReviewCount === 0
        ? result.oneStarReviewCount > 0
          ? 100
          : 0
        : Math.round(
            ((result.oneStarReviewCount - lastResult.oneStarReviewCount) /
              lastResult.oneStarReviewCount) *
              10000
          ) / 100

    const compareTwoStarReviewCount =
      lastResult.twoStarReviewCount === 0
        ? result.twoStarReviewCount > 0
          ? 100
          : 0
        : Math.round(
            ((result.twoStarReviewCount - lastResult.twoStarReviewCount) /
              lastResult.twoStarReviewCount) *
              10000
          ) / 100

    const compareThreeStarReviewCount =
      lastResult.threeStarReviewCount === 0
        ? result.threeStarReviewCount > 0
          ? 100
          : 0
        : Math.round(
            ((result.threeStarReviewCount - lastResult.threeStarReviewCount) /
              lastResult.threeStarReviewCount) *
              10000
          ) / 100

    const compareFourStarReviewCount =
      lastResult.fourStarReviewCount === 0
        ? result.fourStarReviewCount > 0
          ? 100
          : 0
        : Math.round(
            ((result.fourStarReviewCount - lastResult.fourStarReviewCount) /
              lastResult.fourStarReviewCount) *
              10000
          ) / 100

    const compareFiveStarReviewCount =
      lastResult.fiveStarReviewCount === 0
        ? result.fiveStarReviewCount > 0
          ? 100
          : 0
        : Math.round(
            ((result.fiveStarReviewCount - lastResult.fiveStarReviewCount) /
              lastResult.fiveStarReviewCount) *
              10000
          ) / 100

    const finalResponse: GetReviewCountAndRateResponse = {
      lastTotalReviews: lastResult.totalReviews,
      lastOneStarReviewCount: lastResult.oneStarReviewCount,
      lastTwoStarReviewCount: lastResult.twoStarReviewCount,
      lastThreeStarReviewCount: lastResult.threeStarReviewCount,
      lastFourStarReviewCount: lastResult.fourStarReviewCount,
      lastFiveStarReviewCount: lastResult.fiveStarReviewCount,
      totalReviews: result.totalReviews,
      oneStarReviewCount: result.oneStarReviewCount,
      twoStarReviewCount: result.twoStarReviewCount,
      threeStarReviewCount: result.threeStarReviewCount,
      fourStarReviewCount: result.fourStarReviewCount,
      fiveStarReviewCount: result.fiveStarReviewCount,
      oneStarReviewRate: result.oneStarReviewRate,
      twoStarReviewRate: result.twoStarReviewRate,
      threeStarReviewRate: result.threeStarReviewRate,
      fourStarReviewRate: result.fourStarReviewRate,
      fiveStarReviewRate: result.fiveStarReviewRate,
      compareTotalReviews,
      compareOneStarReviewCount,
      compareTwoStarReviewCount,
      compareThreeStarReviewCount,
      compareFourStarReviewCount,
      compareFiveStarReviewCount,
      data: result.data,
    }

    await this.redis.set(redisKey, JSON.stringify(finalResponse), {
      expiresInSec: 31_536_000,
    })

    return finalResponse
  }
}
