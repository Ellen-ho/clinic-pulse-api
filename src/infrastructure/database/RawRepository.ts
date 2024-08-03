import { DataSource } from 'typeorm'
import { IRawQueryRepository } from '../../domain/shared/IRawQueryRepository'
export class RawQueryRepository implements IRawQueryRepository {
  constructor(private readonly dataSource: DataSource) {}
  public async query<T>(rawQuery: string, rawQueryParams?: any[]): Promise<T> {
    return await this.dataSource.query(rawQuery, rawQueryParams)
  }
}
