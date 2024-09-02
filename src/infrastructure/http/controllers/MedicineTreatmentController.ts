import { Request, Response } from 'express'
import { UpdateConsultationToMedicineUseCase } from '../../../application/consultation/UpdateConsultationToMedicineUseCase'
import { CreateMedicineTreatmentUseCase } from '../../../application/treatment/CreateMedicineTreatmentUseCase'
import { UpdateMedicineTreatmentUseCase } from '../../../application/treatment/UpdateMedicineTreatmentUseCase'
import { UpdateConsultationCheckOutAtUseCase } from '../../../application/consultation/UpdateConsultationCheckOutAtUseCase'
import {
  GetConsultationSocketRealTimeCountRequest,
  GetConsultationSocketRealTimeCountUseCase,
} from '../../../application/consultation/GetConsultationSocketRealTimeCountUseCase'
import { RealTimeUpdateHelper } from '../../../application/consultation/RealTimeUpdateHelper'
import { GenderType } from '../../../domain/common'
import { ConsultationStatus } from '../../../domain/consultation/Consultation'
import {
  GetConsultationSocketRealTimeListRequest,
  GetConsultationSocketRealTimeListUseCase,
} from '../../../application/consultation/GetConsultationSocketRealTimeListUseCase'
import { RoomNumberType } from '../../../domain/consultationRoom/ConsultationRoom'

export interface IMedicineTreatmentController {
  createMedicineTreatment: (req: Request, res: Response) => Promise<Response>
  updateMedicineTreatment: (req: Request, res: Response) => Promise<Response>
}

export class MedicineTreatmentController
  implements IMedicineTreatmentController
{
  constructor(
    private readonly createMedicineTreatmentUseCase: CreateMedicineTreatmentUseCase,
    private readonly updateConsultationToMedicineUseCase: UpdateConsultationToMedicineUseCase,
    private readonly updateMedicineTreatmentUseCase: UpdateMedicineTreatmentUseCase,
    private readonly updateConsultationCheckOutAtUseCase: UpdateConsultationCheckOutAtUseCase,
    private readonly getConsultationSocketRealTimeCountUseCase: GetConsultationSocketRealTimeCountUseCase,
    private readonly getConsultationSocketRealTimeListUseCase: GetConsultationSocketRealTimeListUseCase,
    private readonly realTimeUpdateHelper: RealTimeUpdateHelper
  ) {}

  public createMedicineTreatment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const medicineTreatment =
      await this.createMedicineTreatmentUseCase.execute()

    const request = {
      id: '6a7815ff-6d51-4351-b765-28b68ce61843',
      medicineTreatment: medicineTreatment.medicineTreatment,
    }
    await this.updateConsultationToMedicineUseCase.execute(request)

    const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
      {
        consultationId: request.id,
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
        consultationId: request.id,
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

    return res.status(200).json(medicineTreatment)
  }

  public updateMedicineTreatment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const medicineTreatmentRequest = {
      id: req.params.id,
    }
    await this.updateMedicineTreatmentUseCase.execute(medicineTreatmentRequest)

    const consultationRequest = {
      id: '6a7815ff-6d51-4351-b765-28b68ce61843',
    }
    await this.updateConsultationCheckOutAtUseCase.execute(consultationRequest)

    const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
      {
        consultationId: consultationRequest.id,
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
        consultationId: consultationRequest.id,
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
}
