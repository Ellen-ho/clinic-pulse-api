import { CreateAcupunctureAndMedicineUseCase } from 'application/common/CreateAcupunctureAndMedicineUseCase'
import { GetDoctorsAndClinicsUseCase } from '../../../application/common/GetDoctorsAndClinicsUseCase'
import { Request, Response } from 'express'
import { UpdateConsultationToAcupunctureUseCase } from 'application/consultation/UpdateConsultationToAcupunctureUseCase'
import {
  GetConsultationSocketRealTimeCountRequest,
  GetConsultationSocketRealTimeCountUseCase,
} from 'application/consultation/GetConsultationSocketRealTimeCountUseCase'
import { RealTimeUpdateHelper } from 'application/consultation/RealTimeUpdateHelper'
import {
  GetConsultationSocketRealTimeListRequest,
  GetConsultationSocketRealTimeListUseCase,
} from 'application/consultation/GetConsultationSocketRealTimeListUseCase'
import { GenderType } from 'domain/common'
import { ConsultationStatus } from 'domain/consultation/Consultation'
import { RoomNumberType } from 'domain/consultationRoom/ConsultationRoom'
export interface ICommonController {
  getDoctorsAndClinics: (req: Request, res: Response) => Promise<Response>
}

export class CommonController implements ICommonController {
  constructor(
    private readonly getDoctorsAndClinicsUseCase: GetDoctorsAndClinicsUseCase,
    private readonly createAcupunctureAndMedicineUseCase: CreateAcupunctureAndMedicineUseCase,
    private readonly updateConsultationToAcupunctureUseCase: UpdateConsultationToAcupunctureUseCase,
    private readonly getConsultationSocketRealTimeCountUseCase: GetConsultationSocketRealTimeCountUseCase,
    private readonly getConsultationSocketRealTimeListUseCase: GetConsultationSocketRealTimeListUseCase,
    private readonly realTimeUpdateHelper: RealTimeUpdateHelper
  ) {}

  public getDoctorsAndClinics = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const result = await this.getDoctorsAndClinicsUseCase.execute()

    return res.status(200).json(result)
  }

  public createAcupunctureAndMedicine = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const treatments = await this.createAcupunctureAndMedicineUseCase.execute()

    const request = {
      id: '4d122970-8e74-49fe-8263-5b823562d02b',
      acupunctureTreatment: treatments.acupunctureTreatment,
      MedicineTreatment: treatments.medicineTreatment,
    }
    await this.updateConsultationToAcupunctureUseCase.execute(request)

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
          listResult?.status ?? ConsultationStatus.WAITING_FOR_BED_ASSIGNMENT,
        timeSlotId: listResult?.timeSlotId ?? '',
      },
    })

    return res.status(200).json()
  }
}
