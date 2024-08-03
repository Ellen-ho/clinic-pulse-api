import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import { IBaseRepository } from '../../domain/shared/IBaseRepository'
import { IEntityMapper } from '../../domain/shared/IEntityMapper'
import { IExecutor } from '../../domain/shared/IRepositoryTx'
import dotenv from 'dotenv'

dotenv.config()
const { NODE_ENV, POSTGRES_DB_NAME } = process.env

export class BaseRepository<E extends ObjectLiteral, DM>
  implements IBaseRepository<DM>
{
  private readonly repository: Repository<E>

  constructor(
    entity: EntityTarget<E>,
    private readonly mapper: IEntityMapper<E, DM>,
    private readonly dataSource: DataSource
  ) {
    this.repository = this.dataSource.getRepository(entity)
  }

  protected getRepo(): Repository<E> {
    return this.repository
  }

  protected async getQuery<T>(
    rawQuery: string,
    rawQueryParams?: any[]
  ): Promise<T> {
    return await this.dataSource.query(rawQuery, rawQueryParams)
  }

  protected getMapper(): IEntityMapper<E, DM> {
    return this.mapper
  }

  public async save(
    doaminModel: DM,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entity = this.mapper.toPersistence(doaminModel)
      await executor.save(entity)
    } catch (e) {
      throw new Error('repository save error: ' + (e as Error).message)
    }
  }

  public async saveAll(
    doaminModels: DM[],
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entities = doaminModels.map((doaminModel) =>
        this.mapper.toPersistence(doaminModel)
      )
      await executor.save(entities)
    } catch (e) {
      throw new Error('repository saveAll error: ' + (e as Error).message)
    }
  }

  public async clear(): Promise<void> {
    if (NODE_ENV !== 'test' && POSTGRES_DB_NAME !== 'test_db') {
      throw new Error(
        'Operation not allowed: you can use it under the test environment only'
      )
    }

    try {
      await this.getRepo().delete({})
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'repository clear error')
    }
  }
}
