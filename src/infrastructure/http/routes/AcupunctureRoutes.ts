import { Router } from 'express'
import { IAcupunctureTreatmentController } from '../controllers/AcupunctureTreatmentController'
import { asyncHandler } from '../middlewares/AsyncHandler'

export class AcupunctureRoutes {
  private readonly routes: Router
  constructor(
    private readonly acupunctureTreatmentController: IAcupunctureTreatmentController
  ) {
    this.routes = Router()
      .post(
        '/',
        //   validator(),
        //   authenticator,
        asyncHandler(
          this.acupunctureTreatmentController.createAcupunctureTreatment
        )
      )
      .patch(
        '/:id',
        //   validator(),
        //   authenticator,
        asyncHandler(
          this.acupunctureTreatmentController
            .updateAcupunctureTreatmentAssignBed
        )
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
