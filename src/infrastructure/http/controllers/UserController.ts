import { Request, Response } from 'express'
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase'
import { User, UserRoleType } from '../../../domain/user/User'
import jwt from 'jsonwebtoken'
import { CreateDoctorUseCase } from '../../../application/doctor/CreateDoctorUseCase'
import { DoctorRepository } from '../../../infrastructure/entities/doctor/DoctorRepository'
import { getAvatarUrl } from '../../../application/helper/AvatarHelper'
import { PermissionRepository } from '../../../infrastructure/entities/permission/PermissionRepository'
import { CreatePasswordChangeMailUseCase } from 'application/user/CreatePasswordChangeMailUseCase'
import { UpdatePasswordUseCase } from 'application/user/UpdatePasswordUseCase'

export interface IUserController {
  signin: (req: Request, res: Response) => Promise<Response>
  signup: (req: Request, res: Response) => Promise<Response>
  createPasswordChangeMail: (req: Request, res: Response) => Promise<Response>
  updatePassword: (req: Request, res: Response) => Promise<Response>
}

export class UserController implements IUserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly createDoctorUseCase: CreateDoctorUseCase,
    private readonly doctorRepository: DoctorRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly createPasswordChangeMailUseCase: CreatePasswordChangeMailUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase
  ) {}

  public signin = async (req: Request, res: Response): Promise<Response> => {
    const { id, email, createdAt, role } = req.user as User

    const permissions = await this.permissionRepository.findByRole(role)

    const token = jwt.sign(
      { id, email, permissions }, // add permissions to token payload
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1d',
      }
    )

    let signinDoctor
    let avatar
    if (role === UserRoleType.DOCTOR) {
      signinDoctor = await this.doctorRepository.findByUserId(id)
      avatar = getAvatarUrl(signinDoctor?.avatar ?? null)
    }

    return res.status(200).json({
      token,
      user: { id, createdAt, role, avatar },
      permissions,
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

  public createPasswordChangeMail = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      ...req.body,
    }
    const result = await this.createPasswordChangeMailUseCase.execute(request)
    return res.status(200).json(result)
  }

  public updatePassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      ...req.body,
    }
    const result = await this.updatePasswordUseCase.execute(request)
    return res.status(200).json(result)
  }
}
