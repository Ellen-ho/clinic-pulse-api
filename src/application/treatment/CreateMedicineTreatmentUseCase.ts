import { IMedicineTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IMedicineTreatmentRepository'
import { MedicineTreatment } from '../../domain/treatment/MedicineTreatment'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateMedicineTreatmentResponse {
  medicineTreatment: MedicineTreatment
}

export class CreateMedicineTreatmentUseCase {
  constructor(
    private readonly medicineTreatmentRepository: IMedicineTreatmentRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(): Promise<CreateMedicineTreatmentResponse> {
    const newMedicineTreatment = new MedicineTreatment({
      id: this.uuidService.generateUuid(),
      getMedicineAt: null,
    })

    await this.medicineTreatmentRepository.save(newMedicineTreatment)

    return { medicineTreatment: newMedicineTreatment }
  }
}
