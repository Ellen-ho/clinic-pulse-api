import { AcupunctureTreatment } from 'domain/treatment/AcupunctureTreatment'
import { MedicineTreatment } from 'domain/treatment/MedicineTreatment'

export interface IConsultationProps {
  id: string
  source: ConsultationSource
  consultationNumber: number
  checkInAt: Date
  startAt: Date | null
  endAt: Date | null
  onsiteCancelAt: Date | null
  onsiteCancelReason: OnsiteCancelReasonType | null
  acupunctureTreatment: AcupunctureTreatment | null
  medicineTreatment: MedicineTreatment | null
  patientId: string
  timeSlotId: string
}

export enum ConsultationSource {
  ONLINE_BOOKING = 'ONLINE_BOOKING',
  ONSITE_REGISTRATION = 'ONSITE_REGISTRATION',
}

export enum TreatmentType {
  ACUPUNTURE_TREATMENT = 'ACUPUNTURE_TREATMENT',
  MEDICINE_TREATMENT = 'MEDICINE_TREATMENT',
  BOTH_TREATMENT = 'BOTH_TREATMENT',
  NO_TREATMENT = 'NO_TREATMENT',
}

export enum OnsiteCancelReasonType {
  LONG_WAITING_TIME = 'LONG_WAITING_TIME',
  SERVICE_DISSATISFACTION = 'SERVICE_DISSATISFACTION',
  PERSONAL_EMERGENCY = 'PERSONAL_EMERGENCY',
  NO_PARKING_SPACES = 'NO_PARKING_SPACES',
}

export class Consultation {
  constructor(private readonly props: IConsultationProps) {}

  public get id(): string {
    return this.props.id
  }

  public get source(): ConsultationSource {
    return this.props.source
  }

  public get consultationNumber(): number {
    return this.props.consultationNumber
  }

  public get checkInAt(): Date {
    return this.props.checkInAt
  }

  public get startAt(): Date | null {
    return this.props.startAt
  }

  public get endAt(): Date | null {
    return this.props.endAt
  }

  public get checkOutAt(): Date {
    return this.props.checkInAt
  }

  public get onsiteCancelAt(): Date | null {
    return this.props.onsiteCancelAt
  }

  public get onsiteCancelReason(): OnsiteCancelReasonType | null {
    return this.props.onsiteCancelReason
  }

  public get acupunctureTreatment(): AcupunctureTreatment | null {
    return this.props.acupunctureTreatment
  }

  public get medicineTreatment(): MedicineTreatment | null {
    return this.props.medicineTreatment
  }

  public get patientId(): string {
    return this.props.patientId
  }

  public get timeSlotId(): string {
    return this.props.timeSlotId
  }
}
