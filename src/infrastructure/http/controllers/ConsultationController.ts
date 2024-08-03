import { Request, Response } from 'express'
import { GetConsultationListUseCase } from 'application/consultation/GetConsultationListUseCase'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'

export interface IConsultationController {
  getConsultationList: (req: Request, res: Response) => Promise<Response>
}

export class ConsultationController implements IConsultationController {
  constructor(
    private readonly getConsultationListUseCase: GetConsultationListUseCase
  ) {}

  public getConsultationList = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      clinicId: req.query.clinicId as string,
      timePeriod: req.query.timePeriod as TimePeriodType,
      totalDurationMin: isNaN(Number(req.query.totalDurationMin))
        ? undefined
        : Number(req.query.totalDurationMin),
      totalDurationMax: isNaN(Number(req.query.totalDurationMax))
        ? undefined
        : Number(req.query.totalDurationMax),
      doctorId: req.query.doctorId as string,
      patientId: req.query.patientId as string,
    }
    const result = await this.getConsultationListUseCase.execute(request)

    return res.status(200).json(result)
  }
}
