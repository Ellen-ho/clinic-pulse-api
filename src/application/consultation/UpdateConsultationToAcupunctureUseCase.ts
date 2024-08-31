import {
  CONSULTATION_JOB_NAME,
  IConsultationQueueService,
} from 'application/queue/ConsultationQueueService'
import { ConsultationStatus } from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { AcupunctureTreatment } from '../../domain/treatment/AcupunctureTreatment'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface UpdateConsultationToAcupunctureRequest {
  id: string
  acupunctureTreatment: AcupunctureTreatment
}

export class UpdateConsultationToAcupunctureUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly consultationQueueService: IConsultationQueueService
  ) {}

  public async execute(
    request: UpdateConsultationToAcupunctureRequest
  ): Promise<void> {
    const { acupunctureTreatment } = request
    const id = '2762e440-3932-47d6-af43-9a5a85888df5'

    const existingConsultation = await this.consultationRepository.getById(id)

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const updatedStatus = ConsultationStatus.WAITING_FOR_BED_ASSIGNMENT
    const updatedStartAt = new Date()

    existingConsultation.updateToAcupuncture({
      status: updatedStatus,
      endAt: updatedStartAt,
      acupunctureTreatment,
    })

    await this.consultationRepository.save(existingConsultation)

    await this.consultationQueueService.addConsultationJob(
      CONSULTATION_JOB_NAME.CHECK_BED_ASSIGNED_WAITING_TIME,
      { consultationId: existingConsultation.id },
      { delay: 1800 * 1000 }
    )
  }
}
