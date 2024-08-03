import { Doctor } from '../../../domain/doctor/Doctor'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { UserMapper } from '../user/UserMapper'
import { DoctorEntity } from './DoctorEntity'

export class DoctorMapper implements IEntityMapper<DoctorEntity, Doctor> {
  public toDomainModel(entity: DoctorEntity): Doctor {
    const doctor = new Doctor({
      id: entity.id,
      avatar: entity.avatar === 'null' ? null : entity.avatar,
      firstName: entity.firstName,
      lastName: entity.lastName,
      gender: entity.gender,
      birthDate: entity.birthDate,
      onboardDate: entity.onboardDate,
      resignationDate: entity.resignationDate,
      user: new UserMapper().toDomainModel(entity.user),
    })
    return doctor
  }

  public toPersistence(domainModel: Doctor): DoctorEntity {
    const doctorEntity = new DoctorEntity()
    doctorEntity.id = domainModel.id
    doctorEntity.avatar = domainModel.avatar
    doctorEntity.firstName = domainModel.firstName
    doctorEntity.lastName = domainModel.lastName
    doctorEntity.gender = domainModel.gender
    doctorEntity.birthDate = domainModel.birthDate
    doctorEntity.onboardDate = domainModel.onboardDate
    doctorEntity.resignationDate = domainModel.resignationDate
    doctorEntity.user = new UserMapper().toPersistence(domainModel.user)

    return doctorEntity
  }
}
