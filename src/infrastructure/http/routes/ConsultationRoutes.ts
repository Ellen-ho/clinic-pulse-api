import { Router } from 'express'
import { IConsultationController } from '../controllers/ConsultationController'
import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  getAverageWaitingTimeSchema,
  getConsultationListSchema,
  getConsultationRealTimeCountSchema,
  getConsultationRelatedRatiosSchema,
  getPatientCountPerConsultationSchema,
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
        '/patient_counts',
        authenticated,
        validator(getPatientCountPerConsultationSchema),
        asyncHandler(this.consultationController.getPatientCountPerConsultation)
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
        '/related_average_waiting_time',
        authenticated,
        validator(getAverageWaitingTimeSchema),
        asyncHandler(this.consultationController.getAverageWaitingTime)
      )
      .get(
        '/related_ratios',
        authenticated,
        validator(getConsultationRelatedRatiosSchema),
        asyncHandler(this.consultationController.getConsultationRelatedRatios)
      )
      .get(
        '/real_time_count',
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
  }

  public createRouter(): Router {
    return this.routes
  }
}
