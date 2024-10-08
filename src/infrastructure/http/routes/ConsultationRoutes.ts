import { Router } from 'express'
import { IConsultationController } from '../controllers/ConsultationController'
import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  createAcupunctureAndMedicineSchema,
  createAcupunctureTreatmentSchema,
  createConsultationSchema,
  createMedicineTreatmentSchema,
  getAverageConsultationCountSchema,
  getAverageWaitingTimeSchema,
  getConsultationBookingSchema,
  getConsultationListSchema,
  getConsultationOnsiteCanceledSchema,
  getConsultationRealTimeCountSchema,
  getConsultationRealTimeListSchema,
  getDifferentTreatmentConsultationSchema,
  getSingleConsultationSchema,
  updateAcupunctureStartAtSchema,
  updateAcupunctureTreatmentRemoveNeedleAtSchema,
  updateConsultationCheckOutSchema,
  updateConsultationWaitForAcupunctureSchema,
  updateMedicineTreatmentSchema,
} from '../../../application/consultation/ConsultationValidator'
import { authorized } from '../middlewares/Authorized'
import { PERMISSION } from '../../../domain/permission/Permission'

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
        authorized(PERMISSION.REPORT_CENTER_READ),
        validator(getDifferentTreatmentConsultationSchema),
        asyncHandler(
          this.consultationController.getDifferentTreatmentConsultation
        )
      )
      .get(
        '/average_counts',
        authenticated,
        authorized(PERMISSION.REPORT_CENTER_READ),
        validator(getAverageConsultationCountSchema),
        asyncHandler(this.consultationController.getAverageConsultationCount)
      )
      .get(
        '/first_time',
        authenticated,
        authorized(PERMISSION.REPORT_CENTER_READ),
        validator(getAverageWaitingTimeSchema),
        asyncHandler(
          this.consultationController.getFirstTimeConsultationCountAndRate
        )
      )
      .get(
        '/average_waiting_time',
        authenticated,
        authorized(PERMISSION.REPORT_CENTER_READ),
        validator(getAverageWaitingTimeSchema),
        asyncHandler(this.consultationController.getAverageWaitingTime)
      )
      .get(
        '/canceled',
        authenticated,
        authorized(PERMISSION.REPORT_CENTER_READ),
        validator(getConsultationOnsiteCanceledSchema),
        asyncHandler(
          this.consultationController.getConsultationOnsiteCanceledCountAndRate
        )
      )
      .get(
        '/booking',
        authenticated,
        authorized(PERMISSION.REPORT_CENTER_READ),
        validator(getConsultationBookingSchema),
        asyncHandler(
          this.consultationController.getConsultationBookingCountAndRate
        )
      )
      .get(
        '/real_time_counts',
        authenticated,
        authorized(PERMISSION.DASHBOARD_READ),
        validator(getConsultationRealTimeCountSchema),
        asyncHandler(this.consultationController.getConsultationRealTimeCount)
      )
      .get(
        '/real_time_lists',
        authenticated,
        authorized(PERMISSION.DASHBOARD_READ),
        validator(getConsultationRealTimeListSchema),
        asyncHandler(this.consultationController.getConsultationRealTimeList)
      )
      .get(
        '/:id',
        authenticated,
        authorized(PERMISSION.CONSULTATION_READ),
        validator(getSingleConsultationSchema),
        asyncHandler(this.consultationController.getSingleConsultation)
      )
      .get(
        '/',
        authenticated,
        authorized(PERMISSION.CONSULTATION_READ),
        validator(getConsultationListSchema),
        asyncHandler(this.consultationController.getConsultationList)
      )
      .patch(
        '/:id/start',
        authenticated,
        asyncHandler(this.consultationController.updateConsultationStartAt)
      )
      .patch(
        '/:id/onsite_cancel',
        authenticated,
        asyncHandler(
          this.consultationController.updateConsultationOnsiteCancelAt
        )
      )
      .patch(
        '/:id/check_out',
        authenticated,
        validator(updateConsultationCheckOutSchema),
        asyncHandler(this.consultationController.updateConsultationCheckOutAt)
      )
      .patch(
        '/:id/acupuncture-treatmen/remove_needle',
        authenticated,
        validator(updateAcupunctureTreatmentRemoveNeedleAtSchema),
        asyncHandler(
          this.consultationController.updateAcupunctureTreatmentRemoveNeedleAt
        )
      )
      .patch(
        '/:id/acupuncture-treatment/start',
        authenticated,
        validator(updateAcupunctureStartAtSchema),
        asyncHandler(
          this.consultationController.updateAcupunctureTreatmentStartAt
        )
      )
      .patch(
        '/:id/acupuncture-treatment/assign_bed',
        authenticated,
        validator(updateConsultationWaitForAcupunctureSchema),
        asyncHandler(
          this.consultationController.updateConsultationToWaitAcupuncture
        )
      )
      .patch(
        '/:id/medicine-treatment/get_medicine',
        authenticated,
        validator(updateMedicineTreatmentSchema),
        asyncHandler(this.consultationController.updateMedicineTreatment)
      )
      .post(
        '/:id/acupuncture-treatment',
        authenticated,
        validator(createAcupunctureTreatmentSchema),
        asyncHandler(this.consultationController.createAcupunctureTreatment)
      )
      .post(
        '/:id/medicine-treatment',
        authenticated,
        validator(createMedicineTreatmentSchema),
        asyncHandler(this.consultationController.createMedicineTreatment)
      )
      .post(
        '/:id/medicine_and_acupuncture',
        authenticated,
        validator(createAcupunctureAndMedicineSchema),
        asyncHandler(this.consultationController.createAcupunctureAndMedicine)
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
