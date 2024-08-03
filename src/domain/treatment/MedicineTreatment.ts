export interface IMedicineTreatmentProps {
  id: string
  getMedicineAt: Date | null
}

export class MedicineTreatment {
  constructor(private readonly props: IMedicineTreatmentProps) {}

  public get id(): string {
    return this.props.id
  }

  public get getMedicineAt(): Date | null {
    return this.props.getMedicineAt
  }
}
