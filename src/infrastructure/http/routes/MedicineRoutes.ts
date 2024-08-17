import { Router } from 'express'
import { IMedicineTreatmentController } from '../controllers/MedicineTreatmentController'
import { asyncHandler } from '../middlewares/AsyncHandler'

export class MedicineRoutes {
  private readonly routes: Router
  constructor(
    private readonly medicineTreatmentController: IMedicineTreatmentController
  ) {
    this.routes = Router()
    this.routes.post(
      '/',
      //   validator(),
      //   authenticator,
      asyncHandler(this.medicineTreatmentController.createMedicineTreatment)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
