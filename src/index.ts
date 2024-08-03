import express, { Express } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import { PostgresDatabase } from 'infrastructure/database/PostgresDatabase'
import { UuidService } from 'infrastructure/utils/UuidService'
import { BcryptHashGenerator } from 'infrastructure/utils/BcryptHashGenerator'
import { UserController } from 'infrastructure/http/controllers/UserController'
import { CreateDoctorUseCase } from 'application/doctor/CreateDoctorUseCase'
import { CreateUserUseCase } from 'application/user/CreateUserUseCase'
import { UserRepository } from 'infrastructure/entities/user/UserRepository'
import { PassportConfig } from 'infrastructure/config/passportConfig'
import { UserRoutes } from 'infrastructure/http/routes/UserRoutes'
import { MainRoutes } from 'infrastructure/http/routes'
import { DoctorRepository } from 'infrastructure/entities/doctor/DoctorRepository'
import { ConsultationRepository } from 'infrastructure/entities/consultation/ConsultationRepository'
import { GetConsultationListUseCase } from 'application/consultation/GetConsultationListUseCase'
import { ConsultationController } from 'infrastructure/http/controllers/ConsultationController'
import { ConsultationRoutes } from 'infrastructure/http/routes/ConsultationRoutes'

void main()

async function main(): Promise<void> {
  dotenv.config()
  const env = process.env
  const port = env.API_PORT as string

  if (env.NODE_ENV === 'test' && env.POSTGRES_DB_NAME !== 'test_db') {
    throw new Error(
      `Running test on a non 'test' db will wipe out the entire db! POSTGRES_DB_NAME is specified as '${
        env.POSTGRES_DB_NAME as string
      }'`
    )
  }

  const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }

  const app: Express = express()

  const postgresDatabase = await PostgresDatabase.getInstance()
  const dataSource = postgresDatabase.getDataSource()

  const uuidService = new UuidService()
  const hashGenerator = new BcryptHashGenerator()

  const userRepository = new UserRepository(dataSource)
  const doctorRepository = new DoctorRepository(dataSource)
  const consultationRepository = new ConsultationRepository(dataSource)

  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    uuidService,
    hashGenerator
  )

  const createDoctorUseCase = new CreateDoctorUseCase(
    doctorRepository,
    uuidService
  )

  const getConsultationListUseCase = new GetConsultationListUseCase(
    consultationRepository
  )

  const userController = new UserController(
    createUserUseCase,
    createDoctorUseCase,
    doctorRepository
  )

  const consultationController = new ConsultationController(
    getConsultationListUseCase
  )

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(
    session({
      secret: env.SECRET_KEY as string,
      resave: false,
      saveUninitialized: true,
    })
  )

  // eslint-disable-next-line no-new
  new PassportConfig(userRepository)
  app.use(passport.session())

  const userRoutes = new UserRoutes(userController)
  const consultationRoutes = new ConsultationRoutes(consultationController)

  const mainRoutes = new MainRoutes(userRoutes, consultationRoutes)

  app.use(cors(corsOptions))

  app.use('/api', mainRoutes.createRouter())

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}
