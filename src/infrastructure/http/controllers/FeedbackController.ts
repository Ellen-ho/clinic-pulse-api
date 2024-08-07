import { GetFeedbackListUseCase } from 'application/feedback/GetFeedbackListUseCase'
import { GetSingleFeedbackUseCase } from 'application/feedback/GetSingleFeedbackUseCase'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { Request, Response } from 'express'

export interface IFeedbackController {
  getFeedbackList: (req: Request, res: Response) => Promise<Response>
  getSingleFeedback: (req: Request, res: Response) => Promise<Response>
}

export class FeedbackController implements IFeedbackController {
  constructor(
    private readonly getFeedbackListUseCase: GetFeedbackListUseCase,
    private readonly getSingleFeedbackUseCase: GetSingleFeedbackUseCase
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
      patientId: req.query.patientId as string,
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
    }
    const result = await this.getSingleFeedbackUseCase.execute(request)

    return res.status(200).json(result)
  }
}
