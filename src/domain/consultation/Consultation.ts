import { AcupunctureTreatment } from '../../domain/treatment/AcupunctureTreatment'
import { MedicineTreatment } from '../../domain/treatment/MedicineTreatment'

export interface IConsultationProps {
  id: string
  status: ConsultationStatus
  source: ConsultationSource
  consultationNumber: number
  checkInAt: Date
  startAt: Date | null
  endAt: Date | null
  checkOutAt: Date | null
  onsiteCancelAt: Date | null
  onsiteCancelReason: OnsiteCancelReasonType | null
  isFirstTimeVisit: boolean
  acupunctureTreatment: AcupunctureTreatment | null
  medicineTreatment: MedicineTreatment | null
  patientId: string
  timeSlotId: string
}

export enum ConsultationSource {
  ONLINE_BOOKING = 'ONLINE_BOOKING',
  ONSITE_REGISTRATION = 'ONSITE_REGISTRATION',
}

export enum ConsultationStatus {
  IN_CONSULTATION = 'IN_CONSULTATION',
  WAITING_FOR_CONSULTATION = 'WAITING_FOR_CONSULTATION',
  WAITING_FOR_BED_ASSIGNMENT = 'WAITING_FOR_BED_ASSIGNMENT',
  WAITING_FOR_ACUPUNCTURE_TREATMENT = 'WAITING_FOR_ACUPUNCTURE_TREATMENT',
  WAITING_FOR_NEEDLE_REMOVAL = 'WAITING_FOR_NEEDLE_REMOVAL',
  WAITING_FOR_GET_MEDICINE = 'WAITING_FOR_GET_MEDICINE',
  ONSITE_CANCEL = 'ONSITE_CANCEL',
  CHECK_OUT = 'CHECK_OUT',
  UNDERGOING_ACUPUNCTURE_TREATMENT = 'UNDERGOING_ACUPUNCTURE_TREATMENT',
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

interface IConsultaionUpdateStartAt {
  [key: string]: any
  status: ConsultationStatus
  startAt: Date
}

interface IConsultaionUpdateToWaitAcupuncture {
  [key: string]: any
  status: ConsultationStatus
}
interface IConsultaionUpdateToWaitForBed {
  [key: string]: any
  status: ConsultationStatus
  endAt: Date
  acupunctureTreatment: AcupunctureTreatment
}

interface IConsultaionUpdateToMedicine {
  [key: string]: any
  status: ConsultationStatus
  endAt: Date
  medicineTreatment: MedicineTreatment
}

interface IConsultaionUpdateCheckOutAt {
  [key: string]: any
  status: ConsultationStatus
  checkOutAt: Date
}

interface IConsultaionUpdateStatus {
  [key: string]: any
  status: ConsultationStatus
}

interface IConsultaionUpdateToOnsiteCancel {
  [key: string]: any
  status: ConsultationStatus
  onsiteCancelAt: Date
  onsiteCancelReason: OnsiteCancelReasonType
}

export class Consultation {
  constructor(private readonly props: IConsultationProps) {}

  public get id(): string {
    return this.props.id
  }

  public get status(): ConsultationStatus {
    return this.props.status
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

  public get checkOutAt(): Date | null {
    return this.props.checkOutAt
  }

  public get onsiteCancelAt(): Date | null {
    return this.props.onsiteCancelAt
  }

  public get isFirstTimeVisit(): boolean {
    return this.props.isFirstTimeVisit
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

  public updateStartAt(data: IConsultaionUpdateStartAt): void {
    this.props.status = data.status
    this.props.startAt = data.startAt
  }

  public updateToWaitAcupuncture(
    data: IConsultaionUpdateToWaitAcupuncture
  ): void {
    this.props.status = data.status
  }

  public updateToWaitForBed(data: IConsultaionUpdateToWaitForBed): void {
    this.props.status = data.status
    this.props.endAt = data.endAt
    this.props.acupunctureTreatment = data.acupunctureTreatment
  }

  public updateToMedicine(data: IConsultaionUpdateToMedicine): void {
    this.props.status = data.status
    this.props.endAt = data.endAt
    this.props.medicineTreatment = data.medicineTreatment
  }

  public updateToCheckOutAt(data: IConsultaionUpdateCheckOutAt): void {
    this.props.status = data.status
    this.props.checkOutAt = data.checkOutAt
  }

  public updateToOnsiteCancel(data: IConsultaionUpdateToOnsiteCancel): void {
    this.props.status = data.status
    this.props.onsiteCancelAt = data.onsiteCancelAt
    this.props.onsiteCancelReason = data.onsiteCancelReason
  }

  public updateStatus(data: IConsultaionUpdateStatus): void {
    this.props.status = data.status
  }
}
