import { RedisServer } from '../../infrastructure/database/RedisServer'
import { Granularity } from '../../domain/common'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { User, UserRoleType } from '../../domain/user/User'

interface GetAverageWaitingTimeRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  doctorId?: string
  patientId?: string
  granularity?: Granularity
  currentUser: User
}

interface GetAverageWaitingTimeResponse {
  lastAverageConsultationWait: number
  lastAverageBedAssignmentWait: number
  lastAverageAcupunctureWait: number
  lastAverageNeedleRemovalWait: number
  lastAverageMedicationWait: number
  totalAverageConsultationWait: number
  totalAverageBedAssignmentWait: number
  totalAverageAcupunctureWait: number
  totalAverageNeedleRemovalWait: number
  totalAverageMedicationWait: number
  compareAverageConsultationWait: number
  compareAverageBedAssignmentWait: number
  compareAverageAcupunctureWait: number
  compareAverageNeedleRemovalWait: number
  compareAverageMedicationWait: number
  isAverageConsultationWaitCutDown: boolean
  isAverageBedAssignmentWaitCutDown: boolean
  isAverageAcupunctureWaitCutDown: boolean
  isAverageNeedleRemovalWaitCutDown: boolean
  isAverageMedicationWaitCutDown: boolean
  compareAverageConsultationWaitRate: number
  compareAverageBedAssignmentWaitRate: number
  compareAverageAcupunctureWaitRate: number
  compareAverageNeedleRemovalWaitRate: number
  compareAverageMedicationWaitRate: number
  data: Array<{
    date: string
    averageConsultationWait: number
    averageBedAssignmentWait: number
    averageAcupunctureWait: number
    averageNeedleRemovalWait: number
    averageMedicationWait: number
  }>
}

export class GetAverageWaitingTimeUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly redis: RedisServer
  ) {}

  public async execute(
    request: GetAverageWaitingTimeRequest
  ): Promise<GetAverageWaitingTimeResponse> {
    const {
      startDate,
      endDate,
      clinicId,
      timePeriod,
      doctorId,
      patientId,
      granularity,
      currentUser,
    } = request

    let currentDoctorId = doctorId
    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      currentDoctorId = doctor?.id
    }

    const redisKey = `average_waiting_time_${currentDoctorId ?? 'allDoctors'}_${
      clinicId ?? 'allClinic'
    }_${timePeriod ?? 'allTimePeriod'}_${
      granularity ?? 'allGranularity'
    }_${startDate}_${endDate}`

    const cachedData = await this.redis.get(redisKey)
    if (cachedData !== null) {
      return JSON.parse(cachedData)
    }

    const result = await this.consultationRepository.getAverageWaitingTime(
      startDate,
      endDate,
      clinicId,
      timePeriod,
      currentDoctorId,
      patientId,
      granularity
    )

    const { lastStartDate, lastEndDate } =
      await this.consultationRepository.getPreviousPeriodDates(
        startDate,
        endDate,
        granularity
      )

    const lastResult = await this.consultationRepository.getAverageWaitingTime(
      lastStartDate,
      lastEndDate,
      clinicId,
      timePeriod,
      currentDoctorId,
      patientId,
      granularity
    )

    const {
      totalAverageConsultationWait,
      totalAverageBedAssignmentWait,
      totalAverageAcupunctureWait,
      totalAverageNeedleRemovalWait,
      totalAverageMedicationWait,
    } = result

    const {
      totalAverageConsultationWait: lastAverageConsultationWait,
      totalAverageBedAssignmentWait: lastAverageBedAssignmentWait,
      totalAverageAcupunctureWait: lastAverageAcupunctureWait,
      totalAverageNeedleRemovalWait: lastAverageNeedleRemovalWait,
      totalAverageMedicationWait: lastAverageMedicationWait,
    } = lastResult

    const compareAverageConsultationWait =
      totalAverageConsultationWait - lastAverageConsultationWait
    const compareAverageBedAssignmentWait =
      totalAverageBedAssignmentWait - lastAverageBedAssignmentWait
    const compareAverageAcupunctureWait =
      totalAverageAcupunctureWait - lastAverageAcupunctureWait
    const compareAverageNeedleRemovalWait =
      totalAverageNeedleRemovalWait - lastAverageNeedleRemovalWait
    const compareAverageMedicationWait =
      totalAverageMedicationWait - lastAverageMedicationWait

    const isAverageConsultationWaitCutDown = compareAverageConsultationWait < 0
    const isAverageBedAssignmentWaitCutDown =
      compareAverageBedAssignmentWait < 0
    const isAverageAcupunctureWaitCutDown = compareAverageAcupunctureWait < 0
    const isAverageNeedleRemovalWaitCutDown =
      compareAverageNeedleRemovalWait < 0
    const isAverageMedicationWaitCutDown = compareAverageMedicationWait < 0

    const compareAverageConsultationWaitRate =
      lastAverageConsultationWait === 0
        ? compareAverageConsultationWait > 0
          ? 100
          : 0
        : Math.round(
            (compareAverageConsultationWait / lastAverageConsultationWait) *
              10000
          ) / 100

    const compareAverageBedAssignmentWaitRate =
      lastAverageBedAssignmentWait === 0
        ? compareAverageBedAssignmentWait > 0
          ? 100
          : 0
        : Math.round(
            (compareAverageBedAssignmentWait / lastAverageBedAssignmentWait) *
              10000
          ) / 100

    const compareAverageAcupunctureWaitRate =
      lastAverageAcupunctureWait === 0
        ? compareAverageAcupunctureWait > 0
          ? 100
          : 0
        : Math.round(
            (compareAverageAcupunctureWait / lastAverageAcupunctureWait) * 10000
          ) / 100

    const compareAverageNeedleRemovalWaitRate =
      lastAverageNeedleRemovalWait === 0
        ? compareAverageNeedleRemovalWait > 0
          ? 100
          : 0
        : Math.round(
            (compareAverageNeedleRemovalWait / lastAverageNeedleRemovalWait) *
              10000
          ) / 100

    const compareAverageMedicationWaitRate =
      lastAverageMedicationWait === 0
        ? compareAverageMedicationWait > 0
          ? 100
          : 0
        : Math.round(
            (compareAverageMedicationWait / lastAverageMedicationWait) * 10000
          ) / 100

    const finalResponse = {
      lastAverageConsultationWait,
      lastAverageBedAssignmentWait,
      lastAverageAcupunctureWait,
      lastAverageNeedleRemovalWait,
      lastAverageMedicationWait,
      totalAverageConsultationWait,
      totalAverageBedAssignmentWait,
      totalAverageAcupunctureWait,
      totalAverageNeedleRemovalWait,
      totalAverageMedicationWait,
      compareAverageConsultationWait,
      compareAverageBedAssignmentWait,
      compareAverageAcupunctureWait,
      compareAverageNeedleRemovalWait,
      compareAverageMedicationWait,
      isAverageConsultationWaitCutDown,
      isAverageBedAssignmentWaitCutDown,
      isAverageAcupunctureWaitCutDown,
      isAverageNeedleRemovalWaitCutDown,
      isAverageMedicationWaitCutDown,
      compareAverageConsultationWaitRate,
      compareAverageBedAssignmentWaitRate,
      compareAverageAcupunctureWaitRate,
      compareAverageNeedleRemovalWaitRate,
      compareAverageMedicationWaitRate,
      data: result.data,
    }

    await this.redis.set(redisKey, JSON.stringify(finalResponse), {
      expiresInSec: 31_536_000,
    })

    return finalResponse
  }
}
