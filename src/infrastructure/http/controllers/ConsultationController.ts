import { Request, Response } from 'express'
import { GetConsultationListUseCase } from 'application/consultation/GetConsultationListUseCase'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { GetSingleConsultationUseCase } from 'application/consultation/GetSingleConsultationUseCase'
import { GetConsultationRealTimeCountUseCase } from 'application/consultation/GetConsultatoinRealTimeCountUseCase'
import { GetAverageWaitingTimeUseCase } from 'application/consultation/GetAverageWaitingTimeUseCase'
import { GetFirstTimeConsultationCountAndRateUseCase } from 'application/consultation/GetFirstTimeConsultationCountAndRateUseCase'
import { GetAverageConsultationCountUseCase } from 'application/consultation/GetAverageConsultationCountUseCase'
import { GetDifferentTreatmentConsultationUseCase } from 'application/consultation/GetDifferentTreatmentConsultationUseCase'
import { User } from 'domain/user/User'
import { Granularity } from 'domain/common'
import { GetConsultationOnsiteCanceledAndBookingUseCase } from 'application/consultation/GetConsultationOnsiteCanceledAndBookingUseCase'

export interface IConsultationController {
  getConsultationList: (req: Request, res: Response) => Promise<Response>
  getSingleConsultation: (req: Request, res: Response) => Promise<Response>
  getConsultationOnsiteCanceledAndBooking: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getConsultationRealTimeCount: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getAverageWaitingTime: (req: Request, res: Response) => Promise<Response>
  getFirstTimeConsultationCountAndRate: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getAverageConsultationCount: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getDifferentTreatmentConsultation: (
    req: Request,
    res: Response
  ) => Promise<Response>
}

export class ConsultationController implements IConsultationController {
  constructor(
    private readonly getConsultationListUseCase: GetConsultationListUseCase,
    private readonly getSingleConsultationUseCase: GetSingleConsultationUseCase,
    private readonly getConsultationOnsiteCanceledAndBookingUseCase: GetConsultationOnsiteCanceledAndBookingUseCase,
    private readonly getConsultationRealTimeCountUseCase: GetConsultationRealTimeCountUseCase,
    private readonly getAverageWaitingTimeUseCase: GetAverageWaitingTimeUseCase,
    private readonly getFirstTimeConsultationCountAndRateUseCase: GetFirstTimeConsultationCountAndRateUseCase,
    private readonly getAverageConsultationCountUseCase: GetAverageConsultationCountUseCase,
    private readonly getDifferentTreatmentConsultationUseCase: GetDifferentTreatmentConsultationUseCase
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
      patientName: req.query.patientName as string,
      patientId: req.query.patientId as string,
      doctorId: req.query.doctorId as string,
      currentUser: req.user as User,
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
      currentUser: req.user as User,
    }
    const result = await this.getSingleConsultationUseCase.execute(request)

    return res.status(200).json(result)
  }

  public getConsultationOnsiteCanceledAndBooking = async (
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
    const result =
      await this.getConsultationOnsiteCanceledAndBookingUseCase.execute(request)

    return res.status(200).json(result)
  }

  public getConsultationRealTimeCount = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      clinicId: req.query.clinicId as string,
      consultaionRoomNumber: req.query.consultaionRoomNumber as string,
    }
    const result = await this.getConsultationRealTimeCountUseCase.execute(
      request
    )

    return res.status(200).json(result)
  }

  public getAverageWaitingTime = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      clinicId: req.query.clinicId as string,
      timePeriod: req.query.timePeriod as TimePeriodType,
      doctorId: req.query.doctorId as string,
      patientId: req.query.patientId as string,
      granularity: req.query.granularity as Granularity,
      currentUser: req.user as User,
    }
    const result = await this.getAverageWaitingTimeUseCase.execute(request)

    return res.status(200).json(result)
  }

  public getFirstTimeConsultationCountAndRate = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      clinicId: req.query.clinicId as string,
      timePeriod: req.query.timePeriod as TimePeriodType,
      doctorId: req.query.doctorId as string,
    }
    const result =
      await this.getFirstTimeConsultationCountAndRateUseCase.execute(request)

    return res.status(200).json(result)
  }

  public getAverageConsultationCount = async (
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
    const result = await this.getAverageConsultationCountUseCase.execute(
      request
    )

    return res.status(200).json(result)
  }

  public getDifferentTreatmentConsultation = async (
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
    const result = await this.getDifferentTreatmentConsultationUseCase.execute(
      request
    )

    return res.status(200).json(result)
  }
}
