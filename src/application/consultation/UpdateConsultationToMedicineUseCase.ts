import {
  CONSULTATION_JOB_NAME,
  IConsultationQueueService,
} from 'application/queue/ConsultationQueueService'
import { ConsultationStatus } from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { MedicineTreatment } from '../../domain/treatment/MedicineTreatment'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface UpdateConsultationToMedicineRequest {
  id: string
  medicineTreatment: MedicineTreatment
}

export class UpdateConsultationToMedicineUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly consultationQueueService: IConsultationQueueService
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

    const updatedStatus = ConsultationStatus.WAITING_FOR_GET_MEDICINE
    const updatedStartAt = new Date()

    existingConsultation.updateToMedicine({
      status: updatedStatus,
      endAt: updatedStartAt,
      medicineTreatment,
    })

    await this.consultationRepository.save(existingConsultation)

    await this.consultationQueueService.addConsultationJob(
      CONSULTATION_JOB_NAME.CHECK_MEDICINE_WAITING_TIME,
      { consultationId: existingConsultation.id },
      { delay: 3600 * 1000 }
    )
  }
}
