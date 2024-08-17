import { GetAllDoctorsUseCase } from 'application/doctor/GetAllDoctorsUseCase'
import { Request, Response } from 'express'

export interface IDoctorController {
  getAllDoctors: (req: Request, res: Response) => Promise<Response>
}

export class DoctorController implements IDoctorController {
  constructor(private readonly getAllDoctorsUseCase: GetAllDoctorsUseCase) {}

  public getAllDoctors = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const result = await this.getAllDoctorsUseCase.execute()

    return res.status(200).json(result)
  }
}
