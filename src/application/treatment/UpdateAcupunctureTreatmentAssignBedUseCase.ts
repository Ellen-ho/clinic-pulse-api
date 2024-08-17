import { IAcupunctureTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { formatToUTC8 } from '../../infrastructure/utils/DateFormatToUTC'

interface UpdateAcupunctureTreatmentAssignBedRequest {
  id: string
}

export class UpdateAcupunctureTreatmentAssignBedUseCase {
  constructor(
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository
  ) {}

  public async execute(
    request: UpdateAcupunctureTreatmentAssignBedRequest
  ): Promise<void> {
    const id = '6a7815ff-6d51-4351-b765-28b68ce61843'

    const existingAcupunctureTreatment =
      await this.acupunctureTreatmentRepository.getById(id)

    if (existingAcupunctureTreatment == null) {
      throw new NotFoundError('This acupuncture treatment does not exist.')
    }

    const updatedAcupunctureAssignBed = formatToUTC8(new Date())
    const bedId = '6a7815ff-6d51-4351-b765-28b68ce61843'

    existingAcupunctureTreatment.updateAcupunctureTreatmentAssignBed({
      assignBedAt: updatedAcupunctureAssignBed,
      bedId,
    })

    await this.acupunctureTreatmentRepository.save(existingAcupunctureTreatment)
  }
}
