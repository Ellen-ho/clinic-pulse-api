import { SelectQueryBuilder } from 'typeorm'

export interface IRepositoryTx {
  start: (i?: Isolation) => Promise<void>
  rollback: () => Promise<void>
  end: () => Promise<void>
  getExecutor: () => IExecutor
}

export type Isolation =
  | 'READ UNCOMMITTED'
  | 'READ COMMITTED'
  | 'REPEATABLE READ'
  | 'SERIALIZABLE'

export interface IExecutor {
  save: (...args: any[]) => Promise<void>
  remove: (...args: any[]) => Promise<any>
  softRemove: (...args: any[]) => Promise<any>
  insert: (...args: any[]) => Promise<any>
  delete: (...args: any[]) => Promise<any>
  update: (...args: any[]) => Promise<any>
  createQueryBuilder: (...args: any[]) => SelectQueryBuilder<any>
}
