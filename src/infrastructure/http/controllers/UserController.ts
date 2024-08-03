import { Request, Response } from 'express'
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase'
import { User, UserRoleType } from '../../../domain/user/User'
import jwt from 'jsonwebtoken'
import { CreateDoctorUseCase } from 'application/doctor/CreateDoctorUseCase'
import { DoctorRepository } from 'infrastructure/entities/doctor/DoctorRepository'

export interface IUserController {
  signin: (req: Request, res: Response) => Promise<Response>
  signup: (req: Request, res: Response) => Promise<Response>
}

export class UserController implements IUserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly createDoctorUseCase: CreateDoctorUseCase,
    private readonly doctorRepository: DoctorRepository
  ) {}

  public signin = async (req: Request, res: Response): Promise<Response> => {
    const { id, email, createdAt, role } = req.user as User

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
      expiresIn: '30d',
    })

    let signinDoctor
    let avatar
    if (role === UserRoleType.DOCTOR) {
      signinDoctor = await this.doctorRepository.findByUserId(id)
      avatar = signinDoctor?.avatar
    }

    return res.status(200).json({
      token,
      user: { id, createdAt, role, avatar },
      doctorId: signinDoctor?.id,
    })
  }

  public signup = async (req: Request, res: Response): Promise<Response> => {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      onboardDate,
      gender,
      birthDate,
    } = req.body

    const response = await this.createUserUseCase.execute({
      email,
      password,
      role,
    })

    if (role === UserRoleType.DOCTOR) {
      const doctorRequest = {
        firstName,
        lastName,
        onboardDate,
        resignationDate: null,
        avatar: null,
        gender,
        birthDate,
        user: response.user,
      }
      await this.createDoctorUseCase.execute(doctorRequest)
    }

    return res.status(201).json({
      id: response.user.id,
      email: response.user.email,
      role: response.user.role,
    })
  }
}
