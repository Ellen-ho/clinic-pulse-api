import { Clinic } from 'domain/clinic/Clinic'
import { IBaseRepository } from 'domain/shared/IBaseRepository'

export interface IClinicRepository extends IBaseRepository<Clinic> {
  findByAll: () => Promise<Array<{ id: string; name: string }>>
}
