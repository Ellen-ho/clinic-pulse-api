const getOffset = (limit: number = 10, page: number = 1): number =>
  (page - 1) * limit

const getRecordOffset = (limit?: number, page?: number): number | undefined => {
  if (limit !== undefined && page !== undefined) return (page - 1) * limit

  return undefined
}

interface Pagination {
  pages: number[]
  totalPage: number
  currentPage: number
  prev: number
  next: number
}

const getPagination = (
  limit: number = 10,
  page: number = 1,
  total: number = 50
): Pagination => {
  const totalPage: number = Math.ceil(total / limit)
  const pages: number[] = Array.from(
    { length: totalPage },
    (_, index) => index + 1
  )
  const currentPage: number = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prev: number = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next: number = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next,
  }
}

export { getOffset, getRecordOffset, getPagination }
