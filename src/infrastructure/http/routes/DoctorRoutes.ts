import { Router } from 'express'
import { authenticated } from '../middlewares/Auth'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { IDoctorController } from '../controllers/DoctorController'
import upload from '../middlewares/multer'

export class DoctorRoutes {
  private readonly routes: Router
  constructor(private readonly doctorController: IDoctorController) {
    this.routes = Router()
    this.routes
      .get(
        '/:id',
        authenticated,
        asyncHandler(this.doctorController.getDoctorProfile)
      )
      .get(
        '/',
        authenticated,
        asyncHandler(this.doctorController.getAllDoctors)
      )
      .post(
        '/upload-avatar/:id',
        upload.fields([{ name: 'avatar', maxCount: 1 }]),
        asyncHandler(this.doctorController.uploadAvatar)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
