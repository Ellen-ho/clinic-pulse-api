import { RedisServer } from '../../infrastructure/database/RedisServer'
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
  lastTotalConsultations: number
  lastTotalConsultationWithAcupuncture: number
  lastTotalConsultationWithMedicine: number
  lastTotalConsultationWithBothTreatment: number
  lastTotalOnlyAcupunctureCount: number
  lastTotalOnlyMedicineCount: number
  lastTotalAcupunctureRate: number
  lastTotalMedicineRate: number
  lastOnlyAcupunctureRate: number
  lastOnlyMedicineRate: number
  lastBothTreatmentRate: number
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
  compareTotalConsultations: number
  compareTotalConsultationWithAcupuncture: number
  compareTotalConsultationWithMedicine: number
  compareTotalConsultationWithBothTreatment: number
  compareTotalOnlyAcupunctureCount: number
  compareTotalOnlyMedicineCount: number
  compareTotalAcupunctureRate: number
  compareTotalMedicineRate: number
  compareTotalOnlyAcupunctureRate: number
  compareTotalOnlyMedicineRate: number
  compareTotalBothTreatmentRate: number
  isWithAcupunctureGetMore: boolean
  isWithMedicineGetMore: boolean
  isWithBothGetMore: boolean
  isOnlyAcupunctureGetMore: boolean
  isOnlyMedicineGetMore: boolean
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
    private readonly doctorRepository: IDoctorRepository,
    private readonly redis: RedisServer
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

    let currentDoctorId = doctorId
    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id
    }

    const redisKey = `different_treatments_${currentDoctorId ?? 'allDoctors'}_${
      granularity ?? 'allGranularity'
    }_${startDate}_${endDate}`

    const cachedData = await this.redis.get(redisKey)
    if (cachedData !== null) {
      return JSON.parse(cachedData)
    }

    const result =
      await this.consultationRepository.getDifferentTreatmentConsultation(
        startDate,
        endDate,
        clinicId,
        currentDoctorId,
        timePeriod,
        granularity
      )

    const { lastStartDate, lastEndDate } =
      await this.consultationRepository.getPreviousPeriodDates(
        startDate,
        endDate,
        granularity
      )

    const lastResult =
      await this.consultationRepository.getDifferentTreatmentConsultation(
        lastStartDate,
        lastEndDate,
        clinicId,
        currentDoctorId,
        timePeriod,
        granularity
      )

    const compareTotalConsultations =
      result.totalConsultations - lastResult.totalConsultations
    const compareTotalConsultationWithAcupuncture =
      result.totalConsultationWithAcupuncture -
      lastResult.totalConsultationWithAcupuncture
    const compareTotalConsultationWithMedicine =
      result.totalConsultationWithMedicine -
      lastResult.totalConsultationWithMedicine
    const compareTotalConsultationWithBothTreatment =
      result.totalConsultationWithBothTreatment -
      lastResult.totalConsultationWithBothTreatment
    const compareTotalOnlyAcupunctureCount =
      result.totalOnlyAcupunctureCount - lastResult.totalOnlyAcupunctureCount
    const compareTotalOnlyMedicineCount =
      result.totalOnlyMedicineCount - lastResult.totalOnlyMedicineCount

    const compareTotalAcupunctureRate =
      lastResult.totalAcupunctureRate === 0
        ? result.totalAcupunctureRate > 0
          ? 100
          : 0
        : Math.round(
            ((result.totalAcupunctureRate - lastResult.totalAcupunctureRate) /
              lastResult.totalAcupunctureRate) *
              10000
          ) / 100

    const compareTotalMedicineRate =
      lastResult.totalMedicineRate === 0
        ? result.totalMedicineRate > 0
          ? 100
          : 0
        : Math.round(
            ((result.totalMedicineRate - lastResult.totalMedicineRate) /
              lastResult.totalMedicineRate) *
              10000
          ) / 100

    const compareTotalOnlyAcupunctureRate =
      lastResult.totalOnlyAcupunctureRate === 0
        ? result.totalOnlyAcupunctureRate > 0
          ? 100
          : 0
        : Math.round(
            ((result.totalOnlyAcupunctureRate -
              lastResult.totalOnlyAcupunctureRate) /
              lastResult.totalOnlyAcupunctureRate) *
              10000
          ) / 100

    const compareTotalOnlyMedicineRate =
      lastResult.totalOnlyMedicineRate === 0
        ? result.totalOnlyMedicineRate > 0
          ? 100
          : 0
        : Math.round(
            ((result.totalOnlyMedicineRate - lastResult.totalOnlyMedicineRate) /
              lastResult.totalOnlyMedicineRate) *
              10000
          ) / 100

    const compareTotalBothTreatmentRate =
      lastResult.totalBothTreatmentRate === 0
        ? result.totalBothTreatmentRate > 0
          ? 100
          : 0
        : Math.round(
            ((result.totalBothTreatmentRate -
              lastResult.totalBothTreatmentRate) /
              lastResult.totalBothTreatmentRate) *
              10000
          ) / 100

    const isWithAcupunctureGetMore = compareTotalConsultationWithAcupuncture > 0
    const isWithMedicineGetMore = compareTotalConsultationWithMedicine > 0
    const isWithBothGetMore = compareTotalConsultationWithBothTreatment > 0
    const isOnlyAcupunctureGetMore = compareTotalOnlyAcupunctureCount > 0
    const isOnlyMedicineGetMore = compareTotalOnlyMedicineCount > 0

    const response: GetDifferentTreatmentConsultationResponse = {
      lastTotalConsultations: lastResult.totalConsultations,
      lastTotalConsultationWithAcupuncture:
        lastResult.totalConsultationWithAcupuncture,
      lastTotalConsultationWithMedicine:
        lastResult.totalConsultationWithMedicine,
      lastTotalConsultationWithBothTreatment:
        lastResult.totalConsultationWithBothTreatment,
      lastTotalOnlyAcupunctureCount: lastResult.totalOnlyAcupunctureCount,
      lastTotalOnlyMedicineCount: lastResult.totalOnlyMedicineCount,
      lastTotalAcupunctureRate: lastResult.totalAcupunctureRate,
      lastTotalMedicineRate: lastResult.totalMedicineRate,
      lastOnlyAcupunctureRate: lastResult.totalOnlyAcupunctureRate,
      lastOnlyMedicineRate: lastResult.totalOnlyMedicineRate,
      lastBothTreatmentRate: lastResult.totalBothTreatmentRate,
      totalConsultations: result.totalConsultations,
      totalConsultationWithAcupuncture: result.totalConsultationWithAcupuncture,
      totalConsultationWithMedicine: result.totalConsultationWithMedicine,
      totalConsultationWithBothTreatment:
        result.totalConsultationWithBothTreatment,
      totalOnlyAcupunctureCount: result.totalOnlyAcupunctureCount,
      totalOnlyMedicineCount: result.totalOnlyMedicineCount,
      totalAcupunctureRate: result.totalAcupunctureRate,
      totalMedicineRate: result.totalMedicineRate,
      totalOnlyAcupunctureRate: result.totalOnlyAcupunctureRate,
      totalOnlyMedicineRate: result.totalOnlyMedicineRate,
      totalBothTreatmentRate: result.totalBothTreatmentRate,
      compareTotalConsultations,
      compareTotalConsultationWithAcupuncture,
      compareTotalConsultationWithMedicine,
      compareTotalConsultationWithBothTreatment,
      compareTotalOnlyAcupunctureCount,
      compareTotalOnlyMedicineCount,
      compareTotalAcupunctureRate,
      compareTotalMedicineRate,
      compareTotalOnlyAcupunctureRate,
      compareTotalOnlyMedicineRate,
      compareTotalBothTreatmentRate,
      isWithAcupunctureGetMore,
      isWithMedicineGetMore,
      isWithBothGetMore,
      isOnlyAcupunctureGetMore,
      isOnlyMedicineGetMore,
      data: result.data,
    }

    await this.redis.set(
      `different_treatments_${currentDoctorId ?? 'allDoctors'}_${
        granularity ?? 'allGranularity'
      }_${startDate}_${endDate}`,
      JSON.stringify(response),
      {
        expiresInSec: 31_536_000,
      }
    )

    return response
  }
}
