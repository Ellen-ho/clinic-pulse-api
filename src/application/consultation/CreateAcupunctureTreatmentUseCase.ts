import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { AcupunctureTreatment } from '../../domain/treatment/AcupunctureTreatment'
import { IAcupunctureTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface CreateAcupunctureTreatmentRequest {
  consultationId: string
}

interface CreateAcupunctureTreatmentResponse {
  id: string
  acupunctureTreatment: AcupunctureTreatment
}

export class CreateAcupunctureTreatmentUseCase {
  constructor(
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository,
    private readonly consultationRepository: IConsultationRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateAcupunctureTreatmentRequest
  ): Promise<CreateAcupunctureTreatmentResponse> {
    const { consultationId } = request
    const existingConsultation = await this.consultationRepository.getById(
      consultationId
    )

    if (existingConsultation === null) {
      throw new NotFoundError('Consultation does not exist.')
    }

    const domainModel = new AcupunctureTreatment({
      id: this.uuidService.generateUuid(),
      startAt: null,
      endAt: null,
      bedId: null,
      assignBedAt: null,
      removeNeedleAt: null,
      needleCounts: null,
    })

    await this.acupunctureTreatmentRepository.save(domainModel)
    return {
      id: existingConsultation.id,
      acupunctureTreatment: domainModel,
    }
  }
}
