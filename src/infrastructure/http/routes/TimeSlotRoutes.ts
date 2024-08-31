import { Router } from 'express'
import { authenticated } from '../middlewares/Auth'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { ITimeSlotController } from '../controllers/TimeSlotController'
import { getTimeSlotSchema } from 'application/time-slot/TimeSlotValidator'
import { validator } from '../middlewares/Validator'

export class TimeSlotRoutes {
  private readonly routes: Router
  constructor(private readonly timeSlotController: ITimeSlotController) {
    this.routes = Router()
    this.routes.get(
      '/',
      authenticated,
      validator(getTimeSlotSchema),
      asyncHandler(this.timeSlotController.getTimeSlot)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
