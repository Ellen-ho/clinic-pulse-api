import { Router } from 'express'
import { IConsultationController } from '../controllers/ConsultationController'
import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  createConsultationSchema,
  getAverageConsultationCountSchema,
  getAverageWaitingTimeSchema,
  getConsultationListSchema,
  getConsultationOnsiteCanceledAndBookingSchema,
  getConsultationRealTimeCountSchema,
  getDifferentTreatmentConsultationSchema,
  getSingleConsultationSchema,
} from 'application/consultation/ConsultationValidator'

export class ConsultationRoutes {
  private readonly routes: Router
  constructor(
    private readonly consultationController: IConsultationController
  ) {
    this.routes = Router()
    this.routes
      .get(
        '/different_treatments',
        authenticated,
        validator(getDifferentTreatmentConsultationSchema),
        asyncHandler(
          this.consultationController.getDifferentTreatmentConsultation
        )
      )
      .get(
        '/average_counts',
        authenticated,
        validator(getAverageConsultationCountSchema),
        asyncHandler(this.consultationController.getAverageConsultationCount)
      )
      .get(
        '/first_time',
        authenticated,
        validator(getAverageWaitingTimeSchema),
        asyncHandler(
          this.consultationController.getFirstTimeConsultationCountAndRate
        )
      )
      .get(
        '/average_waiting_time',
        authenticated,
        validator(getAverageWaitingTimeSchema),
        asyncHandler(this.consultationController.getAverageWaitingTime)
      )
      .get(
        '/canceled_and_booking',
        authenticated,
        validator(getConsultationOnsiteCanceledAndBookingSchema),
        asyncHandler(
          this.consultationController.getConsultationOnsiteCanceledAndBooking
        )
      )
      .get(
        '/real_time_counts',
        authenticated,
        validator(getConsultationRealTimeCountSchema),
        asyncHandler(this.consultationController.getConsultationRealTimeCount)
      )
      .get(
        '/:id',
        authenticated,
        validator(getSingleConsultationSchema),
        asyncHandler(this.consultationController.getSingleConsultation)
      )
      .get(
        '/',
        authenticated,
        validator(getConsultationListSchema),
        asyncHandler(this.consultationController.getConsultationList)
      )
      .patch(
        '/:id',
        authenticated,
        asyncHandler(this.consultationController.updateConsultationStartAt)
      )
      .post(
        '/',
        authenticated,
        validator(createConsultationSchema),
        asyncHandler(this.consultationController.createConsultation)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
