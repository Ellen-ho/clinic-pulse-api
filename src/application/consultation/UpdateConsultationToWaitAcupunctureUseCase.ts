import { ConsultationStatus } from "domain/consultation/Consultation";
import { IConsultationRepository } from "domain/consultation/interfaces/repositories/IConsultationRepository";
import { NotFoundError } from "infrastructure/error/NotFoundError";
import { formatToUTC8 } from "infrastructure/utils/DateFormatToUTC";

interface UpdateConsultationToWaitAcupunctureRequest {
  id: string;
}

export class UpdateConsultationToWaitAcupunctureUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: UpdateConsultationToWaitAcupunctureRequest
  ): Promise<void> {
    const { id } = request;

    const existingConsultation = await this.consultationRepository.getById(id);

    if (existingConsultation == null) {
      throw new NotFoundError("This consultation does not exist.");
    }

    const updatedStatus = ConsultationStatus.WAITING_FOR_ACUPUNCTURE_TREATMENT;
    const updatedEndAt = formatToUTC8(new Date());

    existingConsultation.updateToCheckOutAt({
      status: updatedStatus,
      checkOutAt: updatedEndAt,
    });

    await this.consultationRepository.save(existingConsultation);
  }
}