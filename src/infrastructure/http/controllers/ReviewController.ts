import { GetReviewCountAndRateUseCase } from 'application/review/GetReviewCountAndRateUseCase'
import { GetReviewListUseCase } from 'application/review/GetReviewListUseCase'
import { GetSingleReviewUseCase } from 'application/review/GetSingleReviewUseCase'
import { Granularity } from 'domain/common'
import { User } from 'domain/user/User'
import { Request, Response } from 'express'

export interface IReviewController {
  getReviewList: (req: Request, res: Response) => Promise<Response>
  getSingleReview: (req: Request, res: Response) => Promise<Response>
  getReviewCountAndRate: (req: Request, res: Response) => Promise<Response>
}

export class ReviewController implements IReviewController {
  constructor(
    private readonly getReviewListUseCase: GetReviewListUseCase,
    private readonly getSingleReviewUseCase: GetSingleReviewUseCase,
    private readonly getReviewCountAndRateUseCase: GetReviewCountAndRateUseCase
  ) {}

  public getSingleReview = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      reviewId: req.params.id,
      currentUser: req.user as User,
    }
    const result = await this.getSingleReviewUseCase.execute(request)

    return res.status(200).json(result)
  }

  public getReviewList = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      clinicId: req.query.clinicId as string,
      reviewRating: isNaN(Number(req.query.reviewRating))
        ? undefined
        : Number(req.query.reviewRating),
      patientName: req.query.patientName as string,
      currentUser: req.user as User,
    }
    const result = await this.getReviewCountAndRateUseCase.execute(request)

    return res.status(200).json(result)
  }

  public getReviewCountAndRate = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      clinicId: req.query.clinicId as string,
      granularity: req.query.granularity as Granularity,
      currentUser: req.user as User,
    }
    const result = await this.getReviewCountAndRateUseCase.execute(request)

    return res.status(200).json(result)
  }
}
