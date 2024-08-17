import { Granularity } from '../../domain/common'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { User, UserRoleType } from '../../domain/user/User'

interface GetDifferentTreatmentConsultationRequest {
  startDate: string
  endDate: string
  clinicId?: string
  doctorId?: string
  timePeriod?: TimePeriodType
  granularity?: Granularity
  currentUser: User
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
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetDifferentTreatmentConsultationRequest
  ): Promise<GetDifferentTreatmentConsultationResponse> {
    const {
      startDate,
      endDate,
      clinicId,
      doctorId,
      timePeriod,
      granularity,
      currentUser,
    } = request

    let currentDoctorId
    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id
    }

    const result =
      await this.consultationRepository.getDifferentTreatmentConsultation(
        startDate,
        endDate,
        clinicId,
        currentDoctorId !== undefined ? currentDoctorId : doctorId,
        timePeriod,
        granularity
      )

    if (result.totalConsultations === 0) {
      return {
        totalConsultations: 0,
        totalConsultationWithAcupuncture: 0,
        totalConsultationWithMedicine: 0,
        totalConsultationWithBothTreatment: 0,
        totalOnlyAcupunctureCount: 0,
        totalOnlyMedicineCount: 0,
        totalAcupunctureRate: 0,
        totalMedicineRate: 0,
        totalOnlyAcupunctureRate: 0,
        totalOnlyMedicineRate: 0,
        totalBothTreatmentRate: 0,
        data: [],
      }
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
