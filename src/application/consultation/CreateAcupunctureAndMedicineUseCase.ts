import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { AcupunctureTreatment } from '../../domain/treatment/AcupunctureTreatment'
import { IAcupunctureTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { IMedicineTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IMedicineTreatmentRepository'
import { MedicineTreatment } from '../../domain/treatment/MedicineTreatment'
import { IUuidService } from '../../domain/utils/IUuidService'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface CreateAcupunctureAndMedicineRequest {
  consultationId: string
}

interface CreateAcupunctureAndMedicineResponse {
  id: string
  acupunctureTreatment: AcupunctureTreatment
}

export class CreateAcupunctureAndMedicineUseCase {
  constructor(
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository,
    private readonly medicineTreatmentRepository: IMedicineTreatmentRepository,
    private readonly consultationRepository: IConsultationRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateAcupunctureAndMedicineRequest
  ): Promise<CreateAcupunctureAndMedicineResponse> {
    const { consultationId } = request
    const existingConsultation = await this.consultationRepository.getById(
      consultationId
    )

    if (existingConsultation === null) {
      throw new NotFoundError('Consultation does not exist.')
    }

    const acupunctureDomainModel = new AcupunctureTreatment({
      id: this.uuidService.generateUuid(),
      startAt: null,
      endAt: null,
      bedId: null,
      assignBedAt: null,
      removeNeedleAt: null,
      needleCounts: null,
    })

    const medicineDomainModel = new MedicineTreatment({
      id: this.uuidService.generateUuid(),
      getMedicineAt: null,
    })

    await this.acupunctureTreatmentRepository.save(acupunctureDomainModel)
    await this.medicineTreatmentRepository.save(medicineDomainModel)
    return {
      id: existingConsultation.id,
      acupunctureTreatment: acupunctureDomainModel,
    }
  }
}
