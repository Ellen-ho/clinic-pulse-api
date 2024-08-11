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
import { GetSingleConsultationUseCase } from 'application/consultation/GetSingleConsultationUseCase'
import { GetConsultationRelatedRatiosUseCase } from 'application/consultation/GetConsultationRelatedRatiosUseCase'
import { GetConsultationRealTimeCountUseCase } from 'application/consultation/GetConsultatoinRealTimeCountUseCase'
import { GetAverageWaitingTimeUseCase } from 'application/consultation/GetAverageWaitingTimeUseCase'
import { GetFirstTimeConsultationCountAndRateUseCase } from 'application/consultation/GetFirstTimeConsultationCountAndRateUseCase'
import { GetPatientCountPerConsultationUseCase } from 'application/consultation/GetPatientCountPerConsultationUseCase'
import { GetDifferentTreatmentConsultationUseCase } from 'application/consultation/GetDifferentTreatmentConsultationUseCase'
import { FeedbackRepository } from 'infrastructure/entities/feedback/FeedbackRepository'
import { GetFeedbackListUseCase } from 'application/feedback/GetFeedbackListUseCase'
import { FeedbackController } from 'infrastructure/http/controllers/FeedbackController'
import { FeedbackRoutes } from 'infrastructure/http/routes/FeedbackRoutes'
import { GetSingleFeedbackUseCase } from 'application/feedback/GetSingleFeedbackUseCase'
import { GetFeedbackCountAndRateUseCase } from 'application/feedback/GetFeedbackCountAndRateUseCase'
import { PatientController } from 'infrastructure/http/controllers/PatientController'
import { PatientRepository } from 'infrastructure/entities/patient/PatientRepository'
import { GetPatientNameAutoCompleteUseCase } from 'application/patient/getPatientNameAutoComplete'
import { PatientRoutes } from 'infrastructure/http/routes/PatientRoutes'
import { errorHandler } from 'infrastructure/http/middlewares/ErrorHandler'

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
  const feedbackRepository = new FeedbackRepository(dataSource)
  const patientRepository = new PatientRepository(dataSource)

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
    consultationRepository,
    doctorRepository
  )

  const getSingleConsultationUseCase = new GetSingleConsultationUseCase(
    consultationRepository,
    doctorRepository
  )

  const getConsultationRelatedRatiosUseCase =
    new GetConsultationRelatedRatiosUseCase(consultationRepository)

  const getConsultationRealTimeCountUseCase =
    new GetConsultationRealTimeCountUseCase(consultationRepository)

  const getAverageWaitingTimeUseCase = new GetAverageWaitingTimeUseCase(
    consultationRepository
  )
  const getFirstTimeConsultationCountAndRateUseCase =
    new GetFirstTimeConsultationCountAndRateUseCase(consultationRepository)

  const getPatientCountPerConsultationUseCase =
    new GetPatientCountPerConsultationUseCase(consultationRepository)

  const getDifferentTreatmentConsultationUseCase =
    new GetDifferentTreatmentConsultationUseCase(consultationRepository)

  const getFeedbackListUseCase = new GetFeedbackListUseCase(
    feedbackRepository,
    doctorRepository
  )

  const getSingleFeedbackUseCase = new GetSingleFeedbackUseCase(
    feedbackRepository,
    doctorRepository
  )

  const getFeedbackCountAndRateUseCase = new GetFeedbackCountAndRateUseCase(
    feedbackRepository
  )

  const getPatientNameAutoCompleteUseCase =
    new GetPatientNameAutoCompleteUseCase(patientRepository)

  const userController = new UserController(
    createUserUseCase,
    createDoctorUseCase,
    doctorRepository
  )

  const consultationController = new ConsultationController(
    getConsultationListUseCase,
    getSingleConsultationUseCase,
    getConsultationRelatedRatiosUseCase,
    getConsultationRealTimeCountUseCase,
    getAverageWaitingTimeUseCase,
    getFirstTimeConsultationCountAndRateUseCase,
    getPatientCountPerConsultationUseCase,
    getDifferentTreatmentConsultationUseCase
  )

  const feedbackController = new FeedbackController(
    getFeedbackListUseCase,
    getSingleFeedbackUseCase,
    getFeedbackCountAndRateUseCase
  )

  const patientController = new PatientController(
    getPatientNameAutoCompleteUseCase
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
  const feedbackRoutes = new FeedbackRoutes(feedbackController)
  const patientRoutes = new PatientRoutes(patientController)

  const mainRoutes = new MainRoutes(
    userRoutes,
    consultationRoutes,
    feedbackRoutes,
    patientRoutes
  )

  app.use(cors(corsOptions))

  app.use('/api', mainRoutes.createRouter())

  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}
