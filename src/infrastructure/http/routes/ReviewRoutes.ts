import { Router } from 'express'
import { IReviewController } from '../controllers/ReviewController'
import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  getReviewListSchema,
  getSingleReviewSchema,
} from 'application/review/ReviewValidator'

export class ReviewRoutes {
  private readonly routes: Router
  constructor(private readonly reviewController: IReviewController) {
    this.routes = Router()
    this.routes.get(
      '/:id',
      authenticated,
      validator(getSingleReviewSchema),
      asyncHandler(this.reviewController.getSingleReview)
    )
    this.routes.get(
      '/',
      authenticated,
      validator(getReviewListSchema),
      asyncHandler(this.reviewController.getReviewList)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}