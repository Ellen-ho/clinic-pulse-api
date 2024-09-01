import { GenderType } from '../../domain/common'
import { User } from '../user/User'

export interface IDoctorProps {
  id: string
  avatar: string | null
  firstName: string
  lastName: string
  gender: GenderType
  birthDate: Date
  onboardDate: Date
  resignationDate: Date | null
  user: User
}

interface IAvatarUpdated {
  [key: string]: any
  avatar: string
}

export class Doctor {
  constructor(private readonly props: IDoctorProps) {}

  public get id(): string {
    return this.props.id
  }

  public get avatar(): string | null {
    return this.props.avatar
  }

  public get firstName(): string {
    return this.props.firstName
  }

  public get lastName(): string {
    return this.props.lastName
  }

  public get gender(): GenderType {
    return this.props.gender
  }

  public get birthDate(): Date {
    return this.props.birthDate
  }

  public get onboardDate(): Date {
    return this.props.onboardDate
  }

  public get resignationDate(): Date | null {
    return this.props.resignationDate
  }

  public get user(): User {
    return this.props.user
  }

  public updateAvatar(data: IAvatarUpdated): void {
    this.props.avatar = data.avatar
  }
}
