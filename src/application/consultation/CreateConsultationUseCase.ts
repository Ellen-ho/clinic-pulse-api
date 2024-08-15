import {
  Consultation,
  ConsultationSource,
  ConsultationStatus,
} from 'domain/consultation/Consultation'
import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { ITimeSlotRepository } from 'domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { formatToUTC8 } from 'infrastructure/utils/DateFormatToUTC'

interface CreateConsultationRequest {
  patientId: string
  doctorId: string
}

interface CreateConsultationResponse {
  id: string
}

export class CreateConsultationUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly timeSlotRepository: ITimeSlotRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateConsultationRequest
  ): Promise<CreateConsultationResponse> {
    const checkInAt = new Date()
    const { patientId, doctorId } = request

    const isFirstTimeVisit = await this.consultationRepository.isFirstTimeVisit(
      patientId
    )

    const timeSlotId = await this.timeSlotRepository.findMatchingTimeSlot(
      doctorId,
      checkInAt
    )

    const latestNumber =
      await this.consultationRepository.getLatestOddConsultationNumber(
        timeSlotId.timeSlotId
      )

    const consultationNumber = latestNumber + 2

    const status = ConsultationStatus.WAITING_FOR_CONSULTATION
    const source = ConsultationSource.ONSITE_REGISTRATION

    const newConsultation = new Consultation({
      id: this.uuidService.generateUuid(),
      status,
      source,
      consultationNumber,
      checkInAt: formatToUTC8(new Date()),
      startAt: null,
      endAt: null,
      onsiteCancelAt: null,
      onsiteCancelReason: null,
      isFirstTimeVisit,
      acupunctureTreatment: null,
      medicineTreatment: null,
      patientId,
      timeSlotId: timeSlotId.timeSlotId,
    })

    await this.consultationRepository.save(newConsultation)

    return {
      id: newConsultation.id,
    }
  }
}
