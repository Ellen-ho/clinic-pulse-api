export interface IAcupunctureTreatmentProps {
  id: string
  startAt: Date | null
  endAt: Date | null
  bedId: string | null
  assignBedAt: Date | null
  removeNeedleAt: Date | null
  needleCounts: number | null
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
}
