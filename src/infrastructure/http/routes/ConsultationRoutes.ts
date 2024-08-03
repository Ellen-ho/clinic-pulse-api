import { Router } from 'express'
import { IConsultationController } from '../controllers/ConsultationController'
import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { getConsultationListSchema } from 'application/consultation/ConsultationValidator'

export class ConsultationRoutes {
  private readonly routes: Router
  constructor(
    private readonly consultationController: IConsultationController
  ) {
    this.routes = Router()
    this.routes.get(
      '/',
      authenticated,
      validator(getConsultationListSchema),
      asyncHandler(this.consultationController.getConsultationList)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
