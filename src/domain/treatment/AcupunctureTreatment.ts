export interface IAcupunctureTreatmentProps {
  id: string
  startAt: Date | null
  endAt: Date | null
  bedId: string | null
  assignBedAt: Date | null
  removeNeedleAt: Date | null
  needleCounts: number | null
}

interface IAcupunctureTreatmentAssignBedUpdate {
  [key: string]: any
  assignBedAt: Date
  bedId: string
}

interface IAcupunctureTreatmentStartAtUpdate {
  [key: string]: any
  startAt: Date
  endAt: Date
  needleCounts: number
}

interface IAcupunctureTreatmentRemoveNeedleAtUpdate {
  [key: string]: any
  removeNeedleAt: Date
}

export class AcupunctureTreatment {
  constructor(private readonly props: IAcupunctureTreatmentProps) {}

  public get id(): string {
    return this.props.id
  }

  public get startAt(): Date | null {
    return this.props.startAt
  }

  public get endAt(): Date | null {
    return this.props.endAt
  }

  public get bedId(): string | null {
    return this.props.bedId
  }

  public get assignBedAt(): Date | null {
    return this.props.assignBedAt
  }

  public get removeNeedleAt(): Date | null {
    return this.props.removeNeedleAt
  }

  public get needleCounts(): number | null {
    return this.props.needleCounts
  }

  public updateAcupunctureTreatmentAssignBed(
    data: IAcupunctureTreatmentAssignBedUpdate
  ): void {
    this.props.assignBedAt = data.assignBedAt
    this.props.bedId = data.bedId
  }

  public updateAcupunctureTreatmentStartAt(
    data: IAcupunctureTreatmentStartAtUpdate
  ): void {
    this.props.startAt = data.startAt
    this.props.endAt = data.endAt
    this.props.needleCounts = data.needleCounts
  }

  public updateAcupunctureTreatmentRemoveNeedleAt(
    data: IAcupunctureTreatmentRemoveNeedleAtUpdate
  ): void {
    this.props.removeNeedleAt = data.removeNeedleAt
  }
}
