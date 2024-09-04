import { IAcupunctureTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface UpdateAcupunctureTreatmentRemoveNeedleAtRequest {
  consultationId: string
}

export class UpdateAcupunctureTreatmentRemoveNeedleAtUseCase {
  constructor(
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository
  ) {}

  public async execute(
    request: UpdateAcupunctureTreatmentRemoveNeedleAtRequest
  ): Promise<void> {
    const { consultationId } = request

    const existingAcupunctureTreatment =
      await this.acupunctureTreatmentRepository.findByConsultationId(
        consultationId
      )

    if (existingAcupunctureTreatment == null) {
      throw new NotFoundError('This acupuncture treatment does not exist.')
    }

    const updatedAcupunctureRemoveNeedleAt = new Date()

    existingAcupunctureTreatment.updateAcupunctureTreatmentRemoveNeedleAt({
      removeNeedleAt: updatedAcupunctureRemoveNeedleAt,
    })

    await this.acupunctureTreatmentRepository.save(existingAcupunctureTreatment)
  }
}
