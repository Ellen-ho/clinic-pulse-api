import { ConsultationStatus } from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface UpdateConsultationStartAtRequest {
  consultationId: string
}

interface UpdateConsultationStartAtResponse {
  id: string
  status: ConsultationStatus
  startAt: Date | null
}

export class UpdateConsultationStartAtUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: UpdateConsultationStartAtRequest
  ): Promise<UpdateConsultationStartAtResponse> {
    const { consultationId } = request

    const existingConsultation = await this.consultationRepository.getById(
      consultationId
    )

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    existingConsultation.updateStartAt({
      status: ConsultationStatus.IN_CONSULTATION,
      startAt: new Date(),
    })

    await this.consultationRepository.save(existingConsultation)

    return {
      id: existingConsultation.id,
      status: existingConsultation.status,
      startAt: existingConsultation.startAt,
    }
  }
}
