import { Router } from 'express'
import { authenticated } from '../middlewares/Auth'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { IDoctorController } from '../controllers/DoctorController'
import upload from '../middlewares/multer'
import { authorized } from '../middlewares/Authorized'
import { PERMISSION } from '../../../domain/permission/Permission'

export class DoctorRoutes {
  private readonly routes: Router
  constructor(private readonly doctorController: IDoctorController) {
    this.routes = Router()
    this.routes
      .get(
        '/:id',
        authenticated,
        authorized(PERMISSION.PROFILE_READ),
        asyncHandler(this.doctorController.getDoctorProfile)
      )
      .get(
        '/',
        authenticated,
        authorized(PERMISSION.STAFF_MANAGEMENT_READ),
        asyncHandler(this.doctorController.getAllDoctors)
      )
      .post(
        '/upload-avatar/:id',
        authenticated,
        authorized(PERMISSION.PROFILE_EDIT),
        upload.fields([{ name: 'avatar', maxCount: 1 }]),
        asyncHandler(this.doctorController.uploadAvatar)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
