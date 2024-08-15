import { Request, Response } from 'express'
import { UpdateConsultationToAcupunctureUseCase } from 'application/consultation/UpdateConsultationToAcupunctureUseCase'
import { CreateAcupunctureTreatmentUseCase } from 'application/treatment/CreateAcupunctureTreatmentUseCase'

export interface IAcupunctureTreatmentController {
  createAcupunctureTreatment: (req: Request, res: Response) => Promise<Response>
}

export class AcupunctureTreatmentController
  implements IAcupunctureTreatmentController
{
  constructor(
    private readonly createAcupunctureTreatmentUseCase: CreateAcupunctureTreatmentUseCase,
    private readonly updateConsultationToAcupunctureUseCase: UpdateConsultationToAcupunctureUseCase
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
}
