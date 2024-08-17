import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientEntity } from './PatientEntity'
import { Patient } from '../../../domain/patient/Patient'

export class PatientMapper implements IEntityMapper<PatientEntity, Patient> {
  public toDomainModel(entity: PatientEntity): Patient {
    const patient = new Patient({
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: entity.fullName,
      birthDate: entity.birthDate,
      gender: entity.gender,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
    return patient
  }

  public toPersistence(domainModel: Patient): PatientEntity {
    const patientEntity = new PatientEntity()
    patientEntity.id = domainModel.id
    patientEntity.firstName = domainModel.firstName
    patientEntity.lastName = domainModel.lastName
    patientEntity.fullName = domainModel.fullName
    patientEntity.birthDate = domainModel.birthDate
    patientEntity.gender = domainModel.gender
    patientEntity.createdAt = domainModel.createdAt
    patientEntity.updatedAt = domainModel.updatedAt

    return patientEntity
  }
}
