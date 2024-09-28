import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { User } from '../../user/User'
import { UserFactory } from '../../user/test/UserFactory'
import { Doctor } from '../Doctor'
import { GenderType } from '../../../domain/common'

export const DoctorFactory = Factory.define<Doctor>(({ params }) => {
  return new Doctor({
    id: params.id ?? faker.datatype.uuid(),
    avatar: params.avatar ?? null,
    firstName: params.firstName ?? faker.name.firstName(),
    lastName: params.lastName ?? faker.name.lastName(),
    gender: params.gender ?? GenderType.FEMALE,
    birthDate: params.birthDate ?? new Date(),
    onboardDate: params.onboardDate ?? new Date(),
    resignationDate: params.resignationDate ?? null,
    user: (params.user as User) ?? UserFactory.build(),
  })
})
