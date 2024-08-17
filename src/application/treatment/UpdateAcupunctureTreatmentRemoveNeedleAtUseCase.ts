import { IAcupunctureTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { formatToUTC8 } from '../../infrastructure/utils/DateFormatToUTC'

interface UpdateAcupunctureTreatmentRemoveNeedleAtRequest {
  id: string
}

export class UpdateAcupunctureTreatmentRemoveNeedleAtUseCase {
  constructor(
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository
  ) {}

  public async execute(
    request: UpdateAcupunctureTreatmentRemoveNeedleAtRequest
  ): Promise<void> {
    const id = '6a7815ff-6d51-4351-b765-28b68ce61843'

    const existingAcupunctureTreatment =
      await this.acupunctureTreatmentRepository.getById(id)

    if (existingAcupunctureTreatment == null) {
      throw new NotFoundError('This acupuncture treatment does not exist.')
    }

    const updatedAcupunctureRemoveNeedleAt = formatToUTC8(new Date())

    existingAcupunctureTreatment.updateAcupunctureTreatmentRemoveNeedleAt({
      removeNeedleAt: updatedAcupunctureRemoveNeedleAt,
    })

    await this.acupunctureTreatmentRepository.save(existingAcupunctureTreatment)
  }
}
