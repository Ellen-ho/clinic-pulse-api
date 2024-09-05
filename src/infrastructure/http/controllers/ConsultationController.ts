import { Request, Response } from 'express'
import { GetConsultationListUseCase } from '../../../application/consultation/GetConsultationListUseCase'
import { TimePeriodType } from '../../../domain/timeSlot/TimeSlot'
import { GetSingleConsultationUseCase } from '../../../application/consultation/GetSingleConsultationUseCase'
import { GetConsultationRealTimeCountUseCase } from '../../../application/consultation/GetConsultationRealTimeCountUseCase'
import { GetAverageWaitingTimeUseCase } from '../../../application/consultation/GetAverageWaitingTimeUseCase'
import { GetFirstTimeConsultationCountAndRateUseCase } from '../../../application/consultation/GetFirstTimeConsultationCountAndRateUseCase'
import { GetAverageConsultationCountUseCase } from '../../../application/consultation/GetAverageConsultationCountUseCase'
import { GetDifferentTreatmentConsultationUseCase } from '../../../application/consultation/GetDifferentTreatmentConsultationUseCase'
import { User } from '../../../domain/user/User'
import { GenderType, Granularity } from '../../../domain/common'
import { GetConsultationOnsiteCanceledCountAndRateUseCase } from '../../../application/consultation/GetConsultationOnsiteCanceledCountAndRateUseCase'
import { CreateConsultationUseCase } from '../../../application/consultation/CreateConsultationUseCase'
import {
  UpdateConsultationCheckOutAtRequest,
  UpdateConsultationCheckOutAtUseCase,
} from '../../../application/consultation/UpdateConsultationCheckOutAtUseCase'
import { UpdateConsultationStartAtUseCase } from '../../../application/consultation/UpdateConsultationStartAtUseCase'
import { UpdateConsultationOnsiteCancelAtUseCase } from '../../../application/consultation/UpdateConsultationOnsiteCancelAtUseCase'
import {
  ConsultationStatus,
  OnsiteCancelReasonType,
} from '../../../domain/consultation/Consultation'
import { IRealTimeUpdateHelper } from '../../../application/consultation/RealTimeUpdateHelper'
import {
  GetConsultationSocketRealTimeCountRequest,
  GetConsultationSocketRealTimeCountUseCase,
} from '../../../application/consultation/GetConsultationSocketRealTimeCountUseCase'
import { GetConsultationRealTimeListUseCase } from '../../../application/consultation/GetConsultationRealTimeListUseCase'
import {
  GetConsultationSocketRealTimeListRequest,
  GetConsultationSocketRealTimeListUseCase,
} from '../../../application/consultation/GetConsultationSocketRealTimeListUseCase'
import { RoomNumberType } from '../../../domain/consultationRoom/ConsultationRoom'
import { GetConsultationBookingCountAndRateUseCase } from '../../../application/consultation/GetConsultationBookingCountAndRateUseCase'
import { CreateAcupunctureTreatmentUseCase } from '../../../application/consultation/CreateAcupunctureTreatmentUseCase'
import { UpdateConsultationToMedicineUseCase } from '../../../application/consultation/UpdateConsultationToMedicineUseCase'
import { CreateMedicineTreatmentUseCase } from '../../../application/consultation/CreateMedicineTreatmentUseCase'
import { UpdateConsultationToWaitForBedUseCase } from '../../../application/consultation/UpdateConsultationToWaitForBedUseCase'
import { UpdateConsultationToWaitAcupunctureUseCase } from '../../../application/consultation/UpdateConsultationToWaitAcupunctureUseCase'
import { UpdateAcupunctureTreatmentStartAtUseCase } from '../../../application/consultation/UpdateAcupunctureTreatmentStartAtUseCase'
import {
  UpdateConsultationToWaitRemoveNeedleRequest,
  UpdateConsultationToWaitRemoveNeedleUseCase,
} from '../../../application/consultation/UpdateConsultationToWaitRemoveNeedleUseCase'
import { UpdateAcupunctureTreatmentRemoveNeedleAtUseCase } from '../../../application/consultation/UpdateAcupunctureTreatmentRemoveNeedleAtUseCase'
import { IConsultationRepository } from '../../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { UpdateMedicineTreatmentUseCase } from '../../../application/consultation/UpdateMedicineTreatmentUseCase'
import { CreateAcupunctureAndMedicineUseCase } from '../../../application/consultation/CreateAcupunctureAndMedicineUseCase'

export interface IConsultationController {
  getConsultationList: (req: Request, res: Response) => Promise<Response>
  getSingleConsultation: (req: Request, res: Response) => Promise<Response>
  getConsultationOnsiteCanceledCountAndRate: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getConsultationBookingCountAndRate: (
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
  createConsultation: (req: Request, res: Response) => Promise<Response>
  updateConsultationStartAt: (req: Request, res: Response) => Promise<Response>
  updateConsultationCheckOutAt: (
    req: Request,
    res: Response
  ) => Promise<Response>
  updateConsultationOnsiteCancelAt: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getConsultationRealTimeList: (
    req: Request,
    res: Response
  ) => Promise<Response>
  createAcupunctureTreatment: (req: Request, res: Response) => Promise<Response>
  createMedicineTreatment: (req: Request, res: Response) => Promise<Response>
  updateConsultationToWaitAcupuncture: (
    req: Request,
    res: Response
  ) => Promise<Response>
  updateAcupunctureTreatmentStartAt: (
    req: Request,
    res: Response
  ) => Promise<Response>
  updateAcupunctureTreatmentRemoveNeedleAt: (
    req: Request,
    res: Response
  ) => Promise<Response>
  updateMedicineTreatment: (req: Request, res: Response) => Promise<Response>
  createAcupunctureAndMedicine: (
    req: Request,
    res: Response
  ) => Promise<Response>
}

export class ConsultationController implements IConsultationController {
  constructor(
    private readonly realTimeUpdateHelper: IRealTimeUpdateHelper,
    private readonly getConsultationListUseCase: GetConsultationListUseCase,
    private readonly getSingleConsultationUseCase: GetSingleConsultationUseCase,
    private readonly getConsultationOnsiteCanceledCountAndRateUseCase: GetConsultationOnsiteCanceledCountAndRateUseCase,
    private readonly getConsultationBookingCountAndRateUseCase: GetConsultationBookingCountAndRateUseCase,
    private readonly getConsultationRealTimeCountUseCase: GetConsultationRealTimeCountUseCase,
    private readonly getAverageWaitingTimeUseCase: GetAverageWaitingTimeUseCase,
    private readonly getFirstTimeConsultationCountAndRateUseCase: GetFirstTimeConsultationCountAndRateUseCase,
    private readonly getAverageConsultationCountUseCase: GetAverageConsultationCountUseCase,
    private readonly getDifferentTreatmentConsultationUseCase: GetDifferentTreatmentConsultationUseCase,
    private readonly createConsultationUseCase: CreateConsultationUseCase,
    private readonly updateConsultationCheckOutAtUseCase: UpdateConsultationCheckOutAtUseCase,
    private readonly updateConsultationStartAtUseCase: UpdateConsultationStartAtUseCase,
    private readonly updateConsultationOnsiteCancelAtUseCase: UpdateConsultationOnsiteCancelAtUseCase,
    private readonly getConsultationSocketRealTimeCountUseCase: GetConsultationSocketRealTimeCountUseCase,
    private readonly getConsultationRealTimeListUseCase: GetConsultationRealTimeListUseCase,
    private readonly getConsultationSocketRealTimeListUseCase: GetConsultationSocketRealTimeListUseCase,
    private readonly createAcupunctureTreatmentUseCase: CreateAcupunctureTreatmentUseCase,
    private readonly updateConsultationToWaitForBedUseCase: UpdateConsultationToWaitForBedUseCase,
    private readonly createMedicineTreatmentUseCase: CreateMedicineTreatmentUseCase,
    private readonly updateConsultationToMedicineUseCase: UpdateConsultationToMedicineUseCase,
    private readonly updateConsultationToWaitAcupunctureUseCase: UpdateConsultationToWaitAcupunctureUseCase,
    private readonly updateAcupunctureTreatmentStartAtUseCase: UpdateAcupunctureTreatmentStartAtUseCase,
    private readonly updateConsultationToWaitRemoveNeedleUseCase: UpdateConsultationToWaitRemoveNeedleUseCase,
    private readonly updateAcupunctureTreatmentRemoveNeedleAtUseCase: UpdateAcupunctureTreatmentRemoveNeedleAtUseCase,
    private readonly updateMedicineTreatmentUseCase: UpdateMedicineTreatmentUseCase,
    private readonly createAcupunctureAndMedicineUseCase: CreateAcupunctureAndMedicineUseCase,
    private readonly consultationRepository: IConsultationRepository
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

  public getConsultationOnsiteCanceledCountAndRate = async (
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
      await this.getConsultationOnsiteCanceledCountAndRateUseCase.execute(
        request
      )

    return res.status(200).json(result)
  }

  public getConsultationBookingCountAndRate = async (
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
    const result = await this.getConsultationBookingCountAndRateUseCase.execute(
      request
    )

    return res.status(200).json(result)
  }

  public getConsultationRealTimeCount = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      clinicId: req.query.clinicId as string,
      consultationRoomNumber: req.query
        .consultationRoomNumber as RoomNumberType,
      doctorId: req.query.doctorId as string,
      currentUser: req.user as User,
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
      granularity: req.query.granularity as Granularity,
      currentUser: req.user as User,
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

  public createConsultation = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { ...req.body }
    const consultation = await this.createConsultationUseCase.execute(request)
    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: consultation.id,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status:
          listResult?.status ?? ConsultationStatus.WAITING_FOR_CONSULTATION,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })
    return res.status(200).json(consultation)
  }

  public updateConsultationCheckOutAt = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      consultationId: req.params.id,
    }
    await this.updateConsultationCheckOutAtUseCase.execute(request)

    const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
      {
        consultationId: request.consultationId,
      }

    const countResult =
      await this.getConsultationSocketRealTimeCountUseCase.execute(
        getConsultationSocketRealTimeCountRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedWaitingCounts({
      clinicId: countResult?.clinicId ?? '',
      consultationRoomNumber:
        countResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        waitForConsultationCount: countResult?.waitForConsultationCount ?? 0,
        waitForBedAssignedCount: countResult?.waitForBedAssignedCount ?? 0,
        waitForAcupunctureTreatmentCount:
          countResult?.waitForAcupunctureTreatmentCount ?? 0,
        waitForNeedleRemovedCount: countResult?.waitForNeedleRemovedCount ?? 0,
        waitForMedicineCount: countResult?.waitForMedicineCount ?? 0,
        completedCount: countResult?.completedCount ?? 0,
      },
    })

    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: request.consultationId,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status: listResult?.status ?? ConsultationStatus.CHECK_OUT,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })
    return res.status(200).json()
  }

  public updateConsultationStartAt = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      consultationId: req.params.id,
    }

    await this.updateConsultationStartAtUseCase.execute(request)

    const countResult =
      await this.getConsultationSocketRealTimeCountUseCase.execute({
        consultationId: request.consultationId,
      })

    await this.realTimeUpdateHelper.sendUpdatedWaitingCounts({
      clinicId: countResult?.clinicId ?? '',
      consultationRoomNumber:
        countResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        waitForConsultationCount: countResult?.waitForConsultationCount ?? 0,
        waitForBedAssignedCount: countResult?.waitForBedAssignedCount ?? 0,
        waitForAcupunctureTreatmentCount:
          countResult?.waitForAcupunctureTreatmentCount ?? 0,
        waitForNeedleRemovedCount: countResult?.waitForNeedleRemovedCount ?? 0,
        waitForMedicineCount: countResult?.waitForMedicineCount ?? 0,
        completedCount: countResult?.completedCount ?? 0,
      },
    })

    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: request.consultationId,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status: listResult?.status ?? ConsultationStatus.IN_CONSULTATION,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })
    return res.status(200).json()
  }

  public updateConsultationOnsiteCancelAt = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      consultationId: req.params.id,
      onsiteCancelReason: OnsiteCancelReasonType.LONG_WAITING_TIME,
    }
    await this.updateConsultationOnsiteCancelAtUseCase.execute(request)

    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: request.consultationId,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status: listResult?.status ?? ConsultationStatus.ONSITE_CANCEL,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })
    return res.status(200).json()
  }

  public getConsultationRealTimeList = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      clinicId: req.query.clinicId as string,
      consultationRoomNumber: req.query
        .consultationRoomNumber as RoomNumberType,
      doctorId: req.query.doctorId as string,
      currentUser: req.user as User,
    }
    const result = await this.getConsultationRealTimeListUseCase.execute(
      request
    )

    return res.status(200).json(result)
  }

  public createAcupunctureTreatment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { consultationId: req.params.id }

    const response = await this.createAcupunctureTreatmentUseCase.execute(
      request
    )

    await this.updateConsultationToWaitForBedUseCase.execute(response)

    const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
      {
        consultationId: request.consultationId,
      }

    const result = await this.getConsultationSocketRealTimeCountUseCase.execute(
      getConsultationSocketRealTimeCountRequest
    )

    await this.realTimeUpdateHelper.sendUpdatedWaitingCounts({
      clinicId: result?.clinicId ?? '',
      consultationRoomNumber:
        result?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        waitForConsultationCount: result?.waitForConsultationCount ?? 0,
        waitForBedAssignedCount: result?.waitForBedAssignedCount ?? 0,
        waitForAcupunctureTreatmentCount:
          result?.waitForAcupunctureTreatmentCount ?? 0,
        waitForNeedleRemovedCount: result?.waitForNeedleRemovedCount ?? 0,
        waitForMedicineCount: result?.waitForMedicineCount ?? 0,
        completedCount: result?.completedCount ?? 0,
      },
    })

    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: request.consultationId,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status:
          listResult?.status ?? ConsultationStatus.WAITING_FOR_BED_ASSIGNMENT,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })

    return res.status(200).json(response)
  }

  public createMedicineTreatment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { consultationId: req.params.id }
    const response = await this.createMedicineTreatmentUseCase.execute(request)
    await this.updateConsultationToMedicineUseCase.execute(response)

    const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
      {
        consultationId: request.consultationId,
      }

    const result = await this.getConsultationSocketRealTimeCountUseCase.execute(
      getConsultationSocketRealTimeCountRequest
    )

    await this.realTimeUpdateHelper.sendUpdatedWaitingCounts({
      clinicId: result?.clinicId ?? '',
      consultationRoomNumber:
        result?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        waitForConsultationCount: result?.waitForConsultationCount ?? 0,
        waitForBedAssignedCount: result?.waitForBedAssignedCount ?? 0,
        waitForAcupunctureTreatmentCount:
          result?.waitForAcupunctureTreatmentCount ?? 0,
        waitForNeedleRemovedCount: result?.waitForNeedleRemovedCount ?? 0,
        waitForMedicineCount: result?.waitForMedicineCount ?? 0,
        completedCount: result?.completedCount ?? 0,
      },
    })

    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: request.consultationId,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status:
          listResult?.status ?? ConsultationStatus.WAITING_FOR_GET_MEDICINE,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })

    return res.status(200).json(response)
  }

  public updateConsultationToWaitAcupuncture = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      consultationId: req.params.id,
      bedId: req.body.bedId,
    }

    await this.updateConsultationToWaitAcupunctureUseCase.execute(request)

    const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
      {
        consultationId: request.consultationId,
      }

    const result = await this.getConsultationSocketRealTimeCountUseCase.execute(
      getConsultationSocketRealTimeCountRequest
    )

    await this.realTimeUpdateHelper.sendUpdatedWaitingCounts({
      clinicId: result?.clinicId ?? '',
      consultationRoomNumber:
        result?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        waitForConsultationCount: result?.waitForConsultationCount ?? 0,
        waitForBedAssignedCount: result?.waitForBedAssignedCount ?? 0,
        waitForAcupunctureTreatmentCount:
          result?.waitForAcupunctureTreatmentCount ?? 0,
        waitForNeedleRemovedCount: result?.waitForNeedleRemovedCount ?? 0,
        waitForMedicineCount: result?.waitForMedicineCount ?? 0,
        completedCount: result?.completedCount ?? 0,
      },
    })

    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: request.consultationId,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status:
          listResult?.status ??
          ConsultationStatus.WAITING_FOR_ACUPUNCTURE_TREATMENT,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })

    return res.status(200).json()
  }

  public updateAcupunctureTreatmentStartAt = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      consultationId: req.params.id,
      needleCounts: req.body.needleCounts,
    }
    await this.updateAcupunctureTreatmentStartAtUseCase.execute(request)

    setTimeout(() => {
      void (async () => {
        try {
          const updateConsultationToWaitRemoveNeedleRequest: UpdateConsultationToWaitRemoveNeedleRequest =
            {
              id: request.consultationId,
            }

          await this.updateConsultationToWaitRemoveNeedleUseCase.execute(
            updateConsultationToWaitRemoveNeedleRequest
          )
          const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
            {
              consultationId: request.consultationId,
            }

          const result =
            await this.getConsultationSocketRealTimeCountUseCase.execute(
              getConsultationSocketRealTimeCountRequest
            )

          await this.realTimeUpdateHelper.sendUpdatedWaitingCounts({
            clinicId: result?.clinicId ?? '',
            consultationRoomNumber:
              result?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
            content: {
              waitForConsultationCount: result?.waitForConsultationCount ?? 0,
              waitForBedAssignedCount: result?.waitForBedAssignedCount ?? 0,
              waitForAcupunctureTreatmentCount:
                result?.waitForAcupunctureTreatmentCount ?? 0,
              waitForNeedleRemovedCount: result?.waitForNeedleRemovedCount ?? 0,
              waitForMedicineCount: result?.waitForMedicineCount ?? 0,
              completedCount: result?.completedCount ?? 0,
            },
          })

          const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
            {
              consultationId: request.consultationId,
            }

          const listResult =
            await this.getConsultationSocketRealTimeListUseCase.execute(
              getConsultationSocketRealTimeListRequest
            )

          await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
            clinicId: listResult?.clinicId ?? '',
            consultationRoomNumber:
              listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
            content: {
              id: listResult?.id ?? '',
              isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
              consultationNumber: listResult?.consultationNumber ?? 0,
              doctor: {
                firstName: listResult?.doctor.firstName ?? '',
                lastName: listResult?.doctor.lastName ?? '',
              },
              patient: {
                firstName: listResult?.patient.firstName ?? '',
                lastName: listResult?.patient.lastName ?? '',
                gender: listResult?.patient.gender ?? GenderType.FEMALE,
                age: listResult?.patient.age ?? 0,
              },
              status:
                listResult?.status ??
                ConsultationStatus.WAITING_FOR_NEEDLE_REMOVAL,
              timeSlotId: listResult?.timeSlotId ?? '',
            },
          })
        } catch (error) {
          console.error('Error occurred in setTimeout:', error)
        }
      })()
    }, 15 * 60 * 1000)

    return res.status(200).json()
  }

  public updateAcupunctureTreatmentRemoveNeedleAt = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      consultationId: req.params.id,
    }
    await this.updateAcupunctureTreatmentRemoveNeedleAtUseCase.execute(request)

    const result = await this.consultationRepository.checkMedicineTreatment(
      request.consultationId
    )

    if (result !== null) {
      await this.updateConsultationToMedicineUseCase.execute({
        id: request.consultationId,
        medicineTreatment: result.medicineTreatment,
      })
    } else {
      await this.updateConsultationCheckOutAtUseCase.execute({
        consultationId: request.consultationId,
      })
    }
    const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
      {
        consultationId: request.consultationId,
      }

    const data = await this.getConsultationSocketRealTimeCountUseCase.execute(
      getConsultationSocketRealTimeCountRequest
    )

    await this.realTimeUpdateHelper.sendUpdatedWaitingCounts({
      clinicId: data?.clinicId ?? '',
      consultationRoomNumber:
        data?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        waitForConsultationCount: data?.waitForConsultationCount ?? 0,
        waitForBedAssignedCount: data?.waitForBedAssignedCount ?? 0,
        waitForAcupunctureTreatmentCount:
          data?.waitForAcupunctureTreatmentCount ?? 0,
        waitForNeedleRemovedCount: data?.waitForNeedleRemovedCount ?? 0,
        waitForMedicineCount: data?.waitForMedicineCount ?? 0,
        completedCount: data?.completedCount ?? 0,
      },
    })

    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: request.consultationId,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status:
          listResult?.status ?? ConsultationStatus.WAITING_FOR_GET_MEDICINE,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })

    return res.status(200).json()
  }

  public updateMedicineTreatment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      consultationId: req.params.id,
    }
    await this.updateMedicineTreatmentUseCase.execute(request)

    const updateConsultationCheckOutAtRequest: UpdateConsultationCheckOutAtRequest =
      {
        consultationId: request.consultationId,
      }

    await this.updateConsultationCheckOutAtUseCase.execute(
      updateConsultationCheckOutAtRequest
    )

    const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
      {
        consultationId: request.consultationId,
      }

    const result = await this.getConsultationSocketRealTimeCountUseCase.execute(
      getConsultationSocketRealTimeCountRequest
    )

    await this.realTimeUpdateHelper.sendUpdatedWaitingCounts({
      clinicId: result?.clinicId ?? '',
      consultationRoomNumber:
        result?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        waitForConsultationCount: result?.waitForConsultationCount ?? 0,
        waitForBedAssignedCount: result?.waitForBedAssignedCount ?? 0,
        waitForAcupunctureTreatmentCount:
          result?.waitForAcupunctureTreatmentCount ?? 0,
        waitForNeedleRemovedCount: result?.waitForNeedleRemovedCount ?? 0,
        waitForMedicineCount: result?.waitForMedicineCount ?? 0,
        completedCount: result?.completedCount ?? 0,
      },
    })

    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: request.consultationId,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status: listResult?.status ?? ConsultationStatus.CHECK_OUT,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })

    return res.status(200).json()
  }

  public createAcupunctureAndMedicine = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      consultationId: req.params.id,
    }
    const response = await this.createAcupunctureAndMedicineUseCase.execute(
      request
    )

    await this.updateConsultationToWaitForBedUseCase.execute(response)

    const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
      {
        consultationId: request.consultationId,
      }

    const result = await this.getConsultationSocketRealTimeCountUseCase.execute(
      getConsultationSocketRealTimeCountRequest
    )

    await this.realTimeUpdateHelper.sendUpdatedWaitingCounts({
      clinicId: result?.clinicId ?? '',
      consultationRoomNumber:
        result?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        waitForConsultationCount: result?.waitForConsultationCount ?? 0,
        waitForBedAssignedCount: result?.waitForBedAssignedCount ?? 0,
        waitForAcupunctureTreatmentCount:
          result?.waitForAcupunctureTreatmentCount ?? 0,
        waitForNeedleRemovedCount: result?.waitForNeedleRemovedCount ?? 0,
        waitForMedicineCount: result?.waitForMedicineCount ?? 0,
        completedCount: result?.completedCount ?? 0,
      },
    })

    const getConsultationSocketRealTimeListRequest: GetConsultationSocketRealTimeListRequest =
      {
        consultationId: request.consultationId,
      }

    const listResult =
      await this.getConsultationSocketRealTimeListUseCase.execute(
        getConsultationSocketRealTimeListRequest
      )

    await this.realTimeUpdateHelper.sendUpdatedRealTimeList({
      clinicId: listResult?.clinicId ?? '',
      consultationRoomNumber:
        listResult?.consultationRoomNumber ?? RoomNumberType.ROOM_ONE,
      content: {
        id: listResult?.id ?? '',
        isOnsiteCanceled: listResult?.isOnsiteCanceled ?? false,
        consultationNumber: listResult?.consultationNumber ?? 0,
        doctor: {
          firstName: listResult?.doctor.firstName ?? '',
          lastName: listResult?.doctor.lastName ?? '',
        },
        patient: {
          firstName: listResult?.patient.firstName ?? '',
          lastName: listResult?.patient.lastName ?? '',
          gender: listResult?.patient.gender ?? GenderType.FEMALE,
          age: listResult?.patient.age ?? 0,
        },
        status:
          listResult?.status ?? ConsultationStatus.WAITING_FOR_BED_ASSIGNMENT,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })

    return res.status(200).json()
  }
}
