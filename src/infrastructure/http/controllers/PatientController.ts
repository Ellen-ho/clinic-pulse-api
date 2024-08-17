import { GetPatientNameAutoCompleteUseCase } from '../../../application/patient/getPatientNameAutoComplete'
import { Request, Response } from 'express'

export interface IPatientController {
  getPatientNameAutoComplete: (req: Request, res: Response) => Promise<Response>
}

export class PatientController implements IPatientController {
  constructor(
    private readonly getPatientNameAutoCompleteUseCase: GetPatientNameAutoCompleteUseCase
  ) {}

  public getPatientNameAutoComplete = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      searchText: req.query.searchText as string,
    }
    const result = await this.getPatientNameAutoCompleteUseCase.execute(request)

    return res.status(200).json(result)
  }
}
