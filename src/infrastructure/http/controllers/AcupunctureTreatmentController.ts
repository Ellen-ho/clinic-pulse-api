import { Request, Response } from 'express'
import { UpdateConsultationToAcupunctureUseCase } from '../../../application/consultation/UpdateConsultationToAcupunctureUseCase'
import { CreateAcupunctureTreatmentUseCase } from '../../../application/treatment/CreateAcupunctureTreatmentUseCase'
import { UpdateAcupunctureTreatmentAssignBedUseCase } from '../../../application/treatment/UpdateAcupunctureTreatmentAssignBedUseCase'
import { UpdateAcupunctureTreatmentStartAtUseCase } from '../../../application/treatment/UpdateAcupunctureTreatmentStartAtUseCase'
import { UpdateConsultationToWaitAcupunctureUseCase } from '../../../application/consultation/UpdateConsultationToWaitAcupunctureUseCase'
import { UpdateAcupunctureTreatmentRemoveNeedleAtUseCase } from '../../../application/treatment/UpdateAcupunctureTreatmentRemoveNeedleAtUseCase'
import { UpdateConsultationToWaitRemoveNeedleUseCase } from '../../../application/consultation/UpdateConsultationToWaitRemoveNeedleUseCase'
import {
  GetConsultationSocketRealTimeCountRequest,
  GetConsultationSocketRealTimeCountUseCase,
} from 'application/consultation/GetConsultationSocketRealTimeCountUseCase'
import { IRealTimeUpdateHelper } from 'application/consultation/RealTimeUpdateHelper'
import { ConsultationRepository } from 'infrastructure/entities/consultation/ConsultationRepository'
import { UpdateConsultationToMedicineUseCase } from 'application/consultation/UpdateConsultationToMedicineUseCase'
import {
  GetConsultationSocketRealTimeListRequest,
  GetConsultationSocketRealTimeListUseCase,
} from 'application/consultation/GetConsultationSocketRealTimeListUseCase'
import { GenderType } from 'domain/common'
import { ConsultationStatus } from 'domain/consultation/Consultation'
import { RoomNumberType } from 'domain/consultationRoom/ConsultationRoom'

export interface IAcupunctureTreatmentController {
  createAcupunctureTreatment: (req: Request, res: Response) => Promise<Response>
  updateAcupunctureTreatmentAssignBed: (
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
}

export class AcupunctureTreatmentController
  implements IAcupunctureTreatmentController
{
  constructor(
    private readonly createAcupunctureTreatmentUseCase: CreateAcupunctureTreatmentUseCase,
    private readonly updateConsultationToAcupunctureUseCase: UpdateConsultationToAcupunctureUseCase,
    private readonly updateAcupunctureTreatmentAssignBedUseCase: UpdateAcupunctureTreatmentAssignBedUseCase,
    private readonly updateAcupunctureTreatmentStartAtUseCase: UpdateAcupunctureTreatmentStartAtUseCase,
    private readonly updateAcupunctureTreatmentRemoveNeedleAtUseCase: UpdateAcupunctureTreatmentRemoveNeedleAtUseCase,
    private readonly updateConsultationToWaitAcupunctureUseCase: UpdateConsultationToWaitAcupunctureUseCase,
    private readonly updateConsultationToWaitRemoveNeedleUseCase: UpdateConsultationToWaitRemoveNeedleUseCase,
    private readonly getConsultationSocketRealTimeCountUseCase: GetConsultationSocketRealTimeCountUseCase,
    private readonly getConsultationSocketRealTimeListUseCase: GetConsultationSocketRealTimeListUseCase,
    private readonly updateConsultationToMedicineUseCase: UpdateConsultationToMedicineUseCase,
    private readonly realTimeUpdateHelper: IRealTimeUpdateHelper,
    private readonly consultationRepository: ConsultationRepository
  ) {}

  public createAcupunctureTreatment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const acupunctureTreatment =
      await this.createAcupunctureTreatmentUseCase.execute()

    const request = {
      id: 'e3b82db9-8d99-4b47-b419-5d287bb4cce5', // con id
      acupunctureTreatment: acupunctureTreatment.acupunctureTreatment,
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

    return res.status(200).json(acupunctureTreatment)
  }

  public updateAcupunctureTreatmentAssignBed = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const acupunctureTreatmentRequest = {
      id: req.params.id,
      bedId: req.body.bedId,
    }

    await this.updateAcupunctureTreatmentAssignBedUseCase.execute(
      acupunctureTreatmentRequest
    )

    const consultationRequest = {
      id: '4d122970-8e74-49fe-8263-5b823562d02b',
    }

    await this.updateConsultationToWaitAcupunctureUseCase.execute(
      consultationRequest
    )

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
    const acupunctureTreatmentRequest = {
      id: req.params.id,
      needleCounts: req.body.needleCounts,
    }
    await this.updateAcupunctureTreatmentStartAtUseCase.execute(
      acupunctureTreatmentRequest
    )

    const consultationRequest = {
      id: '6a7815ff-6d51-4351-b765-28b68ce61843',
    }

    setTimeout(() => {
      void (async () => {
        try {
          await this.updateConsultationToWaitRemoveNeedleUseCase.execute(
            consultationRequest
          )
          const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
            {
              consultationId: consultationRequest.id,
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
    const acupunctureTreatmentRequest = {
      id: req.params.id,
    }
    await this.updateAcupunctureTreatmentRemoveNeedleAtUseCase.execute(
      acupunctureTreatmentRequest
    )

    const result = await this.consultationRepository.checkMedicineTreatment(
      acupunctureTreatmentRequest.id
    )

    if (result !== null) {
      await this.updateConsultationToMedicineUseCase.execute({
        id: result.consultationId,
        medicineTreatment: result.medicineTreatment,
      })

      const getConsultationSocketRealTimeCountRequest: GetConsultationSocketRealTimeCountRequest =
        {
          consultationId: result.consultationId,
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
          consultationId: result.consultationId,
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
    }

    return res.status(200).json()
  }
}
