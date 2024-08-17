import { ConsultationStatus } from 'domain/consultation/Consultation'
import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { NotFoundError } from 'infrastructure/error/NotFoundError'
import { formatToUTC8 } from 'infrastructure/utils/DateFormatToUTC'

interface UpdateConsultationCheckOutAtRequest {
  id: string
}

export class UpdateConsultationCheckOutAtUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: UpdateConsultationCheckOutAtRequest
  ): Promise<void> {
    const { id } = request

    const existingConsultation = await this.consultationRepository.getById(id)

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const updatedStatus = ConsultationStatus.CHECK_OUT
    const updatedCheckOutAt = formatToUTC8(new Date())

    existingConsultation.updateToCheckOutAt({
      status: updatedStatus,
      checkOutAt: updatedCheckOutAt,
    })

    await this.consultationRepository.save(existingConsultation)
  }
}
