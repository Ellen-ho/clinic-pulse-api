export interface IAddress {
  line1: string
  line2?: string
  city: string
  stateProvince?: string
  postalCode?: string
  country: string
  countryCode: string
}

export interface IClinicProps {
  id: string
  name: string
  address: IAddress
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}

export class Clinic {
  constructor(private readonly props: IClinicProps) {}

  public get id(): string {
    return this.props.id
  }

  public get name(): string {
    return this.props.name
  }

  public get address(): IAddress {
    return this.props.address
  }
}
