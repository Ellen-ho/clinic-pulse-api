import { BaseRepository } from '../../../infrastructure/database/BaseRepository'
import { PatientEntity } from './PatientEntity'
import { Patient } from '../../../domain/patient/Patient'
import { DataSource } from 'typeorm'
import { PatientMapper } from './PatientMapper'
import { IPatientRepository } from '../../../domain/patient/interfaces/repositories/IPatientRepository'
import { RepositoryError } from '../../../infrastructure/error/RepositoryError'

export class PatientRepository
  extends BaseRepository<PatientEntity, Patient>
  implements IPatientRepository
{
  constructor(dataSource: DataSource) {
    super(PatientEntity, new PatientMapper(), dataSource)
  }

  public async findByName(
    searchText: string
  ): Promise<Array<{ id: string; fullName: string }>> {
    try {
      const rawPatients = await this.getQuery<
        Array<{ id: string; full_name: string }>
      >(
        `SELECT id, full_name 
         FROM patients 
         WHERE full_name ILIKE $1 
         LIMIT 100;`,
        [`%${searchText}%`]
      )

      return rawPatients.map((patient) => ({
        id: patient.id,
        fullName: patient.full_name,
      }))
    } catch (e) {
      throw new RepositoryError(
        'PatientRepository findByName error',
        e as Error
      )
    }
  }
}
