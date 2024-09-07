import { INotificationHelper } from '../../application/notification/NotificationHelper'
import {
  ConsultationStatus,
  OnsiteCancelReasonType,
} from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { NotificationType } from '../../domain/notification/Notification'
import { ITimeSlotRepository } from '../../domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface UpdateConsultationOnsiteCancelAtRequest {
  consultationId: string
  onsiteCancelReason: OnsiteCancelReasonType
}

export class UpdateConsultationOnsiteCancelAtUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly timeSlotRepository: ITimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly userRepository: IUserRepository,
    private readonly notificationHelper: INotificationHelper
  ) {}

  public async execute(
    request: UpdateConsultationOnsiteCancelAtRequest
  ): Promise<void> {
    const { consultationId, onsiteCancelReason } = request

    const existingConsultation = await this.consultationRepository.getById(
      consultationId
    )

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const timeSlot = await this.timeSlotRepository.getById(
      existingConsultation.timeSlotId
    )

    if (timeSlot == null) {
      throw new NotFoundError('This time slot not found.')
    }

    const doctor = await this.doctorRepository.findById(timeSlot.doctorId)

    if (doctor == null) {
      throw new NotFoundError('This doctor not found.')
    }

    const adminUser = await this.userRepository.findAdmin()
    if (adminUser === null) {
      throw new NotFoundError('Admin does not found.')
    }

    const doctorUser = doctor.user

    const updatedStatus = ConsultationStatus.ONSITE_CANCEL
    const updatedOnsiteCancelAt = new Date()

    existingConsultation.updateToOnsiteCancel({
      status: updatedStatus,
      onsiteCancelAt: updatedOnsiteCancelAt,
      onsiteCancelReason,
    })

    await this.consultationRepository.save(existingConsultation)

    const usersToNotify = [doctorUser, adminUser]

    for (const user of usersToNotify) {
      await this.notificationHelper.createNotification({
        title: '患者退掛號',
        content: '有患者現場取消預約。請前往查看門診詳情。',
        notificationType: NotificationType.ONSITE_CANCELLATION,
        referenceId: consultationId,
        user,
      })
    }
  }
}
