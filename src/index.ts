import express, { Express } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import { Server } from 'socket.io'
import { PostgresDatabase } from './infrastructure/database/PostgresDatabase'
import { UuidService } from './infrastructure/utils/UuidService'
import { BcryptHashGenerator } from './infrastructure/utils/BcryptHashGenerator'
import { UserController } from './infrastructure/http/controllers/UserController'
import { CreateDoctorUseCase } from './application/doctor/CreateDoctorUseCase'
import { CreateUserUseCase } from './application/user/CreateUserUseCase'
import { UserRepository } from './infrastructure/entities/user/UserRepository'
import { PassportConfig } from './infrastructure/config/passportConfig'
import { UserRoutes } from './infrastructure/http/routes/UserRoutes'
import { MainRoutes } from './infrastructure/http/routes'
import { DoctorRepository } from './infrastructure/entities/doctor/DoctorRepository'
import { ConsultationRepository } from './infrastructure/entities/consultation/ConsultationRepository'
import { GetConsultationListUseCase } from './application/consultation/GetConsultationListUseCase'
import { ConsultationController } from './infrastructure/http/controllers/ConsultationController'
import { ConsultationRoutes } from './infrastructure/http/routes/ConsultationRoutes'
import { GetSingleConsultationUseCase } from './application/consultation/GetSingleConsultationUseCase'
import { GetConsultationRealTimeCountUseCase } from './application/consultation/GetConsultationRealTimeCountUseCase'
import { GetAverageWaitingTimeUseCase } from './application/consultation/GetAverageWaitingTimeUseCase'
import { GetFirstTimeConsultationCountAndRateUseCase } from './application/consultation/GetFirstTimeConsultationCountAndRateUseCase'
import { GetAverageConsultationCountUseCase } from './application/consultation/GetAverageConsultationCountUseCase'
import { GetDifferentTreatmentConsultationUseCase } from './application/consultation/GetDifferentTreatmentConsultationUseCase'
import { FeedbackRepository } from './infrastructure/entities/feedback/FeedbackRepository'
import { GetFeedbackListUseCase } from './application/feedback/GetFeedbackListUseCase'
import { FeedbackController } from './infrastructure/http/controllers/FeedbackController'
import { FeedbackRoutes } from './infrastructure/http/routes/FeedbackRoutes'
import { GetSingleFeedbackUseCase } from './application/feedback/GetSingleFeedbackUseCase'
import { GetFeedbackCountAndRateUseCase } from './application/feedback/GetFeedbackCountAndRateUseCase'
import { PatientController } from './infrastructure/http/controllers/PatientController'
import { PatientRepository } from './infrastructure/entities/patient/PatientRepository'
import { GetPatientNameAutoCompleteUseCase } from './application/patient/getPatientNameAutoComplete'
import { PatientRoutes } from './infrastructure/http/routes/PatientRoutes'
import { errorHandler } from './infrastructure/http/middlewares/ErrorHandler'
import { TimeSlotRepository } from './infrastructure/entities/timeSlot/TimeSlotRepository'
import { GetConsultationOnsiteCanceledAndBookingUseCase } from './application/consultation/GetConsultationOnsiteCanceledAndBookingUseCase'
import { CreateConsultationUseCase } from './application/consultation/CreateConsultationUseCase'
import { GetAllDoctorsUseCase } from './application/doctor/GetAllDoctorsUseCase'
import { DoctorController } from './infrastructure/http/controllers/DoctorController'
import { DoctorRoutes } from './infrastructure/http/routes/DoctorRoutes'
import { CreateAcupunctureTreatmentUseCase } from './application/treatment/CreateAcupunctureTreatmentUseCase'
import { AcupunctureTreatmentController } from './infrastructure/http/controllers/AcupunctureTreatmentController'
import { CreateMedicineTreatmentUseCase } from './application/treatment/CreateMedicineTreatmentUseCase'
import { AcupunctureTreatmentRepository } from './infrastructure/entities/treatment/AcupunctureTreatmentRepository'
import { MedicineTreatmentRepository } from './infrastructure/entities/treatment/MedicineTreatmentRepository'
import { MedicineTreatmentController } from './infrastructure/http/controllers/MedicineTreatmentController'
import { AcupunctureRoutes } from './infrastructure/http/routes/AcupunctureRoutes'
import { MedicineRoutes } from './infrastructure/http/routes/MedicineRoutes'
import { UpdateConsultationToAcupunctureUseCase } from './application/consultation/UpdateConsultationToAcupunctureUseCase'
import { UpdateConsultationToMedicineUseCase } from './application/consultation/UpdateConsultationToMedicineUseCase'
import { UpdateConsultationCheckOutAtUseCase } from './application/consultation/UpdateConsultationCheckOutAtUseCase'
import { UpdateAcupunctureTreatmentAssignBedUseCase } from './application/treatment/UpdateAcupunctureTreatmentAssignBedUseCase'
import { UpdateAcupunctureTreatmentStartAtUseCase } from './application/treatment/UpdateAcupunctureTreatmentStartAtUseCase'
import { UpdateAcupunctureTreatmentRemoveNeedleAtUseCase } from './application/treatment/UpdateAcupunctureTreatmentRemoveNeedleAtUseCase'
import { UpdateConsultationToWaitAcupunctureUseCase } from './application/consultation/UpdateConsultationToWaitAcupunctureUseCase'
import { UpdateConsultationToWaitRemoveNeedleUseCase } from './application/consultation/UpdateConsultationToWaitRemoveNeedleUseCase'
import { UpdateMedicineTreatmentUseCase } from './application/treatment/UpdateMedicineTreatmentUseCase'
import { CommonController } from './infrastructure/http/controllers/CommonController'
import { GetDoctorsAndClinicsUseCase } from './application/common/GetDoctorsAndClinicsUseCase'
import { ClinicRepository } from './infrastructure/entities/clinic/ClinicRepository'
import { CommonRoutes } from './infrastructure/http/routes/CommonRoutes'
import { UpdateConsultationStartAtUseCase } from './application/consultation/UpdateConsultationStartAtUseCase'
import { GetDoctorProfileUseCase } from './application/doctor/GetDoctorProfieUseCase'
import { NotificationRoutes } from './infrastructure/http/routes/NotificationRoutes'
import { NotificationController } from './infrastructure/http/controllers/NotificationController'
import { GetNotificationListUseCase } from './application/notification/GetNotificationListUseCase'
import { GetNotificationDetailsUseCase } from './application/notification/GetNotificationDetailsUseCase'
import { GetNotificationHintsUseCase } from './application/notification/GetNotificationHintsUseCase'
import { ReadAllNotificationsUseCase } from './application/notification/ReadAllNotificationsUseCase'
import { DeleteAllNotificationsUseCase } from './application/notification/DeleteAllNotificationsUseCase'
import { DeleteNotificationUseCase } from './application/notification/DeleteNotificationUseCase'
import { NotificationRepository } from './infrastructure/entities/notification/NotificationRepository'
import { UpdateConsultationOnsiteCancelAtUseCase } from './application/consultation/UpdateConsultationOnsiteCancelAtUseCase'
import { NotificationHelper } from './application/notification/NotificationHelper'
import SocketService from './infrastructure/network/SocketService'
import { createServer } from 'http'
import { ReviewRepository } from './infrastructure/entities/review/ReviewRepository'
import { GetReviewListUseCase } from './application/review/GetReviewListUseCase'
import { ReviewController } from './infrastructure/http/controllers/ReviewController'
import { ReviewRoutes } from './infrastructure/http/routes/ReviewRoutes'
import { GetSingleReviewUseCase } from './application/review/GetSingleReviewUseCase'
import RealTimeSocketService from './infrastructure/network/RealtimeSocketService'
import { RealTimeUpdateHelper } from './application/consultation/RealTimeUpdateHelper'
import { CreateAcupunctureAndMedicineUseCase } from 'application/common/CreateAcupunctureAndMedicineUseCase'
import { GetConsultationSocketRealTimeCountUseCase } from 'application/consultation/GetConsultationSocketRealTimeCountUseCase'
import { GetConsultationRealTimeListUseCase } from 'application/consultation/GetConsultationRealTimeListUseCase'
import { GetConsultationSocketRealTimeListUseCase } from 'application/consultation/GetConsultationSocketRealTimeListUseCase'
import { CreateFeedbackUseCase } from 'application/feedback/CreateFeedbackUseCase'

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
    origin: '*',
    credentials: true,
  }

  const app: Express = express()
  const httpServer = createServer(app)

  // Notofication socket
  const notificationIO = new Server(httpServer, {
    path: '/ws/notification',
    transports: ['websocket'],
    cors: corsOptions,
  })
  const notificationSocketService = new SocketService(notificationIO)

  // Real time socket
  const realTimeIO = new Server(httpServer, {
    path: '/ws/real-time',
    transports: ['websocket'],
    cors: corsOptions,
  })
  const realTimeSocketService = new RealTimeSocketService(realTimeIO)

  /**
   * Database Connection
   */
  const postgresDatabase = await PostgresDatabase.getInstance()
  const dataSource = postgresDatabase.getDataSource()

  /**
   * Shared Services
   */
  const uuidService = new UuidService()
  const hashGenerator = new BcryptHashGenerator()

  // Repository
  const userRepository = new UserRepository(dataSource)
  const doctorRepository = new DoctorRepository(dataSource)
  const consultationRepository = new ConsultationRepository(dataSource)
  const feedbackRepository = new FeedbackRepository(dataSource)
  const patientRepository = new PatientRepository(dataSource)
  const timeSlotRepository = new TimeSlotRepository(dataSource)
  const acupunctureTreatmentRepository = new AcupunctureTreatmentRepository(
    dataSource
  )
  const medicineTreatmentRepository = new MedicineTreatmentRepository(
    dataSource
  )
  const clinicRepository = new ClinicRepository(dataSource)
  const notificationRepository = new NotificationRepository(dataSource)
  const reviewRepository = new ReviewRepository(dataSource)

  /**
   * Cross domain helper
   */

  const notificationHelper = new NotificationHelper(
    notificationRepository,
    uuidService,
    notificationSocketService
  )

  const realTimeUpdateHelper = new RealTimeUpdateHelper(realTimeSocketService)

  // Domain
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    uuidService,
    hashGenerator
  )

  const createDoctorUseCase = new CreateDoctorUseCase(
    doctorRepository,
    uuidService
  )

  const getAllDoctorsUseCase = new GetAllDoctorsUseCase(doctorRepository)

  const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepository)

  const getConsultationListUseCase = new GetConsultationListUseCase(
    consultationRepository,
    doctorRepository
  )

  const getSingleConsultationUseCase = new GetSingleConsultationUseCase(
    consultationRepository,
    doctorRepository
  )

  const getConsultationOnsiteCanceledAndBookingUseCase =
    new GetConsultationOnsiteCanceledAndBookingUseCase(
      consultationRepository,
      doctorRepository
    )

  const getConsultationRealTimeCountUseCase =
    new GetConsultationRealTimeCountUseCase(
      consultationRepository,
      doctorRepository,
      timeSlotRepository
    )

  const getAverageWaitingTimeUseCase = new GetAverageWaitingTimeUseCase(
    consultationRepository,
    doctorRepository
  )
  const getFirstTimeConsultationCountAndRateUseCase =
    new GetFirstTimeConsultationCountAndRateUseCase(consultationRepository)

  const getAverageConsultationCountUseCase =
    new GetAverageConsultationCountUseCase(
      consultationRepository,
      timeSlotRepository,
      doctorRepository
    )

  const getDifferentTreatmentConsultationUseCase =
    new GetDifferentTreatmentConsultationUseCase(
      consultationRepository,
      doctorRepository
    )

  const createFeedbackUseCase = new CreateFeedbackUseCase(
    feedbackRepository,
    uuidService,
    notificationHelper,
    userRepository
  )

  const getFeedbackListUseCase = new GetFeedbackListUseCase(
    feedbackRepository,
    doctorRepository
  )

  const getSingleFeedbackUseCase = new GetSingleFeedbackUseCase(
    feedbackRepository,
    doctorRepository
  )

  const getFeedbackCountAndRateUseCase = new GetFeedbackCountAndRateUseCase(
    feedbackRepository,
    doctorRepository
  )

  const getPatientNameAutoCompleteUseCase =
    new GetPatientNameAutoCompleteUseCase(patientRepository)

  const createConsultationUseCase = new CreateConsultationUseCase(
    consultationRepository,
    uuidService
  )

  const updateConsultationStartAtUseCase = new UpdateConsultationStartAtUseCase(
    consultationRepository
  )

  const createAcupunctureTreatmentUseCase =
    new CreateAcupunctureTreatmentUseCase(
      acupunctureTreatmentRepository,
      uuidService
    )

  const createMedicineTreatmentUseCase = new CreateMedicineTreatmentUseCase(
    medicineTreatmentRepository,
    uuidService
  )

  const createAcupunctureAndMedicineUseCase =
    new CreateAcupunctureAndMedicineUseCase(
      acupunctureTreatmentRepository,
      medicineTreatmentRepository,
      uuidService
    )

  const updateConsultationToAcupunctureUseCase =
    new UpdateConsultationToAcupunctureUseCase(consultationRepository)

  const updateConsultationToMedicineUseCase =
    new UpdateConsultationToMedicineUseCase(consultationRepository)

  const updateConsultationCheckOutAtUseCase =
    new UpdateConsultationCheckOutAtUseCase(consultationRepository)

  const updateAcupunctureTreatmentAssignBedUseCase =
    new UpdateAcupunctureTreatmentAssignBedUseCase(
      acupunctureTreatmentRepository
    )

  const updateAcupunctureTreatmentStartAtUseCase =
    new UpdateAcupunctureTreatmentStartAtUseCase(acupunctureTreatmentRepository)

  const updateAcupunctureTreatmentRemoveNeedleAtUseCase =
    new UpdateAcupunctureTreatmentRemoveNeedleAtUseCase(
      acupunctureTreatmentRepository
    )

  const updateConsultationToWaitAcupunctureUseCase =
    new UpdateConsultationToWaitAcupunctureUseCase(consultationRepository)

  const updateConsultationToWaitRemoveNeedleUseCase =
    new UpdateConsultationToWaitRemoveNeedleUseCase(consultationRepository)

  const updateConsultationOnsiteCancelAtUseCase =
    new UpdateConsultationOnsiteCancelAtUseCase(
      consultationRepository,
      timeSlotRepository,
      doctorRepository,
      userRepository,
      notificationHelper
    )

  const getConsultationRealTimeListUseCase =
    new GetConsultationRealTimeListUseCase(
      consultationRepository,
      doctorRepository,
      timeSlotRepository
    )

  const updateMedicineTreatmentUseCase = new UpdateMedicineTreatmentUseCase(
    medicineTreatmentRepository
  )

  const getDoctorsAndClinicsUseCase = new GetDoctorsAndClinicsUseCase(
    doctorRepository,
    clinicRepository
  )

  /**
   * Notification Domain
   */

  const getNotificationListUseCase = new GetNotificationListUseCase(
    notificationRepository
  )

  const getNotificationDetailsUseCase = new GetNotificationDetailsUseCase(
    notificationRepository
  )

  const getNotificationHintsUseCase = new GetNotificationHintsUseCase(
    notificationRepository
  )

  const readAllNotificationsUseCase = new ReadAllNotificationsUseCase(
    notificationRepository
  )

  const deleteAllNotificationsUseCase = new DeleteAllNotificationsUseCase(
    notificationRepository
  )

  const deleteNotificationUseCase = new DeleteNotificationUseCase(
    notificationRepository
  )

  const getReviewListUseCase = new GetReviewListUseCase(reviewRepository)

  const getSingleReviewUseCase = new GetSingleReviewUseCase(reviewRepository)

  const getConsultationSocketRealTimeCountUseCase =
    new GetConsultationSocketRealTimeCountUseCase(consultationRepository)

  const getConsultationSocketRealTimeListUseCase =
    new GetConsultationSocketRealTimeListUseCase(consultationRepository)

  // Controller
  const commonController = new CommonController(
    getDoctorsAndClinicsUseCase,
    createAcupunctureAndMedicineUseCase,
    updateConsultationToAcupunctureUseCase,
    getConsultationSocketRealTimeCountUseCase,
    getConsultationSocketRealTimeListUseCase,
    realTimeUpdateHelper
  )

  const userController = new UserController(
    createUserUseCase,
    createDoctorUseCase,
    doctorRepository
  )

  const consultationController = new ConsultationController(
    realTimeUpdateHelper,
    getConsultationListUseCase,
    getSingleConsultationUseCase,
    getConsultationOnsiteCanceledAndBookingUseCase,
    getConsultationRealTimeCountUseCase,
    getAverageWaitingTimeUseCase,
    getFirstTimeConsultationCountAndRateUseCase,
    getAverageConsultationCountUseCase,
    getDifferentTreatmentConsultationUseCase,
    createConsultationUseCase,
    updateConsultationCheckOutAtUseCase,
    updateConsultationStartAtUseCase,
    updateConsultationOnsiteCancelAtUseCase,
    getConsultationSocketRealTimeCountUseCase,
    getConsultationRealTimeListUseCase,
    getConsultationSocketRealTimeListUseCase
  )

  const feedbackController = new FeedbackController(
    getFeedbackListUseCase,
    getSingleFeedbackUseCase,
    getFeedbackCountAndRateUseCase,
    createFeedbackUseCase
  )

  const patientController = new PatientController(
    getPatientNameAutoCompleteUseCase
  )

  const doctorController = new DoctorController(
    getAllDoctorsUseCase,
    getDoctorProfileUseCase
  )

  const acupunctureTreatmentController = new AcupunctureTreatmentController(
    createAcupunctureTreatmentUseCase,
    updateConsultationToAcupunctureUseCase,
    updateAcupunctureTreatmentAssignBedUseCase,
    updateAcupunctureTreatmentStartAtUseCase,
    updateAcupunctureTreatmentRemoveNeedleAtUseCase,
    updateConsultationToWaitAcupunctureUseCase,
    updateConsultationToWaitRemoveNeedleUseCase,
    getConsultationSocketRealTimeCountUseCase,
    getConsultationSocketRealTimeListUseCase,
    updateConsultationToMedicineUseCase,
    realTimeUpdateHelper,
    consultationRepository
  )

  const medicineTreatmentController = new MedicineTreatmentController(
    createMedicineTreatmentUseCase,
    updateConsultationToMedicineUseCase,
    updateMedicineTreatmentUseCase,
    updateConsultationCheckOutAtUseCase,
    getConsultationSocketRealTimeCountUseCase,
    getConsultationSocketRealTimeListUseCase,
    realTimeUpdateHelper
  )

  const notificationController = new NotificationController(
    getNotificationListUseCase,
    getNotificationDetailsUseCase,
    getNotificationHintsUseCase,
    readAllNotificationsUseCase,
    deleteAllNotificationsUseCase,
    deleteNotificationUseCase
  )

  const reviewController = new ReviewController(
    getReviewListUseCase,
    getSingleReviewUseCase
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

  // Routes
  const userRoutes = new UserRoutes(userController)
  const consultationRoutes = new ConsultationRoutes(consultationController)
  const feedbackRoutes = new FeedbackRoutes(feedbackController)
  const patientRoutes = new PatientRoutes(patientController)
  const doctorRoutes = new DoctorRoutes(doctorController)
  const acupunctureRoutes = new AcupunctureRoutes(
    acupunctureTreatmentController
  )
  const medicineRoutes = new MedicineRoutes(medicineTreatmentController)
  const notificationRoutes = new NotificationRoutes(notificationController)
  const reviewRoutes = new ReviewRoutes(reviewController)
  const commonRoutes = new CommonRoutes(commonController)

  const mainRoutes = new MainRoutes(
    userRoutes,
    consultationRoutes,
    feedbackRoutes,
    patientRoutes,
    doctorRoutes,
    acupunctureRoutes,
    medicineRoutes,
    notificationRoutes,
    reviewRoutes,
    commonRoutes
  )

  // const googleReviewService = new GoogleReviewService(
  //   reviewRepository,
  //   uuidService
  // )
  // await googleReviewService.fetchAllGoogleReviews()

  app.use(cors(corsOptions))

  app.use('/api', mainRoutes.createRouter())

  app.get('/', (req, res) => {
    // for AWS LBS check
    res.status(200).send('Application is running')
  })

  app.use(errorHandler)

  httpServer.listen(port, () => {
    console.log(`Server is running at ${port}, CORS: ${corsOptions.origin}`)
  })
}
