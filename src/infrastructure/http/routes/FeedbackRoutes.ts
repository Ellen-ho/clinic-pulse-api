import { Router } from 'express'
import { IFeedbackController } from '../controllers/FeedbackController'
import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  getFeedbackCountAndRateSchema,
  getFeedbackListSchema,
  getSingleFeedbackSchema,
} from '../../../application/feedback/FeedbackValidator'
import { authorized } from '../middlewares/Authorized'
import { PERMISSION } from '../../../domain/permission/Permission'

export class FeedbackRoutes {
  private readonly routes: Router
  constructor(private readonly feedbackController: IFeedbackController) {
    this.routes = Router()
    this.routes
      .post('/', asyncHandler(this.feedbackController.createFeedback))
      .get(
        '/related_ratios',
        authenticated,
        authorized(PERMISSION.REPORT_CENTER_READ),
        validator(getFeedbackCountAndRateSchema),
        asyncHandler(this.feedbackController.getFeedbackCountAndRate)
      )
      .get(
        '/:id',
        authenticated,
        authorized(PERMISSION.FEEDBACK_SURVEY_READ),
        validator(getSingleFeedbackSchema),
        asyncHandler(this.feedbackController.getSingleFeedback)
      )
      .get(
        '/',
        authenticated,
        authorized(PERMISSION.FEEDBACK_SURVEY_READ),
        validator(getFeedbackListSchema),
        asyncHandler(this.feedbackController.getFeedbackList)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
