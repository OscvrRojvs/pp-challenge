import { FetchParams, FetchResult, Filters, Sort, Transaction } from '../types/transaction'
import { MOCK_DATA } from './mockData'

function applyFilters(data: Transaction[], filters: Filters): Transaction[] {
  return data.filter((tx) => {
    if (filters.dateFrom) {
      if (tx.date < filters.dateFrom) return false
    }
    if (filters.dateTo) {
      const toEnd = filters.dateTo + 'T23:59:59.999Z'
      if (tx.date > toEnd) return false
    }
    if (filters.type && tx.type !== filters.type) return false
    if (filters.status && tx.status !== filters.status) return false
    if (filters.currency && tx.currency !== filters.currency) return false
    if (filters.amountMin !== undefined && tx.amount < filters.amountMin) return false
    if (filters.amountMax !== undefined && tx.amount > filters.amountMax) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!tx.description.toLowerCase().includes(q)) return false
    }
    return true
  })
}

function applySort(data: Transaction[], sort: Sort): Transaction[] {
  const sorted = [...data]
  sorted.sort((a, b) => {
    let cmp = 0
    if (sort.field === 'date') {
      cmp = a.date.localeCompare(b.date)
    } else {
      cmp = a.amount - b.amount
    }
    return sort.dir === 'asc' ? cmp : -cmp
  })
  return sorted
}

export async function fetchTransactions(params: FetchParams): Promise<FetchResult> {
  await new Promise<void>((resolve) => setTimeout(resolve, 600))

  if (Math.random() < 0.1) {
    throw new Error('Error simulado del servidor. Por favor intenta nuevamente.')
  }

  const filtered = applyFilters(MOCK_DATA, params.filters)
  const sort = params.sort ?? { field: 'date' as const, dir: 'desc' as const }
  const sorted = applySort(filtered, sort)

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize))
  const safePage = Math.min(params.page, totalPages)
  const start = (safePage - 1) * params.pageSize
  const data = sorted.slice(start, start + params.pageSize)

  return { data, total, page: safePage, pageSize: params.pageSize, totalPages }
}

export interface AllFilteredParams {
  filters: Filters
  sort?: Sort
}

export async function fetchAllFiltered(params: AllFilteredParams): Promise<Transaction[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, 200))

  const filtered = applyFilters(MOCK_DATA, params.filters)
  const sort = params.sort ?? { field: 'date' as const, dir: 'desc' as const }
  return applySort(filtered, sort)
}
