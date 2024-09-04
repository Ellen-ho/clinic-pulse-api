import { IMedicineTreatmentRepository } from '../../domain/treatment/interfaces/repositories/IMedicineTreatmentRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { formatToUTC8 } from '../../infrastructure/utils/DateFormatToUTC'

interface UpdateMedicineTreatmentRequest {
  consultationId: string
}

export class UpdateMedicineTreatmentUseCase {
  constructor(
    private readonly medicineTreatmentRepository: IMedicineTreatmentRepository
  ) {}

  public async execute(request: UpdateMedicineTreatmentRequest): Promise<void> {
    const { consultationId } = request

    const existingMedicneTreatment =
      await this.medicineTreatmentRepository.findByConsultationId(
        consultationId
      )

    if (existingMedicneTreatment == null) {
      throw new NotFoundError('This medicine treatment does not exist.')
    }

    const updatedGetMedicineAt = formatToUTC8(new Date())

    existingMedicneTreatment.updateMedicineTreatment({
      getMedicineAt: updatedGetMedicineAt,
    })

    await this.medicineTreatmentRepository.save(existingMedicneTreatment)
  }
}
