import { GetTimeSlotUseCase } from '../../../application/time-slot/GetTimeSlotUseCase'
import { User } from '../../../domain/user/User'
import { Request, Response } from 'express'

export interface ITimeSlotController {
  getTimeSlot: (req: Request, res: Response) => Promise<Response>
}

export class TimeSlotController implements ITimeSlotController {
  constructor(private readonly getTimeSlotUseCase: GetTimeSlotUseCase) {}

  public getTimeSlot = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      clinicId: req.query.clinicId as string,
      currentUser: req.user as User,
    }
    const result = await this.getTimeSlotUseCase.execute(request)

    return res.status(200).json(result)
  }
}
