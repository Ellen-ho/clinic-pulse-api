export interface IPatientProps {
  id: string
  firstName: string
  lastName: string
  fullName: string
  birthDate: Date
  gender: GenderType
  createdAt: Date
  updatedAt: Date
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}
interface IPatientProfileUpdateData {
  [key: string]: any
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
}

export class Patient {
  constructor(private readonly props: IPatientProps) {}

  public get id(): string {
    return this.props.id
  }

  public get firstName(): string {
    return this.props.firstName
  }

  public get lastName(): string {
    return this.props.lastName
  }

  public get fullName(): string {
    return this.props.fullName
  }

  public get birthDate(): Date {
    return this.props.birthDate
  }

  public get gender(): GenderType {
    return this.props.gender
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public updateData(data: IPatientProfileUpdateData): void {
    this.props.firstName = data.firstName
    this.props.lastName = data.lastName
    this.props.birthDate = data.birthDate
    this.props.gender = data.gender
  }
}
