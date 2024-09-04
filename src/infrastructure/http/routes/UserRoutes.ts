import { Router } from 'express'
import { IUserController } from '../controllers/UserController'
import { validator } from '../middlewares/Validator'
import {
  createPasswordChangeMailSchema,
  signInUserSchema,
  signUpUserSchema,
  updatePasswordSchema,
} from '../../../application/user/UserValidator'
import { authenticator } from '../middlewares/Auth'
import { asyncHandler } from '../middlewares/AsyncHandler'

export class UserRoutes {
  private readonly routes: Router
  constructor(private readonly userController: IUserController) {
    this.routes = Router()
    this.routes
      .post(
        '/signin',
        validator(signInUserSchema),
        authenticator,
        asyncHandler(this.userController.signin)
      )
      .post(
        '/reset-password-mail',
        validator(createPasswordChangeMailSchema),
        asyncHandler(this.userController.createPasswordChangeMail)
      )
      .patch(
        '/reset-password',
        validator(updatePasswordSchema),
        asyncHandler(this.userController.updatePassword)
      )
      .post(
        '/',
        validator(signUpUserSchema),
        asyncHandler(this.userController.signup)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
