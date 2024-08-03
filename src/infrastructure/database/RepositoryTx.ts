import { QueryRunner } from 'typeorm'
import {
  IExecutor,
  IRepositoryTx,
  Isolation,
} from '../../domain/shared/IRepositoryTx'
import { PostgresDatabase } from './PostgresDatabase'

export class RepositoryTx implements IRepositoryTx {
  private queryRunner!: QueryRunner

  constructor() {
    PostgresDatabase.getInstance()
      .then(async (database) => {
        const dataSource = database.getDataSource()
        this.queryRunner = dataSource.createQueryRunner()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  public async start(isolation: Isolation = 'READ COMMITTED'): Promise<void> {
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction(isolation)
  }

  public async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction()
    await this.queryRunner.release()
  }

  public async end(): Promise<void> {
    await this.queryRunner.commitTransaction()
    await this.queryRunner.release()
  }

  public getExecutor(): IExecutor {
    return this.queryRunner.manager
  }
}
