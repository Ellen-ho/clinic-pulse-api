import { Router } from 'express'
import { IPatientController } from '../controllers/PatientController'
import { authenticated } from '../middlewares/Auth'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { validator } from '../middlewares/Validator'
import { getPatientNameAutoCompleteSchema } from 'application/patient/PatientValidator'

export class PatientRoutes {
  private readonly routes: Router
  constructor(private readonly patientController: IPatientController) {
    this.routes = Router()
    this.routes.get(
      '/',
      authenticated,
      validator(getPatientNameAutoCompleteSchema),
      asyncHandler(this.patientController.getPatientNameAutoComplete)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
