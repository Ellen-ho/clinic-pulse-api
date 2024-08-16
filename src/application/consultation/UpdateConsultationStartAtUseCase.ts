import { ConsultationStatus } from 'domain/consultation/Consultation'
import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { NotFoundError } from 'infrastructure/error/NotFoundError'
import { formatToUTC8 } from 'infrastructure/utils/DateFormatToUTC'

interface UpdateConsultationStartAtRequest {
  id: string
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
    const { id } = request

    const existingConsultation = await this.consultationRepository.getById(id)

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const updatedStatus = ConsultationStatus.IN_CONSULTATION
    const updatedStartAt = formatToUTC8(new Date())
    console.table({
      toLocaleTimeString: updatedStartAt.toLocaleTimeString,
      toISOString: updatedStartAt.toISOString(),
    })

    existingConsultation.updateStartAt({
      status: updatedStatus,
      startAt: updatedStartAt,
    })

    await this.consultationRepository.save(existingConsultation)

    return {
      id: existingConsultation.id,
      status: existingConsultation.status,
      startAt: existingConsultation.startAt,
    }
  }
}
