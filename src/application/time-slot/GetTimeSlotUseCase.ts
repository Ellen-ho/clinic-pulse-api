import { RoomNumberType } from 'domain/consultationRoom/ConsultationRoom'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { ITimeSlotRepository } from '../../domain/timeSlot/interfaces/repositories/ITimeSlotRepository'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface ITimeSlot {
  id: string
  startAt: Date
  endAt: Date
  timePeriod: TimePeriodType
  clinicId: string
  doctor: {
    id: string
    firstName: string
    lastName: string
  }
  consultationRoom: {
    id: string
    roomNumber: RoomNumberType
  }
}

interface GetTimeSlotRequest {
  clinicId?: string
  currentUser: User
}

interface GetTimeSlotResponse {
  timeSlots: ITimeSlot[]
}

export class GetTimeSlotUseCase {
  constructor(
    private readonly timeSlotRepository: ITimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetTimeSlotRequest
  ): Promise<GetTimeSlotResponse> {
    const { clinicId, currentUser } = request

    let timeSlots: ITimeSlot[] = []

    if (currentUser.role === UserRoleType.ADMIN) {
      if (clinicId === undefined || clinicId === null) {
        throw new NotFoundError('Clinic ID is required for admin users.')
      }

      timeSlots = await this.timeSlotRepository.findByClinicId(clinicId)
    } else if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      if (doctor === null) {
        throw new NotFoundError('Doctor not found.')
      }

      const doctorId = doctor.id

      timeSlots = await this.timeSlotRepository.findByDoctorId(doctorId)
    } else {
      throw new AuthorizationError('Unauthorized access')
    }

    return { timeSlots }
  }
}
