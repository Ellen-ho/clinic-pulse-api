export interface IConsultationRoomProps {
  id: string
  roomNumber: RoomNumberType
  clinicId: string
}

export enum RoomNumberType {
  ROOM_ONE = '1',
  ROOM_TWO = '2',
}

export class ConsultationRoom {
  constructor(private readonly props: IConsultationRoomProps) {}

  public get id(): string {
    return this.props.id
  }

  public get roomNumber(): RoomNumberType {
    return this.props.roomNumber
  }

  public get clinicId(): string {
    return this.props.clinicId
  }
}
