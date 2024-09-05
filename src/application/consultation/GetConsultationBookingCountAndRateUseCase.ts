import { Granularity } from '../../domain/common'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { User, UserRoleType } from '../../domain/user/User'
import { RedisServer } from '../../infrastructure/database/RedisServer'

interface GetConsultationBookingCountAndRateRequest {
  startDate: string
  endDate: string
  clinicId?: string
  doctorId?: string
  timePeriod?: TimePeriodType
  granularity?: Granularity
  currentUser: User
}

interface GetConsultationBookingCountAndRateResponse {
  lastConsultations: number
  lastConsultationWithBooking: number
  lastConsiteBookingRate: number
  totalConsultations: number
  consultationWithOnlineBooking: number
  onlineBookingRate: number
  compareConsultations: number
  compareConsultationWithBooking: number
  compareBookingRates: number
  isGetMore: boolean
  data: Array<{
    date: string
    onlineBookingCount: number
    consultationCount: number
    onlineBookingRate: number
  }>
}

export class GetConsultationBookingCountAndRateUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly redis: RedisServer
  ) {}

  public async execute(
    request: GetConsultationBookingCountAndRateRequest
  ): Promise<GetConsultationBookingCountAndRateResponse> {
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

    const redisKey = `online_booking_${currentDoctorId ?? 'allDoctors'}_${
      clinicId ?? 'allClinic'
    }_${timePeriod ?? 'allTimePeriod'}_${
      granularity ?? 'allGranularity'
    }_${startDate}_${endDate}`

    const cachedData = await this.redis.get(redisKey)
    if (cachedData !== null) {
      return JSON.parse(cachedData)
    }

    const result =
      await this.consultationRepository.getDurationBookingByGranularity(
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
      await this.consultationRepository.getDurationBookingByGranularity(
        lastStartDate,
        lastEndDate,
        clinicId,
        currentDoctorId,
        timePeriod,
        granularity
      )

    const compareConsultations =
      result.totalConsultations - lastResult.totalConsultations

    const compareConsultationWithBooking =
      lastResult.consultationWithOnlineBooking === 0
        ? result.consultationWithOnlineBooking > 0
          ? 100
          : 0
        : Math.round(
            ((result.consultationWithOnlineBooking -
              lastResult.consultationWithOnlineBooking) /
              lastResult.consultationWithOnlineBooking) *
              10000
          ) / 100

    const compareBookingRates =
      lastResult.onlineBookingRate === 0
        ? result.onlineBookingRate > 0
          ? 100
          : 0
        : Math.round(
            ((result.onlineBookingRate - lastResult.onlineBookingRate) /
              lastResult.onlineBookingRate) *
              10000
          ) / 100
    const isGetMore = compareBookingRates < 0

    const finalResponse: GetConsultationBookingCountAndRateResponse = {
      lastConsultations: lastResult.totalConsultations,
      lastConsultationWithBooking: lastResult.consultationWithOnlineBooking,
      lastConsiteBookingRate: lastResult.onlineBookingRate,
      totalConsultations: result.totalConsultations,
      consultationWithOnlineBooking: result.consultationWithOnlineBooking,
      onlineBookingRate: result.onlineBookingRate,
      compareConsultations,
      compareConsultationWithBooking,
      compareBookingRates,
      isGetMore,
      data: result.data,
    }

    await this.redis.set(redisKey, JSON.stringify(finalResponse), {
      expiresInSec: 31_536_000,
    })

    return finalResponse
  }
}
