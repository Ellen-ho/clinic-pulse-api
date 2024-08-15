import { Router } from 'express'
import { UserRoutes } from './UserRoutes'
import { ConsultationRoutes } from './ConsultationRoutes'
import { FeedbackRoutes } from './FeedbackRoutes'
import { PatientRoutes } from './PatientRoutes'
import { DoctorRoutes } from './DoctorRoutes'
import { AcupunctureRoutes } from './AcupunctureRoutes'
import { MedicineRoutes } from './MedicineRoutes'

export class MainRoutes {
  private readonly routes: Router
  constructor(
    private readonly userRoutes: UserRoutes,
    private readonly consultationRoutes: ConsultationRoutes,
    private readonly feedbackRoutes: FeedbackRoutes,
    private readonly patientRoutes: PatientRoutes,
    private readonly doctorRoutes: DoctorRoutes,
    private readonly acupunctureRoutes: AcupunctureRoutes,
    private readonly medicineRoutes: MedicineRoutes
  ) {
    this.routes = Router()
    this.routes.use('/users', this.userRoutes.createRouter())
    this.routes.use('/consultations', this.consultationRoutes.createRouter())
    this.routes.use('/feedbacks', this.feedbackRoutes.createRouter())
    this.routes.use('/patients', this.patientRoutes.createRouter())
    this.routes.use('/doctors', this.doctorRoutes.createRouter())
    this.routes.use(
      '/acupuncture-treatments',
      this.acupunctureRoutes.createRouter()
    )
    this.routes.use('/medicine-treatments', this.medicineRoutes.createRouter())
  }

  public createRouter(): Router {
    return this.routes
  }
}
