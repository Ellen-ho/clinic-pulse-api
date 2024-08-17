import { AcupunctureTreatment } from '../../domain/treatment/AcupunctureTreatment'
import { IAcupunctureTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateAcupunctureTreatmentResponse {
  acupunctureTreatment: AcupunctureTreatment
}

export class CreateAcupunctureTreatmentUseCase {
  constructor(
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(): Promise<CreateAcupunctureTreatmentResponse> {
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
    return { acupunctureTreatment: domainModel }
  }
}
