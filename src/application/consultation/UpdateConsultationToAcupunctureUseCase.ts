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
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: UpdateConsultationToAcupunctureRequest
  ): Promise<void> {
    const { acupunctureTreatment } = request
    const id = '6a7815ff-6d51-4351-b765-28b68ce61843'

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
  }
}
