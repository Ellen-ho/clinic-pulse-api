export interface IConsultationRoomProps {
  id: string
  clinicId: string
}

export class ConsultationRoom {
  constructor(private readonly props: IConsultationRoomProps) {}

  public get id(): string {
    return this.props.id
  }

  public get clinicId(): string {
    return this.props.clinicId
  }
}
