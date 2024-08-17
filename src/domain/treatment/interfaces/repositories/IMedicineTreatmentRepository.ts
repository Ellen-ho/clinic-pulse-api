import { IBaseRepository } from 'domain/shared/IBaseRepository'
import { MedicineTreatment } from 'domain/treatment/MedicineTreatment'

export interface IMedicineTreatmentRepository
  extends IBaseRepository<MedicineTreatment> {
  save: (medicineTreatment: MedicineTreatment) => Promise<void>
  getById: (id: string) => Promise<MedicineTreatment | null>
}
