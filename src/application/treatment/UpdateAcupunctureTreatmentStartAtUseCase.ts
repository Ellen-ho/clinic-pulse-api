import { IAcupunctureTreatmentRepository } from "domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository";
import { NotFoundError } from "infrastructure/error/NotFoundError";
import { formatToUTC8 } from "infrastructure/utils/DateFormatToUTC";

interface UpdateAcupunctureTreatmentStartAtRequest {
  id: string;
}

export class UpdateAcupunctureTreatmentStartAtUseCase {
  constructor(
    private readonly acupunctureTreatmentRepository: IAcupunctureTreatmentRepository
  ) {}

  public async execute(
    request: UpdateAcupunctureTreatmentStartAtRequest
  ): Promise<void> {
    const id = "6a7815ff-6d51-4351-b765-28b68ce61843";

    const existingAcupunctureTreatment =
      await this.acupunctureTreatmentRepository.getById(id);

    if (existingAcupunctureTreatment == null) {
      throw new NotFoundError("This acupuncture treatment does not exist.");
    }

    const updatedAcupunctureStartAt = formatToUTC8(new Date());
    const updatedAcupunctureEndAt = formatToUTC8(
      new Date(updatedAcupunctureStartAt.getTime() + 15 * 60000)
    );
    const needleCounts = 10;

    existingAcupunctureTreatment.updateAcupunctureTreatmentStartAt({
      startAt: updatedAcupunctureStartAt,
      endAt: updatedAcupunctureEndAt,
      needleCounts,
    });

    await this.acupunctureTreatmentRepository.save(
      existingAcupunctureTreatment
    );
  }
}
