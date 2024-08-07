import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetDifferentTreatmentConsultationRequest {
  startDate: string
  endDate: string
  clinicId?: string
  doctorId?: string
  timePeriod?: TimePeriodType
}

interface GetDifferentTreatmentConsultationResponse {
  totalConsultations: number
  totalConsultationWithAcupuncture: number
  totalConsultationWithMedicine: number
  totalConsultationWithBothTreatment: number
  totalOnlyAcupunctureCount: number
  totalOnlyMedicineCount: number
  totalAcupunctureRate: number
  totalMedicineRate: number
  totalOnlyAcupunctureRate: number
  totalOnlyMedicineRate: number
  totalBothTreatmentRate: number
  data: Array<{
    date: string
    consultationCount: number
    consultationWithAcupuncture: number
    consultationWithMedicine: number
    consultationWithBothTreatment: number
    acupunctureRate: number
    medicineRate: number
    onlyAcupunctureCount: number
    onlyMedicineCount: number
    onlyAcupunctureRate: number
    onlyMedicineRate: number
    bothTreatmentRate: number
  }>
}

export class GetDifferentTreatmentConsultationUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetDifferentTreatmentConsultationRequest
  ): Promise<GetDifferentTreatmentConsultationResponse> {
    const { startDate, endDate, clinicId, doctorId, timePeriod } = request

    const result =
      await this.consultationRepository.getDifferentTreatmentConsultation(
        startDate,
        endDate,
        clinicId,
        doctorId,
        timePeriod
      )

    if (result.totalConsultations === 0) {
      throw new NotFoundError(
        'No consultation data matches the specified criteria.'
      )
    }

    const totalAcupunctureRate = Math.round(
      (result.totalConsultationWithAcupuncture / result.totalConsultations) *
        100
    )

    const totalMedicineRate = Math.round(
      (result.totalConsultationWithMedicine / result.totalConsultations) * 100
    )

    const totalBothTreatmentRate = Math.round(
      (result.totalConsultationWithBothTreatment / result.totalConsultations) *
        100
    )

    const totalOnlyAcupunctureRate = Math.round(
      (result.totalOnlyAcupunctureCount / result.totalConsultations) * 100
    )

    const totalOnlyMedicineRate = Math.round(
      (result.totalOnlyMedicineCount / result.totalConsultations) * 100
    )

    return {
      totalConsultations: result.totalConsultations,
      totalConsultationWithAcupuncture: result.totalConsultationWithAcupuncture,
      totalConsultationWithMedicine: result.totalConsultationWithMedicine,
      totalConsultationWithBothTreatment:
        result.totalConsultationWithBothTreatment,
      totalOnlyAcupunctureCount: result.totalOnlyAcupunctureCount,
      totalOnlyMedicineCount: result.totalOnlyMedicineCount,
      totalAcupunctureRate,
      totalMedicineRate,
      totalOnlyAcupunctureRate,
      totalOnlyMedicineRate,
      totalBothTreatmentRate,
      data: result.data.map((day) => ({
        date: day.date,
        consultationCount: day.consultationCount,
        consultationWithAcupuncture: day.consultationWithAcupuncture,
        consultationWithMedicine: day.consultationWithMedicine,
        consultationWithBothTreatment: day.consultationWithBothTreatment,
        onlyAcupunctureCount: day.onlyAcupunctureCount,
        onlyMedicineCount: day.onlyMedicineCount,
        acupunctureRate:
          day.consultationCount > 0
            ? Math.round(
                (day.consultationWithAcupuncture / day.consultationCount) * 100
              )
            : 0,
        medicineRate:
          day.consultationCount > 0
            ? Math.round(
                (day.consultationWithMedicine / day.consultationCount) * 100
              )
            : 0,
        onlyAcupunctureRate:
          day.consultationCount > 0
            ? Math.round(
                (day.onlyAcupunctureCount / day.consultationCount) * 100
              )
            : 0,
        onlyMedicineRate:
          day.consultationCount > 0
            ? Math.round((day.onlyMedicineCount / day.consultationCount) * 100)
            : 0,
        bothTreatmentRate:
          day.consultationCount > 0
            ? Math.round(
                (day.consultationWithBothTreatment / day.consultationCount) *
                  100
              )
            : 0,
      })),
    }
  }
}
