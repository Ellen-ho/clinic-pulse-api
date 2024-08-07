import { Router } from 'express'
import { UserRoutes } from './UserRoutes'
import { ConsultationRoutes } from './ConsultationRoutes'
import { FeedbackRoutes } from './FeedbackRoutes'

export class MainRoutes {
  private readonly routes: Router
  constructor(
    private readonly userRoutes: UserRoutes,
    private readonly consultationRoutes: ConsultationRoutes,
    private readonly feedbackRoutes: FeedbackRoutes
  ) {
    this.routes = Router()
    this.routes.use('/users', this.userRoutes.createRouter())
    this.routes.use('/consultations', this.consultationRoutes.createRouter())
    this.routes.use('/feedbacks', this.feedbackRoutes.createRouter())
  }

  public createRouter(): Router {
    return this.routes
  }
}
