import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { User, UserRoleType } from '../User'

export const UserFactory = Factory.define<User>(({ params }) => {
  return new User({
    id: params.id ?? faker.string.uuid(),
    email: params.email ?? faker.internet.email(),
    hashedPassword: params.hashedPassword ?? faker.internet.password(),
    role: params.role ?? UserRoleType.DOCTOR,
    createdAt: params.createdAt ?? new Date(),
    updatedAt: params.updatedAt ?? new Date(),
  })
})
