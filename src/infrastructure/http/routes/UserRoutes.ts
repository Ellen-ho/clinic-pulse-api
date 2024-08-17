import { Router } from 'express'
import { IUserController } from '../controllers/UserController'
import { validator } from '../middlewares/Validator'
import {
  signInUserSchema,
  signUpUserSchema,
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
        '/',
        validator(signUpUserSchema),
        asyncHandler(this.userController.signup)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
