import { IBaseRepository } from '../../../../domain/shared/IBaseRepository'
import { AcupunctureTreatment } from '../../../../domain/treatment/AcupunctureTreatment'

export interface IAcupunctureTreatmentRepository
  extends IBaseRepository<AcupunctureTreatment> {
  save: (acupunctureTreatment: AcupunctureTreatment) => Promise<void>
  getById: (id: string) => Promise<AcupunctureTreatment | null>
  findByConsultationId: (
    consultationId: string
  ) => Promise<AcupunctureTreatment | null>
}
