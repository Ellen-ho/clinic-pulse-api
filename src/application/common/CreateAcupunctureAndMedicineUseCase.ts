import { AcupunctureTreatment } from '../../domain/treatment/AcupunctureTreatment'
import { IAcupunctureTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { IMedicineTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IMedicineTreatmentRepository'
import { MedicineTreatment } from '../../domain/treatment/MedicineTreatment'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateAcupunctureAndMedicineResponse {
  acupunctureTreatment: AcupunctureTreatment
  medicineTreatment: MedicineTreatment
}

export class CreateAcupunctureAndMedicineUseCase {
  constructor(
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository,
    private readonly medicineTreatmentRepository: IMedicineTreatmentRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(): Promise<CreateAcupunctureAndMedicineResponse> {
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
      acupunctureTreatment: acupunctureDomainModel,
      medicineTreatment: medicineDomainModel,
    }
  }
}
