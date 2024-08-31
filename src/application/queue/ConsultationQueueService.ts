import { NotificationHelper } from 'application/notification/NotificationHelper'
import { Job } from 'bull'
import { ConsultationStatus } from 'domain/consultation/Consultation'
import { NotificationType } from 'domain/notification/Notification'
import { ConsultationRepository } from 'infrastructure/entities/consultation/ConsultationRepository'
import { UserRepository } from 'infrastructure/entities/user/UserRepository'
import { IQueueService } from 'infrastructure/network/QueueService'

export enum CONSULTATION_JOB_NAME {
  CHECK_CONSULTATION_WAITING_TIME = 'checkConsultationWaitingTime',
  CHECK_BED_ASSIGNED_WAITING_TIME = 'checkBedAssignedWaitingTime',
  CHECK_ACUPUNCTURE_WAITING_TIME = 'checkAcupunctureWaitingTime',
  CHECK_NEEDLE_REMOVED_WAITING_TIME = 'checkNeedleRemovedWaitingTime',
  CHECK_MEDICINE_WAITING_TIME = 'checkMedicineWaitingTime',
}

export interface IConsultationQueueService {
  init: () => Promise<void>
  addConsultationJob: (
    jobName: CONSULTATION_JOB_NAME,
    data: any,
    options?: any
  ) => Promise<Job<any>>
}

export class ConsultationQueueService implements IConsultationQueueService {
  constructor(
    private readonly consultationRepository: ConsultationRepository,
    private readonly userRepository: UserRepository,
    private readonly queueService: IQueueService,
    private readonly notificationHelper: NotificationHelper
  ) {}

  public async init(): Promise<void> {
    this.consultationProcessJob()
  }

  public async addConsultationJob(
    jobName: CONSULTATION_JOB_NAME,
    data: any,
    options?: any
  ): Promise<Job<any>> {
    return await this.queueService.addJob(
      'consultationQueue',
      jobName,
      data,
      options
    )
  }

  private consultationProcessJob(): void {
    this.queueService.processJob(
      'consultationQueue',
      CONSULTATION_JOB_NAME.CHECK_CONSULTATION_WAITING_TIME,
      async (job) => {
        const { consultationId } = job.data as { consultationId: string }

        try {
          const consultation = await this.consultationRepository.getById(
            consultationId
          )

          if (consultation === null) {
            console.log('Consultation does not exist.')
            return
          }

          const admin = await this.userRepository.findAdmin()
          if (admin == null) {
            console.log('Admin does not exist.')
            return
          }

          if (
            consultation.status ===
            ConsultationStatus.WAITING_FOR_BED_ASSIGNMENT
          ) {
            await this.notificationHelper.createNotification({
              title: '等待看診時間超過一小時',
              content: `Consultation ${consultationId} has been waiting for more than one hour.`,
              notificationType:
                NotificationType.ABNORMAL_CONSULTATION_WAIT_TIME,
              referenceId: consultationId,
              user: admin,
            })
          }
        } catch (error) {
          console.error('Error processing consultation waiting time:', error)
        }
      }
    )

    this.queueService.processJob(
      'consultationQueue',
      CONSULTATION_JOB_NAME.CHECK_BED_ASSIGNED_WAITING_TIME,
      async (job) => {
        const { consultationId } = job.data as { consultationId: string }

        try {
          const consultation = await this.consultationRepository.getById(
            consultationId
          )

          if (consultation === null) {
            console.log('Consultation does not exist.')
            return
          }

          const admin = await this.userRepository.findAdmin()
          if (admin == null) {
            console.log('Admin does not exist.')
            return
          }

          if (
            consultation.status ===
            ConsultationStatus.WAITING_FOR_ACUPUNCTURE_TREATMENT
          ) {
            await this.notificationHelper.createNotification({
              title: '等待排床時間超過半小時',
              content: `Consultation ${consultationId} has been waiting for bed assignment for more than half an hour.`,
              notificationType: NotificationType.ABNORMAL_BED_WAIT_TIME,
              referenceId: consultationId,
              user: admin,
            })
          }
        } catch (error) {
          console.error('Error processing consultation waiting time:', error)
        }
      }
    )

    this.queueService.processJob(
      'consultationQueue',
      CONSULTATION_JOB_NAME.CHECK_ACUPUNCTURE_WAITING_TIME,
      async (job) => {
        const { consultationId } = job.data as { consultationId: string }

        try {
          const consultation = await this.consultationRepository.getById(
            consultationId
          )

          if (consultation === null) {
            console.log('Consultation does not exist.')
            return
          }

          const admin = await this.userRepository.findAdmin()
          if (admin == null) {
            console.log('Admin does not exist.')
            return
          }

          if (
            consultation.status ===
            ConsultationStatus.WAITING_FOR_BED_ASSIGNMENT
          ) {
            await this.notificationHelper.createNotification({
              title: '等待針灸時間超過半小時',
              content: `Consultation ${consultationId} has been waiting for acupuncture for more than half an hour.`,
              notificationType: NotificationType.ABNORMAL_ACUPUNCTURE_WAIT_TIME,
              referenceId: consultationId,
              user: admin,
            })
          }
        } catch (error) {
          console.error('Error processing consultation waiting time:', error)
        }
      }
    )

    this.queueService.processJob(
      'consultationQueue',
      CONSULTATION_JOB_NAME.CHECK_NEEDLE_REMOVED_WAITING_TIME,
      async (job) => {
        const { consultationId } = job.data as { consultationId: string }

        try {
          const consultation = await this.consultationRepository.getById(
            consultationId
          )

          if (consultation === null) {
            console.log('Consultation does not exist.')
            return
          }

          const admin = await this.userRepository.findAdmin()
          if (admin == null) {
            console.log('Admin does not exist.')
            return
          }

          if (
            consultation.status ===
            ConsultationStatus.WAITING_FOR_NEEDLE_REMOVAL
          ) {
            await this.notificationHelper.createNotification({
              title: '等待取針時間超過半小時',
              content: `Consultation ${consultationId} has been waiting for needle removed for more than half an hour.`,
              notificationType:
                NotificationType.ABNORMAL_NEEDLE_REMOVAL_WAIT_TIME,
              referenceId: consultationId,
              user: admin,
            })
          }
        } catch (error) {
          console.error('Error processing consultation waiting time:', error)
        }
      }
    )

    this.queueService.processJob(
      'consultationQueue',
      CONSULTATION_JOB_NAME.CHECK_MEDICINE_WAITING_TIME,
      async (job) => {
        const { consultationId } = job.data as { consultationId: string }

        try {
          const consultation = await this.consultationRepository.getById(
            consultationId
          )

          if (consultation === null) {
            console.log('Consultation does not exist.')
            return
          }

          const admin = await this.userRepository.findAdmin()
          if (admin == null) {
            console.log('Admin does not exist.')
            return
          }

          if (
            consultation.status === ConsultationStatus.WAITING_FOR_GET_MEDICINE
          ) {
            await this.notificationHelper.createNotification({
              title: '等待拿藥時間超過一小時',
              content: `Consultation ${consultationId} has been waiting for medicine for more than one hour.`,
              notificationType: NotificationType.ABNORMAL_MEDICATION_WAIT_TIME,
              referenceId: consultationId,
              user: admin,
            })
          }
        } catch (error) {
          console.error('Error processing consultation waiting time:', error)
        }
      }
    )
  }
}
