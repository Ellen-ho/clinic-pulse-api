import { Patient } from '../../../../domain/patient/Patient'
import { IBaseRepository } from '../../../../domain/shared/IBaseRepository'

export interface IPatientRepository extends IBaseRepository<Patient> {
  findByName: (
    searchText: string
  ) => Promise<Array<{ id: string; fullName: string }>>
}
