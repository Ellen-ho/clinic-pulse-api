import { Router } from 'express'
import { UserRoutes } from './UserRoutes'
import { ConsultationRoutes } from './ConsultationRoutes'

export class MainRoutes {
  private readonly routes: Router
  constructor(
    private readonly userRoutes: UserRoutes,
    private readonly consultationRoutes: ConsultationRoutes
  ) {
    this.routes = Router()
    this.routes.use('/users', this.userRoutes.createRouter())
    this.routes.use('/consultations', this.consultationRoutes.createRouter())
  }

  public createRouter(): Router {
    return this.routes
  }
}
