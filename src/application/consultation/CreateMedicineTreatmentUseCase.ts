import { NotFoundError } from 'infrastructure/error/NotFoundError'
import { IMedicineTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IMedicineTreatmentRepository'
import { MedicineTreatment } from '../../domain/treatment/MedicineTreatment'
import { IUuidService } from '../../domain/utils/IUuidService'
import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'

interface CreateMedicineTreatmentRequest {
  consultationId: string
}

interface CreateMedicineTreatmentResponse {
  id: string
  medicineTreatment: MedicineTreatment
}

export class CreateMedicineTreatmentUseCase {
  constructor(
    private readonly medicineTreatmentRepository: IMedicineTreatmentRepository,
    private readonly consultationRepository: IConsultationRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateMedicineTreatmentRequest
  ): Promise<CreateMedicineTreatmentResponse> {
    const { consultationId } = request
    const existingConsultation = await this.consultationRepository.getById(
      consultationId
    )

    if (existingConsultation === null) {
      throw new NotFoundError('Consultation does not exist.')
    }

    const newMedicineTreatment = new MedicineTreatment({
      id: this.uuidService.generateUuid(),
      getMedicineAt: null,
    })

    await this.medicineTreatmentRepository.save(newMedicineTreatment)

    return {
      id: existingConsultation.id,
      medicineTreatment: newMedicineTreatment,
    }
  }
}
