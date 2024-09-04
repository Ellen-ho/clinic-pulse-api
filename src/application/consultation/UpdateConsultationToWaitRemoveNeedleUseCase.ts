import {
  CONSULTATION_JOB_NAME,
  IConsultationQueueService,
} from '../../application/queue/ConsultationQueueService'
import { ConsultationStatus } from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

export interface UpdateConsultationToWaitRemoveNeedleRequest {
  id: string
}

export class UpdateConsultationToWaitRemoveNeedleUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly consultationQueueService: IConsultationQueueService
  ) {}

  public async execute(
    request: UpdateConsultationToWaitRemoveNeedleRequest
  ): Promise<void> {
    const { id } = request

    const existingConsultation = await this.consultationRepository.getById(id)

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const updatedStatus = ConsultationStatus.WAITING_FOR_NEEDLE_REMOVAL

    existingConsultation.updateStatus({
      status: updatedStatus,
    })

    await this.consultationRepository.save(existingConsultation)

    await this.consultationQueueService.addConsultationJob(
      CONSULTATION_JOB_NAME.CHECK_NEEDLE_REMOVED_WAITING_TIME,
      { consultationId: existingConsultation.id },
      { delay: 30 * 60 * 1000 }
    )
  }
}
