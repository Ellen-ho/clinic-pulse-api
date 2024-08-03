export interface IEntityMapper<E, DM> {
  toPersistence: (domainModel: DM) => E
  toDomainModel: (entity: E) => DM
}
