import { User, UserRoleType, IUserProps } from '../../domain/user/User'

describe('Unit test: User entity', () => {
  const mockUserProps: IUserProps = {
    id: 'user-123',
    email: 'test@example.com',
    hashedPassword: 'hashed-password',
    role: UserRoleType.DOCTOR,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  }

  let user: User

  beforeEach(() => {
    user = new User(mockUserProps)
  })

  it('should return correct id', () => {
    expect(user.id).toBe('user-123')
  })

  it('should return correct email', () => {
    expect(user.email).toBe('test@example.com')
  })

  it('should return correct hashedPassword', () => {
    expect(user.hashedPassword).toBe('hashed-password')
  })

  it('should return correct role', () => {
    expect(user.role).toBe(UserRoleType.DOCTOR)
  })

  it('should return correct createdAt', () => {
    expect(user.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'))
  })

  it('should return correct updatedAt', () => {
    expect(user.updatedAt).toEqual(new Date('2024-01-01T00:00:00Z'))
  })

  it('should update the hashedPassword using updateData method', () => {
    const newPassword = 'new-hashed-password'
    user.updateData({ password: newPassword })
    expect(user.hashedPassword).toBe(newPassword)
  })
})
