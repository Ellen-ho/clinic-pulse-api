import { IUserRepository } from '../../../domain/user/interfaces/repositories/IUserRepository'
import { IHashGenerator } from '../../../domain/utils/IHashGenerator'
import { IUuidService } from '../../../domain/utils/IUuidService'
import { mock } from 'jest-mock-extended'
import { CreateUserUseCase } from '../CreateUserUseCase'
import { User, UserRoleType } from '../../../domain/user/User'
import { ValidationError } from '../../../infrastructure/error/ValidationError'

describe('Unit test: CreateUserUseCase', () => {
  const mockUserRepo = mock<IUserRepository>()
  const mockUuidService = mock<IUuidService>()
  const mockHashGenerator = mock<IHashGenerator>()

  const createUserUseCase = new CreateUserUseCase(
    mockUserRepo,
    mockUuidService,
    mockHashGenerator
  )

  const mockedDate = new Date('2024-06-18T13:18:00.155Z')
  jest.spyOn(global, 'Date').mockImplementation(() => mockedDate)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return a valid user data when email, password, and role are provided', async () => {
    const mockRequest = {
      email: 'test@test.com',
      password: 'password123',
      role: UserRoleType.DOCTOR,
    }

    const mockGeneratedUuid = 'generated-uuid'
    const mockHashedPassword = 'hashed-password'
    const mockSavedUser = new User({
      id: 'generated-uuid',
      email: 'test@test.com',
      hashedPassword: 'hashed-password',
      role: UserRoleType.DOCTOR,
      createdAt: mockedDate,
      updatedAt: mockedDate,
    })

    mockUserRepo.findByEmail.mockResolvedValue(null)
    mockUuidService.generateUuid.mockReturnValue(mockGeneratedUuid)
    mockHashGenerator.hash.mockResolvedValue(mockHashedPassword)
    mockUserRepo.save.mockResolvedValue(Promise.resolve())
    const expectedResponse = {
      user: {
        props: {
          id: 'generated-uuid',
          email: 'test@test.com',
          hashedPassword: 'hashed-password',
          role: UserRoleType.DOCTOR,
          createdAt: mockedDate,
          updatedAt: mockedDate,
        },
      },
    }

    const response = await createUserUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@test.com')
    expect(mockHashGenerator.hash).toHaveBeenCalledWith('password123')
    expect(mockUserRepo.save).toHaveBeenCalledWith(mockSavedUser)
  })

  it('should throw an error when an existing email is provided', async () => {
    const mockRequest = {
      email: 'test@test.com',
      password: 'password123',
      role: UserRoleType.DOCTOR,
    }

    const mockExistingUser = new User({
      id: 'generated-uuid',
      email: 'test@test.com',
      hashedPassword: 'hashed-password',
      role: UserRoleType.DOCTOR,
      createdAt: mockedDate,
      updatedAt: mockedDate,
    })

    mockUserRepo.findByEmail.mockResolvedValue(mockExistingUser)

    await expect(createUserUseCase.execute(mockRequest)).rejects.toThrow(
      ValidationError
    )
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@test.com')
  })
})
