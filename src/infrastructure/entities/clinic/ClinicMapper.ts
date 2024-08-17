import { Clinic } from '../../../domain/clinic/Clinic'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { ClinicEntity } from './ClinicEntity'

export class ClinicMapper implements IEntityMapper<ClinicEntity, Clinic> {
  public toDomainModel(entity: ClinicEntity): Clinic {
    const clinic = new Clinic({
      id: entity.id,
      name: entity.name,
      address: entity.address,
    })
    return clinic
  }

  public toPersistence(domainModel: Clinic): ClinicEntity {
    const doctorEntity = new ClinicEntity()
    doctorEntity.id = domainModel.id
    doctorEntity.name = domainModel.name
    doctorEntity.address = domainModel.address
    return doctorEntity
  }
}
