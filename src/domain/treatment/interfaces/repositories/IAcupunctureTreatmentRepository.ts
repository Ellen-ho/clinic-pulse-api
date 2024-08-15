import { IBaseRepository } from 'domain/shared/IBaseRepository'
import { AcupunctureTreatment } from 'domain/treatment/AcupunctureTreatment'

export interface IAcupunctureTreatmentRepository
  extends IBaseRepository<AcupunctureTreatment> {
  save: (acupunctureTreatment: AcupunctureTreatment) => Promise<void>
}
