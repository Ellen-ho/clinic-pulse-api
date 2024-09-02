import { GetAllDoctorsUseCase } from '../../../application/doctor/GetAllDoctorsUseCase'
import { GetDoctorProfileUseCase } from '../../../application/doctor/GetDoctorProfieUseCase'
import { User } from '../../../domain/user/User'
import { Request, Response } from 'express'
import dotenv from 'dotenv'
import { EditDoctorAvatarUseCase } from '../../../application/doctor/EditDoctorAvatarUseCase'

dotenv.config()

interface MulterRequest extends Request {
  files: any
}

export interface IDoctorController {
  getAllDoctors: (req: Request, res: Response) => Promise<Response>
  getDoctorProfile: (req: Request, res: Response) => Promise<Response>
  uploadAvatar: (req: Request, res: Response) => Promise<Response>
}

export class DoctorController implements IDoctorController {
  constructor(
    private readonly getAllDoctorsUseCase: GetAllDoctorsUseCase,
    private readonly getDoctorProfileUseCase: GetDoctorProfileUseCase,
    private readonly editDoctorAvatarUseCase: EditDoctorAvatarUseCase
  ) {}

  public getAllDoctors = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const result = await this.getAllDoctorsUseCase.execute()

    return res.status(200).json(result)
  }

  public getDoctorProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      doctorId: req.params.id,
      currentUser: req.user as User,
    }
    const result = await this.getDoctorProfileUseCase.execute(request)

    return res.status(200).json(result)
  }

  public uploadAvatar = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const [avatar] = (req as MulterRequest).files.avatar
      const doctorId = req.params.id

      const response = await this.editDoctorAvatarUseCase.execute({
        file: avatar,
        doctorId,
      })

      return res
        .status(200)
        .json({ message: 'Avatar uploaded successfully', key: response.key })
    } catch (e) {
      throw new Error('upload avatar error: ' + (e as Error).message)
    }
  }
}
