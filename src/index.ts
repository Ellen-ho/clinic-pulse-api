import express, { Express } from 'express'
import * as path from 'path'
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
import { CreateConsultationUseCase } from './application/consultation/CreateConsultationUseCase'
import { GetAllDoctorsUseCase } from './application/doctor/GetAllDoctorsUseCase'
import { DoctorController } from './infrastructure/http/controllers/DoctorController'
import { DoctorRoutes } from './infrastructure/http/routes/DoctorRoutes'
import { CreateAcupunctureTreatmentUseCase } from './application/consultation/CreateAcupunctureTreatmentUseCase'
import { CreateMedicineTreatmentUseCase } from './application/consultation/CreateMedicineTreatmentUseCase'
import { AcupunctureTreatmentRepository } from './infrastructure/entities/treatment/AcupunctureTreatmentRepository'
import { MedicineTreatmentRepository } from './infrastructure/entities/treatment/MedicineTreatmentRepository'
import { UpdateConsultationToMedicineUseCase } from './application/consultation/UpdateConsultationToMedicineUseCase'
import { UpdateConsultationCheckOutAtUseCase } from './application/consultation/UpdateConsultationCheckOutAtUseCase'
import { UpdateAcupunctureTreatmentStartAtUseCase } from './application/consultation/UpdateAcupunctureTreatmentStartAtUseCase'
import { UpdateAcupunctureTreatmentRemoveNeedleAtUseCase } from './application/consultation/UpdateAcupunctureTreatmentRemoveNeedleAtUseCase'
import { UpdateConsultationToWaitAcupunctureUseCase } from './application/consultation/UpdateConsultationToWaitAcupunctureUseCase'
import { UpdateConsultationToWaitRemoveNeedleUseCase } from './application/consultation/UpdateConsultationToWaitRemoveNeedleUseCase'
import { UpdateMedicineTreatmentUseCase } from './application/consultation/UpdateMedicineTreatmentUseCase'
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
import { CreateAcupunctureAndMedicineUseCase } from './application/consultation/CreateAcupunctureAndMedicineUseCase'
import { GetConsultationSocketRealTimeCountUseCase } from './application/consultation/GetConsultationSocketRealTimeCountUseCase'
import { GetConsultationRealTimeListUseCase } from './application/consultation/GetConsultationRealTimeListUseCase'
import { GetConsultationSocketRealTimeListUseCase } from './application/consultation/GetConsultationSocketRealTimeListUseCase'
import { CreateFeedbackUseCase } from './application/feedback/CreateFeedbackUseCase'
import { S3Client } from '@aws-sdk/client-s3'
import { EditDoctorAvatarUseCase } from './application/doctor/EditDoctorAvatarUseCase'
import { RedisServer } from './infrastructure/database/RedisServer'
import { GoogleReviewCronJob } from './application/cronjob/GoogleReviewCronJob'
import GoogleReviewService from './infrastructure/network/GoogleReviewService'
import { Scheduler } from './infrastructure/network/Scheduler'
import { TimeSlotController } from './infrastructure/http/controllers/TimeSlotController'
import { GetTimeSlotUseCase } from './application/time-slot/GetTimeSlotUseCase'
import { TimeSlotRoutes } from './infrastructure/http/routes/TimeSlotRoutes'
import { GetReviewCountAndRateUseCase } from './application/review/GetReviewCountAndRateUseCase'
import { QueueService } from './infrastructure/network/QueueService'
import { ConsultationQueueService } from './application/queue/ConsultationQueueService'
import { GetConsultationOnsiteCanceledCountAndRateUseCase } from './application/consultation/GetConsultationOnsiteCanceledCountAndRateUseCase'
import { GetConsultationBookingCountAndRateUseCase } from './application/consultation/GetConsultationBookingCountAndRateUseCase'
import { PermissionRepository } from './infrastructure/entities/permission/PermissionRepository'
import { UpdateConsultationToWaitForBedUseCase } from './application/consultation/UpdateConsultationToWaitForBedUseCase'
import { CreatePasswordChangeMailUseCase } from './application/user/CreatePasswordChangeMailUseCase'
import { UpdatePasswordUseCase } from './application/user/UpdatePasswordUseCase'
import { GoogleMailService } from './infrastructure/network/GoogleMailService'
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

  const redis = new RedisServer({
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT as string),
    authToken: process.env.REDIS_AUTH_TOKEN as string,
    retryAttempts: Number(process.env.REDIS_RECONNECT_ATTEMPTS as string),
    retryDelayMS: Number(process.env.REDIS_RECONNECT_DELAY_MS as string),
    awsTlsEnabled: process.env.REDIS_AWS_TLS_ENABLED === 'true',
  })

  await redis.connect()

  /**
   * Shared Services
   */
  const uuidService = new UuidService()
  const hashGenerator = new BcryptHashGenerator()
  const scheduler = new Scheduler()
  const mailService = new GoogleMailService()
  const queueService = new QueueService({
    redisPort: Number(process.env.REDIS_PORT as string),
    redisUrl: process.env.REDIS_HOST as string,
    redisPassword: process.env.REDIS_AUTH_TOKEN as string,
  })

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
  const permissionRepository = new PermissionRepository(dataSource)

  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY as string,
      secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
    region: process.env.BUCKET_REGION as string,
  })

  /**
   * Cross domain helper
   */

  const notificationHelper = new NotificationHelper(
    notificationRepository,
    uuidService,
    notificationSocketService
  )

  const realTimeUpdateHelper = new RealTimeUpdateHelper(realTimeSocketService)

  const consultationQueueService = new ConsultationQueueService(
    consultationRepository,
    userRepository,
    queueService,
    notificationHelper
  )
  await consultationQueueService.init()

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

  const editDoctorAvatarUseCase = new EditDoctorAvatarUseCase(
    s3Client,
    uuidService,
    doctorRepository
  )

  const createPasswordChangeMailUseCase = new CreatePasswordChangeMailUseCase(
    userRepository,
    mailService
  )

  const updatePasswordUseCase = new UpdatePasswordUseCase(
    userRepository,
    hashGenerator
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

  const getConsultationOnsiteCanceledCountAndRateUseCase =
    new GetConsultationOnsiteCanceledCountAndRateUseCase(
      consultationRepository,
      doctorRepository,
      redis
    )

  const getConsultationBookingCountAndRateUseCase =
    new GetConsultationBookingCountAndRateUseCase(
      consultationRepository,
      doctorRepository,
      redis
    )

  const getConsultationRealTimeCountUseCase =
    new GetConsultationRealTimeCountUseCase(
      consultationRepository,
      doctorRepository,
      timeSlotRepository
    )

  const getAverageWaitingTimeUseCase = new GetAverageWaitingTimeUseCase(
    consultationRepository,
    doctorRepository,
    redis
  )
  const getFirstTimeConsultationCountAndRateUseCase =
    new GetFirstTimeConsultationCountAndRateUseCase(
      consultationRepository,
      doctorRepository,
      redis
    )

  const getAverageConsultationCountUseCase =
    new GetAverageConsultationCountUseCase(
      consultationRepository,
      timeSlotRepository,
      doctorRepository,
      redis
    )

  const getDifferentTreatmentConsultationUseCase =
    new GetDifferentTreatmentConsultationUseCase(
      consultationRepository,
      doctorRepository,
      redis
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
    doctorRepository,
    redis
  )

  const getPatientNameAutoCompleteUseCase =
    new GetPatientNameAutoCompleteUseCase(patientRepository)

  const createConsultationUseCase = new CreateConsultationUseCase(
    consultationRepository,
    uuidService,
    consultationQueueService
  )

  const updateConsultationStartAtUseCase = new UpdateConsultationStartAtUseCase(
    consultationRepository
  )

  const createAcupunctureTreatmentUseCase =
    new CreateAcupunctureTreatmentUseCase(
      acupunctureTreatmentRepository,
      consultationRepository,
      uuidService
    )

  const createMedicineTreatmentUseCase = new CreateMedicineTreatmentUseCase(
    medicineTreatmentRepository,
    consultationRepository,
    uuidService
  )

  const createAcupunctureAndMedicineUseCase =
    new CreateAcupunctureAndMedicineUseCase(
      acupunctureTreatmentRepository,
      medicineTreatmentRepository,
      consultationRepository,
      uuidService
    )

  const updateConsultationToWaitAcupunctureUseCase =
    new UpdateConsultationToWaitAcupunctureUseCase(
      consultationRepository,
      acupunctureTreatmentRepository,
      consultationQueueService
    )

  const updateConsultationToMedicineUseCase =
    new UpdateConsultationToMedicineUseCase(
      consultationRepository,
      consultationQueueService
    )

  const updateConsultationCheckOutAtUseCase =
    new UpdateConsultationCheckOutAtUseCase(consultationRepository)

  const updateConsultationToWaitForBedUseCase =
    new UpdateConsultationToWaitForBedUseCase(
      consultationRepository,
      consultationQueueService
    )

  const updateAcupunctureTreatmentStartAtUseCase =
    new UpdateAcupunctureTreatmentStartAtUseCase(
      acupunctureTreatmentRepository,
      consultationRepository
    )

  const updateAcupunctureTreatmentRemoveNeedleAtUseCase =
    new UpdateAcupunctureTreatmentRemoveNeedleAtUseCase(
      acupunctureTreatmentRepository
    )

  const updateConsultationToWaitRemoveNeedleUseCase =
    new UpdateConsultationToWaitRemoveNeedleUseCase(
      consultationRepository,
      consultationQueueService
    )

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

  const getReviewCountAndRateUseCase = new GetReviewCountAndRateUseCase(
    reviewRepository,
    redis
  )

  const getConsultationSocketRealTimeCountUseCase =
    new GetConsultationSocketRealTimeCountUseCase(consultationRepository)

  const getConsultationSocketRealTimeListUseCase =
    new GetConsultationSocketRealTimeListUseCase(consultationRepository)

  const getTimeSlotUseCase = new GetTimeSlotUseCase(
    timeSlotRepository,
    doctorRepository
  )

  const googleReviewService = new GoogleReviewService(
    reviewRepository,
    uuidService,
    notificationHelper,
    redis,
    userRepository
  )

  /**
   * Cron Job
   */
  const googleReviewCronJob = new GoogleReviewCronJob(
    googleReviewService,
    scheduler
  )
  await googleReviewCronJob.init()

  // Controller
  const commonController = new CommonController(getDoctorsAndClinicsUseCase)

  const userController = new UserController(
    createUserUseCase,
    createDoctorUseCase,
    doctorRepository,
    permissionRepository,
    createPasswordChangeMailUseCase,
    updatePasswordUseCase
  )

  const consultationController = new ConsultationController(
    realTimeUpdateHelper,
    getConsultationListUseCase,
    getSingleConsultationUseCase,
    getConsultationOnsiteCanceledCountAndRateUseCase,
    getConsultationBookingCountAndRateUseCase,
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
    getConsultationSocketRealTimeListUseCase,
    createAcupunctureTreatmentUseCase,
    updateConsultationToWaitForBedUseCase,
    createMedicineTreatmentUseCase,
    updateConsultationToMedicineUseCase,
    updateConsultationToWaitAcupunctureUseCase,
    updateAcupunctureTreatmentStartAtUseCase,
    updateConsultationToWaitRemoveNeedleUseCase,
    updateAcupunctureTreatmentRemoveNeedleAtUseCase,
    updateMedicineTreatmentUseCase,
    createAcupunctureAndMedicineUseCase,
    consultationRepository
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
    getDoctorProfileUseCase,
    editDoctorAvatarUseCase
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
    getSingleReviewUseCase,
    getReviewCountAndRateUseCase
  )

  const timeSlotController = new TimeSlotController(getTimeSlotUseCase)

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
  const notificationRoutes = new NotificationRoutes(notificationController)
  const reviewRoutes = new ReviewRoutes(reviewController)
  const commonRoutes = new CommonRoutes(commonController)
  const timeSlotRoutes = new TimeSlotRoutes(timeSlotController)

  const mainRoutes = new MainRoutes(
    userRoutes,
    consultationRoutes,
    feedbackRoutes,
    patientRoutes,
    doctorRoutes,
    notificationRoutes,
    reviewRoutes,
    commonRoutes,
    timeSlotRoutes
  )

  // await googleReviewService.fetchAllGoogleReviews()

  app.use('/upload', express.static(path.join(__dirname, 'upload')))

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
