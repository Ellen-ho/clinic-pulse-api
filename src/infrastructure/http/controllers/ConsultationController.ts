import { Request, Response } from 'express'
import { GetConsultationListUseCase } from 'application/consultation/GetConsultationListUseCase'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { GetSingleConsultationUseCase } from 'application/consultation/GetSingleConsultationUseCase'
import { GetConsultationOnlineBookingRateUseCase } from 'application/consultation/GetConsultationOnlineBookingRateUseCase'

export interface IConsultationController {
  getConsultationList: (req: Request, res: Response) => Promise<Response>
  getSingleConsultation: (req: Request, res: Response) => Promise<Response>
  getConsultationOnlineBookingRate: (
    req: Request,
    res: Response
  ) => Promise<Response>
}

export class ConsultationController implements IConsultationController {
  constructor(
    private readonly getConsultationListUseCase: GetConsultationListUseCase,
    private readonly getSingleConsultationUseCase: GetSingleConsultationUseCase,
    private readonly getConsultationOnlineBookingRateUseCase: GetConsultationOnlineBookingRateUseCase
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

  public getSingleConsultation = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      consultationId: req.params.id,
    }
    const result = await this.getSingleConsultationUseCase.execute(request)

    return res.status(200).json(result)
  }

  public getConsultationOnlineBookingRate = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      clinicId: req.query.clinicId as string,
    }
    const result = await this.getConsultationOnlineBookingRateUseCase.execute(
      request
    )

    return res.status(200).json(result)
  }
}
