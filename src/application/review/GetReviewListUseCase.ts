import { IReviewRepository } from '../../domain/review/interfaces/repositories/IReviewRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'

interface GetReviewListRequest {
  startDate: string
  endDate: string
  clinicId?: string
  patientName?: string
  reviewRating?: number
  page: number
  limit: number
  currentUser: User
}

interface GetReviewListResponse {
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
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
  totalCounts: number
}

export class GetReviewListUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  public async execute(
    request: GetReviewListRequest
  ): Promise<GetReviewListResponse> {
    const {
      startDate,
      endDate,
      clinicId,
      patientName,
      reviewRating,
      page,
      limit,
      currentUser,
    } = request
    const offset: number = getOffset(limit, page)

    if (currentUser.role !== UserRoleType.ADMIN) {
      throw new AuthorizationError('Only admin can access reviews.')
    }

    const reviewList = await this.reviewRepository.findByQuery(
      limit,
      offset,
      startDate,
      endDate,
      clinicId,
      patientName,
      reviewRating
    )

    return {
      data: reviewList.data,
      pagination: getPagination(limit, page, reviewList.totalCounts),
      totalCounts: reviewList.totalCounts,
    }
  }
}
