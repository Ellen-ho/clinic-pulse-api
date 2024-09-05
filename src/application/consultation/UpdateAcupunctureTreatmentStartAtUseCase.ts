import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IAcupunctureTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ConsultationStatus } from '../../domain/consultation/Consultation'

interface UpdateAcupunctureTreatmentStartAtRequest {
  consultationId: string
  needleCounts: number
}

export class UpdateAcupunctureTreatmentStartAtUseCase {
  constructor(
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository,
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: UpdateAcupunctureTreatmentStartAtRequest
  ): Promise<void> {
    const { consultationId, needleCounts } = request

    const existingConsultation = await this.consultationRepository.getById(
      consultationId
    )

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const existingAcupunctureTreatment =
      await this.acupunctureTreatmentRepository.findByConsultationId(
        consultationId
      )

    if (existingAcupunctureTreatment == null) {
      throw new NotFoundError('This acupuncture treatment does not exist.')
    }

    const updatedAcupunctureStartAt = new Date()
    const updatedAcupunctureEndAt = new Date(
      updatedAcupunctureStartAt.getTime() + 15 * 60000
    )

    const updatedStatus = ConsultationStatus.UNDERGOING_ACUPUNCTURE_TREATMENT

    existingConsultation.updateStatus({
      status: updatedStatus,
    })

    existingAcupunctureTreatment.updateAcupunctureTreatmentStartAt({
      startAt: updatedAcupunctureStartAt,
      endAt: updatedAcupunctureEndAt,
      needleCounts,
    })

    await this.consultationRepository.save(existingConsultation)
    await this.acupunctureTreatmentRepository.save(existingAcupunctureTreatment)
  }
}
