import { Granularity } from '../../domain/common'

export function getDateFormat(granularity: Granularity): string {
  switch (granularity) {
    case Granularity.DAY:
      return 'YYYY-MM-DD'
    case Granularity.WEEK:
      return 'IYYY-IW' // ISO week number and year
    case Granularity.MONTH:
      return 'YYYY-MM' // Year and month
    case Granularity.YEAR:
      return 'YYYY' // Just the year
    default:
      return 'YYYY-MM-DD' // Default case to handle any unexpected values
  }
}
