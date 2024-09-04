import { IAcupunctureTreatmentRepository } from 'domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import {
  CONSULTATION_JOB_NAME,
  IConsultationQueueService,
} from '../../application/queue/ConsultationQueueService'
import { ConsultationStatus } from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface UpdateConsultationToWaitAcupunctureRequest {
  consultationId: string
  bedId: string
}

export class UpdateConsultationToWaitAcupunctureUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository,
    private readonly consultationQueueService: IConsultationQueueService
  ) {}

  public async execute(
    request: UpdateConsultationToWaitAcupunctureRequest
  ): Promise<void> {
    const { consultationId, bedId } = request

    const existingConsultation = await this.consultationRepository.getById(
      consultationId
    )

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const acupunctureTreatment =
      await this.acupunctureTreatmentRepository.findByConsultationId(
        consultationId
      )

    if (acupunctureTreatment == null) {
      throw new NotFoundError(
        'No acupuncture treatment associated with this consultation.'
      )
    }

    const updatedStatus = ConsultationStatus.WAITING_FOR_ACUPUNCTURE_TREATMENT
    const updatedAcupunctureAssignBed = new Date()

    existingConsultation.updateToWaitAcupuncture({
      status: updatedStatus,
    })

    acupunctureTreatment.updateAcupunctureTreatmentAssignBed({
      assignBedAt: updatedAcupunctureAssignBed,
      bedId,
    })

    await this.consultationRepository.save(existingConsultation)
    await this.acupunctureTreatmentRepository.save(acupunctureTreatment)

    await this.consultationQueueService.addConsultationJob(
      CONSULTATION_JOB_NAME.CHECK_ACUPUNCTURE_WAITING_TIME,
      { consultationId: existingConsultation.id },
      { delay: 30 * 60 * 1000 }
    )
  }
}
