export interface ITimeSlotProps {
  id: string
  startAt: Date
  endAt: Date
  timePeriod: TimePeriodType
  createdAt: Date
  updatedAt: Date
  doctorId: string
  clinicId: string
  consultationRoomId: string
}

export enum TimePeriodType {
  MORNING_SESSION = 'MORNING_SESSION',
  AFTERNOON_SESSION = 'AFTERNOON_SESSION',
  EVENING_SESSION = 'EVENING_SESSION',
}

export class TimeSlot {
  constructor(private readonly props: ITimeSlotProps) {}

  public get id(): string {
    return this.props.id
  }

  public get startAt(): Date {
    return this.props.startAt
  }

  public get endAt(): Date {
    return this.props.endAt
  }

  public get timePeriod(): TimePeriodType {
    return this.props.timePeriod
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get doctorId(): string {
    return this.props.doctorId
  }

  public get clinicId(): string {
    return this.props.clinicId
  }

  public get consultationRoomId(): string {
    return this.props.consultationRoomId
  }
}
