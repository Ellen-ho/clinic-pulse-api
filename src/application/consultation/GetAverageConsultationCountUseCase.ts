import { RedisServer } from '../../infrastructure/database/RedisServer'
import { Granularity } from '../../domain/common'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { ITimeSlotRepository } from '../../domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetAverageConsultationCountRequest {
  startDate: string
  endDate: string
  clinicId?: string
  doctorId?: string
  timePeriod?: TimePeriodType
  granularity?: Granularity
  currentUser: User
}

interface GetAverageConsultationCountResponse {
  lastTotalCount: number
  lastAverageCount: number
  lastTotalSlots: number
  compareTotalCount: number
  compareAverageCount: number
  compareSlots: number
  isTotalGetMore: boolean
  isAverageGetMore: boolean
  compareTotalRate: number
  compareAverageRate: number
  compareSlotRate: number
  totalConsultations: number
  totalSlots: number
  averagePatientPerSlot: number
  data: Array<{
    date: string
    consultationCount: number
    timeSlotCount: number
    averageCount: number
  }>
}

export class GetAverageConsultationCountUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly timeSlotRepository: ITimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly redis: RedisServer
  ) {}

  public async execute(
    request: GetAverageConsultationCountRequest
  ): Promise<GetAverageConsultationCountResponse> {
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

    const redisKey = `average_counts_${currentDoctorId ?? 'allDoctors'}_${
      clinicId ?? 'allClinic'
    }_${timePeriod ?? 'allTimePeriod'}_${
      granularity ?? 'allGranularity'
    }_${startDate}_${endDate}`

    const cachedData = await this.redis.get(redisKey)
    if (cachedData !== null) {
      return JSON.parse(cachedData)
    }

    const consultaionResult =
      await this.consultationRepository.getDurationCountByGranularity(
        startDate,
        endDate,
        clinicId,
        currentDoctorId,
        timePeriod,
        granularity
      )

    const timeSlotResult =
      await this.timeSlotRepository.getDurationCountByGranularity(
        startDate,
        endDate,
        clinicId,
        currentDoctorId,
        timePeriod,
        granularity
      )

    if (timeSlotResult.totalTimeSlots === 0) {
      return {
        lastTotalCount: 0,
        lastAverageCount: 0,
        lastTotalSlots: 0,
        compareTotalCount: 0,
        compareAverageCount: 0,
        compareSlots: 0,
        isTotalGetMore: false,
        isAverageGetMore: false,
        compareTotalRate: 0,
        compareAverageRate: 0,
        compareSlotRate: 0,
        totalConsultations: 0,
        totalSlots: 0,
        averagePatientPerSlot: 0,
        data: [],
      }
    }

    const mergedData = consultaionResult.data.map((consultationItem) => {
      const timeSlotItem = timeSlotResult.data.find(
        (slot) => slot.date === consultationItem.date
      )

      if (
        timeSlotItem === undefined ||
        timeSlotItem === null ||
        timeSlotItem.timeSlotCount === 0
      ) {
        throw new NotFoundError('Matching slot not found.')
      }

      const averageCount = Math.round(
        consultationItem.consultationCount / timeSlotItem.timeSlotCount
      )

      return {
        date: consultationItem.date,
        consultationCount: consultationItem.consultationCount,
        timeSlotCount: timeSlotItem.timeSlotCount,
        averageCount,
      }
    })

    const response = {
      totalConsultations: consultaionResult.totalConsultations,
      totalSlots: timeSlotResult.totalTimeSlots,
      averagePatientPerSlot: Math.round(
        consultaionResult.totalConsultations / timeSlotResult.totalTimeSlots
      ),
      data: mergedData,
    }

    const { lastStartDate, lastEndDate } =
      await this.consultationRepository.getPreviousPeriodDates(
        startDate,
        endDate,
        granularity
      )

    const lastConsultationResult =
      await this.consultationRepository.getDurationCountByGranularity(
        lastStartDate,
        lastEndDate,
        clinicId,
        currentDoctorId,
        timePeriod,
        granularity
      )

    const lastTimeSlotResult =
      await this.timeSlotRepository.getDurationCountByGranularity(
        lastStartDate,
        lastEndDate,
        clinicId,
        currentDoctorId,
        timePeriod,
        granularity
      )

    const lastTotalCount = lastConsultationResult.totalConsultations
    const lastTotalSlots = lastTimeSlotResult.totalTimeSlots
    const lastAverageCount =
      lastTotalSlots !== 0 ? Math.round(lastTotalCount / lastTotalSlots) : 0

    const compareTotalCount = response.totalConsultations - lastTotalCount
    const compareAverageCount =
      response.averagePatientPerSlot - lastAverageCount
    const compareSlots = response.totalSlots - lastTotalSlots

    const isTotalGetMore = compareTotalCount > 0
    const isAverageGetMore = compareAverageCount > 0

    const compareTotalRate =
      lastTotalCount === 0
        ? compareTotalCount > 0
          ? 100
          : 0
        : Math.round((compareTotalCount / lastTotalCount) * 10000) / 100

    const compareAverageRate =
      lastAverageCount === 0
        ? compareAverageCount > 0
          ? 100
          : 0
        : Math.round((compareAverageCount / lastAverageCount) * 10000) / 100

    const compareSlotRate =
      lastTotalSlots === 0
        ? compareSlots > 0
          ? 100
          : 0
        : Math.round((compareSlots / lastTotalSlots) * 10000) / 100

    const finalResponse = {
      ...response,
      lastTotalCount,
      lastAverageCount,
      lastTotalSlots,
      compareTotalCount,
      compareAverageCount,
      compareSlots,
      isTotalGetMore,
      isAverageGetMore,
      compareTotalRate,
      compareAverageRate,
      compareSlotRate,
    }

    await this.redis.set(redisKey, JSON.stringify(finalResponse), {
      expiresInSec: 31_536_000,
    })

    return finalResponse
  }
}
