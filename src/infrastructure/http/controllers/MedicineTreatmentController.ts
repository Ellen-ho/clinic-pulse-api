import { Request, Response } from 'express'
import { UpdateConsultationToMedicineUseCase } from 'application/consultation/UpdateConsultationToMedicineUseCase'
import { CreateMedicineTreatmentUseCase } from 'application/treatment/CreateMedicineTreatmentUseCase'

export interface IMedicineTreatmentController {
  createMedicineTreatment: (req: Request, res: Response) => Promise<Response>
}

export class MedicineTreatmentController
  implements IMedicineTreatmentController
{
  constructor(
    private readonly createMedicineTreatmentUseCase: CreateMedicineTreatmentUseCase,
    private readonly updateConsultationToMedicineUseCase: UpdateConsultationToMedicineUseCase
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

    return res.status(200).json(medicineTreatment)
  }
}