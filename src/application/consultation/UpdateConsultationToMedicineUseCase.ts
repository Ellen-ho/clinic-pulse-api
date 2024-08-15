import { ConsultationStatus } from 'domain/consultation/Consultation'
import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { MedicineTreatment } from 'domain/treatment/MedicineTreatment'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface UpdateConsultationToMedicineRequest {
  id: string
  medicineTreatment: MedicineTreatment
}

export class UpdateConsultationToMedicineUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: UpdateConsultationToMedicineRequest
  ): Promise<void> {
    const { medicineTreatment } = request
    const id = '6a7815ff-6d51-4351-b765-28b68ce61843'

    const existingConsultation = await this.consultationRepository.getById(id)

    if (existingConsultation == null) {
      throw new NotFoundError('This consultation does not exist.')
    }

    const updatedStatus = ConsultationStatus.IN_CONSULTATION
    const updatedStartAt = new Date()

    existingConsultation.updateToMedicine({
      status: updatedStatus,
      endAt: updatedStartAt,
      medicineTreatment,
    })

    await this.consultationRepository.save(existingConsultation)
  }
}
