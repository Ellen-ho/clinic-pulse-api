import {
  CONSULTATION_JOB_NAME,
  IConsultationQueueService,
} from '../queue/ConsultationQueueService'
import { ConsultationStatus } from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { AcupunctureTreatment } from '../../domain/treatment/AcupunctureTreatment'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface UpdateConsultationToWaitForBedRequest {
  id: string
  acupunctureTreatment: AcupunctureTreatment
}

export class UpdateConsultationToWaitForBedUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly consultationQueueService: IConsultationQueueService
  ) {}

  public async execute(
    request: UpdateConsultationToWaitForBedRequest
  ): Promise<void> {
    const { id, acupunctureTreatment } = request

    const existingConsultation = await this.consultationRepository.getById(id)

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const updatedStatus = ConsultationStatus.WAITING_FOR_BED_ASSIGNMENT
    const updatedEndAt = new Date()

    existingConsultation.updateToWaitForBed({
      status: updatedStatus,
      endAt: updatedEndAt,
      acupunctureTreatment,
    })

    await this.consultationRepository.save(existingConsultation)

    await this.consultationQueueService.addConsultationJob(
      CONSULTATION_JOB_NAME.CHECK_BED_ASSIGNED_WAITING_TIME,
      { consultationId: existingConsultation.id },
      { delay: 30 * 60 * 1000 }
    )
  }
}
