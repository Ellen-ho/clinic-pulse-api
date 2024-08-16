export interface IMedicineTreatmentProps {
  id: string
  getMedicineAt: Date | null
}

interface IMedicineTreatmentUpdate {
  [key: string]: any
  getMedicineAt: Date
}

export class MedicineTreatment {
  constructor(private readonly props: IMedicineTreatmentProps) {}

  public get id(): string {
    return this.props.id
  }

  public get getMedicineAt(): Date | null {
    return this.props.getMedicineAt
  }

  public updateMedicineTreatment(data: IMedicineTreatmentUpdate): void {
    this.props.getMedicineAt = data.getMedicineAt
  }
}
