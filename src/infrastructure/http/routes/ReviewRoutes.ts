import { Router } from 'express'
import { IReviewController } from '../controllers/ReviewController'
import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  getReviewCountAndRateSchema,
  getReviewListSchema,
  getSingleReviewSchema,
} from '../../../application/review/ReviewValidator'
import { authorized } from '../middlewares/Authorized'
import { PERMISSION } from '../../../domain/permission/Permission'

export class ReviewRoutes {
  private readonly routes: Router
  constructor(private readonly reviewController: IReviewController) {
    this.routes = Router()
    this.routes.get(
      '/related_ratios',
      authenticated,
      authorized(PERMISSION.REPORT_CENTER_READ),
      validator(getReviewCountAndRateSchema),
      asyncHandler(this.reviewController.getReviewCountAndRate)
    )
    this.routes.get(
      '/:id',
      authenticated,
      authorized(PERMISSION.ONLINE_REVIEW_READ),
      validator(getSingleReviewSchema),
      asyncHandler(this.reviewController.getSingleReview)
    )
    this.routes.get(
      '/',
      authenticated,
      authorized(PERMISSION.ONLINE_REVIEW_READ),
      validator(getReviewListSchema),
      asyncHandler(this.reviewController.getReviewList)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
