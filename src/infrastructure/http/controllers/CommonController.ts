import { GetDoctorsAndClinicsUseCase } from '../../../application/common/GetDoctorsAndClinicsUseCase'
import { Request, Response } from 'express'
export interface ICommonController {
  getDoctorsAndClinics: (req: Request, res: Response) => Promise<Response>
}

export class CommonController implements ICommonController {
  constructor(
    private readonly getDoctorsAndClinicsUseCase: GetDoctorsAndClinicsUseCase
  ) {}

  public getDoctorsAndClinics = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const result = await this.getDoctorsAndClinicsUseCase.execute()

    return res.status(200).json(result)
  }
}
