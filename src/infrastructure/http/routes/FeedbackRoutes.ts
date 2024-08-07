import { Router } from 'express'
import { IFeedbackController } from '../controllers/FeedbackController'
import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  getFeedbackListSchema,
  getSingleFeedbackSchema,
} from 'application/feedback/FeedbackValidator'

export class FeedbackRoutes {
  private readonly routes: Router
  constructor(private readonly feedbackController: IFeedbackController) {
    this.routes = Router()
    this.routes
      .get(
        '/:id',
        authenticated,
        validator(getSingleFeedbackSchema),
        asyncHandler(this.feedbackController.getSingleFeedback)
      )
      .get(
        '/',
        authenticated,
        validator(getFeedbackListSchema),
        asyncHandler(this.feedbackController.getFeedbackList)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
