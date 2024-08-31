import { RedisServer } from 'infrastructure/database/RedisServer'
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
  totalAverageConsultationWait: number
  totalAverageBedAssignmentWait: number
  totalAverageAcupunctureWait: number
  totalAverageNeedleRemovalWait: number
  totalAverageMedicationWait: number
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

    await this.redis.set(redisKey, JSON.stringify(result), {
      expiresInSec: 31_536_000,
    })

    return result
  }
}
