import { ConsultationStatus } from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

export interface UpdateConsultationCheckOutAtRequest {
  consultationId: string
}

export class UpdateConsultationCheckOutAtUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: UpdateConsultationCheckOutAtRequest
  ): Promise<void> {
    const { consultationId } = request

    const existingConsultation = await this.consultationRepository.getById(
      consultationId
    )

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const updatedStatus = ConsultationStatus.CHECK_OUT

    existingConsultation.updateToCheckOutAt({
      status: updatedStatus,
      checkOutAt: new Date(),
    })

    await this.consultationRepository.save(existingConsultation)
  }
}
