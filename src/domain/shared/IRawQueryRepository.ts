export interface IRawQueryRepository {
  query: <T>(rawQuery: string, rawQueryParams?: any[]) => Promise<T>
}
