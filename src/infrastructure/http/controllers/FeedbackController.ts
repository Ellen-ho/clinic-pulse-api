import { GetFeedbackCountAndRateUseCase } from 'application/feedback/GetFeedbackCountAndRateUseCase'
import { GetFeedbackListUseCase } from 'application/feedback/GetFeedbackListUseCase'
import { GetSingleFeedbackUseCase } from 'application/feedback/GetSingleFeedbackUseCase'
import { Granularity } from 'domain/common'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { User } from 'domain/user/User'
import { Request, Response } from 'express'

export interface IFeedbackController {
  getFeedbackList: (req: Request, res: Response) => Promise<Response>
  getSingleFeedback: (req: Request, res: Response) => Promise<Response>
  getFeedbackCountAndRate: (req: Request, res: Response) => Promise<Response>
}

export class FeedbackController implements IFeedbackController {
  constructor(
    private readonly getFeedbackListUseCase: GetFeedbackListUseCase,
    private readonly getSingleFeedbackUseCase: GetSingleFeedbackUseCase,
    private readonly getFeedbackCountAndRateUseCase: GetFeedbackCountAndRateUseCase
  ) {}

  public getFeedbackList = async (
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
      feedbackRating: isNaN(Number(req.query.feedbackRating))
        ? undefined
        : Number(req.query.feedbackRating),
      doctorId: req.query.doctorId as string,
      patientName: req.query.patientName as string,
      patientId: req.query.patientId as string,
      currentUser: req.user as User,
    }
    const result = await this.getFeedbackListUseCase.execute(request)

    return res.status(200).json(result)
  }

  public getSingleFeedback = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      feedbackId: req.params.id,
      currentUser: req.user as User,
    }
    const result = await this.getSingleFeedbackUseCase.execute(request)

    return res.status(200).json(result)
  }

  public getFeedbackCountAndRate = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      clinicId: req.query.clinicId as string,
      timePeriod: req.query.timePeriod as TimePeriodType,
      doctorId: req.query.doctorId as string,
      granularity: req.query.granularity as Granularity,
      currentUser: req.user as User,
    }
    const result = await this.getFeedbackCountAndRateUseCase.execute(request)

    return res.status(200).json(result)
  }
}
