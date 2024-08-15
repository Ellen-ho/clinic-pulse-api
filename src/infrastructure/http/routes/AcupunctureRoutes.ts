import { Router } from 'express'
import { IAcupunctureTreatmentController } from '../controllers/AcupunctureTreatmentController'
import { asyncHandler } from '../middlewares/AsyncHandler'

export class AcupunctureRoutes {
  private readonly routes: Router
  constructor(
    private readonly acupunctureTreatmentController: IAcupunctureTreatmentController
  ) {
    this.routes = Router()
    this.routes.post(
      '/',
      //   validator(),
      //   authenticator,
      asyncHandler(
        this.acupunctureTreatmentController.createAcupunctureTreatment
      )
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
