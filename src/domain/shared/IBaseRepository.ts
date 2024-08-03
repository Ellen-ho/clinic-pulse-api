import { IExecutor } from './IRepositoryTx'

export interface IBaseRepository<DomainModel> {
  save: (entity: DomainModel, executor?: IExecutor) => Promise<void>
}
