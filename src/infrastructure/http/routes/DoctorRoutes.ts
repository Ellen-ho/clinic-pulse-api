import { Router } from 'express'
import { authenticated } from '../middlewares/Auth'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { IDoctorController } from '../controllers/DoctorController'

export class DoctorRoutes {
  private readonly routes: Router
  constructor(private readonly doctorController: IDoctorController) {
    this.routes = Router()
    this.routes.get(
      '/',
      authenticated,
      asyncHandler(this.doctorController.getAllDoctors)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
