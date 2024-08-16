import { Request, Response } from 'express'
import { UpdateConsultationToAcupunctureUseCase } from 'application/consultation/UpdateConsultationToAcupunctureUseCase'
import { CreateAcupunctureTreatmentUseCase } from 'application/treatment/CreateAcupunctureTreatmentUseCase'
import { UpdateAcupunctureTreatmentAssignBedUseCase } from 'application/treatment/UpdateAcupunctureTreatmentAssignBedUseCase'
import { UpdateAcupunctureTreatmentStartAtUseCase } from 'application/treatment/UpdateAcupunctureTreatmentStartAtUseCase'
import { UpdateConsultationToWaitAcupunctureUseCase } from 'application/consultation/UpdateConsultationToWaitAcupunctureUseCase'
import { UpdateAcupunctureTreatmentRemoveNeedleAtUseCase } from 'application/treatment/UpdateAcupunctureTreatmentRemoveNeedleAtUseCase'
import { UpdateConsultationToWaitRemoveNeedleUseCase } from 'application/consultation/UpdateConsultationToWaitRemoveNeedleUseCase'

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
    private readonly updateConsultationToWaitRemoveNeedleUseCase: UpdateConsultationToWaitRemoveNeedleUseCase
  ) {}

  public createAcupunctureTreatment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const acupunctureTreatment =
      await this.createAcupunctureTreatmentUseCase.execute()

    const request = {
      id: '6a7815ff-6d51-4351-b765-28b68ce61843',
      acupunctureTreatment: acupunctureTreatment.acupunctureTreatment,
    }
    await this.updateConsultationToAcupunctureUseCase.execute(request)

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
      id: '6a7815ff-6d51-4351-b765-28b68ce61843',
    }

    await this.updateConsultationToWaitAcupunctureUseCase.execute(
      consultationRequest
    )

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
      this.updateConsultationToWaitRemoveNeedleUseCase
        .execute(consultationRequest)
        .catch((error) => {
          console.error('Failed to update consultation status:', error)
        })
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

    return res.status(200).json()
  }
}
