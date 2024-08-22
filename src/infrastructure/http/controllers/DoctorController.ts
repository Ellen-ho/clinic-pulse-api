import { GetAllDoctorsUseCase } from 'application/doctor/GetAllDoctorsUseCase'
import { GetDoctorProfileUseCase } from 'application/doctor/GetDoctorProfieUseCase'
import { User } from 'domain/user/User'
import { Request, Response } from 'express'

export interface IDoctorController {
  getAllDoctors: (req: Request, res: Response) => Promise<Response>
  getDoctorProfile: (req: Request, res: Response) => Promise<Response>
}

export class DoctorController implements IDoctorController {
  constructor(
    private readonly getAllDoctorsUseCase: GetAllDoctorsUseCase,
    private readonly getDoctorProfileUseCase: GetDoctorProfileUseCase
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
}
