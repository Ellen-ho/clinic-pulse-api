import { Granularity } from '../../domain/common'

export function getDateFormat(granularity: Granularity): string {
  switch (granularity) {
    case Granularity.DAY:
      return 'YYYY-MM-DD'
    case Granularity.WEEK:
      return 'IYYY-IW'
    case Granularity.MONTH:
      return 'YYYY-MM'
    case Granularity.YEAR:
      return 'YYYY'
    default:
      return 'YYYY-MM-DD'
  }
}
