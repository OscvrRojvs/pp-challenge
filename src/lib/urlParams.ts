import { Filters, PageSize, Sort, SortField, SortDir, TransactionType, TransactionStatus, Currency } from '../types/transaction'

const DEFAULT_PAGE_SIZE: PageSize = 10
const DEFAULT_SORT: Sort = { field: 'date', dir: 'desc' }
const VALID_PAGE_SIZES: PageSize[] = [10, 25, 50]
const VALID_TYPES: TransactionType[] = ['credit', 'debit']
const VALID_STATUSES: TransactionStatus[] = ['completed', 'pending', 'failed']
const VALID_CURRENCIES: Currency[] = ['USD', 'EUR', 'CLP', 'BTC']
const VALID_SORT_FIELDS: SortField[] = ['date', 'amount']
const VALID_SORT_DIRS: SortDir[] = ['asc', 'desc']

export interface UrlState {
  filters: Filters
  page: number
  pageSize: PageSize
  sort: Sort
}

export function parseFiltersFromUrl(searchParams: URLSearchParams): UrlState {
  const filters: Filters = {}

  const dateFrom = searchParams.get('dateFrom')
  if (dateFrom) filters.dateFrom = dateFrom

  const dateTo = searchParams.get('dateTo')
  if (dateTo) filters.dateTo = dateTo

  const type = searchParams.get('type')
  if (type && (VALID_TYPES as string[]).includes(type)) {
    filters.type = type as TransactionType
  }

  const status = searchParams.get('status')
  if (status && (VALID_STATUSES as string[]).includes(status)) {
    filters.status = status as TransactionStatus
  }

  const currency = searchParams.get('currency')
  if (currency && (VALID_CURRENCIES as string[]).includes(currency)) {
    filters.currency = currency as Currency
  }

  const amountMin = searchParams.get('amountMin')
  if (amountMin !== null) {
    const n = parseFloat(amountMin)
    if (!isNaN(n)) filters.amountMin = n
  }

  const amountMax = searchParams.get('amountMax')
  if (amountMax !== null) {
    const n = parseFloat(amountMax)
    if (!isNaN(n)) filters.amountMax = n
  }

  const search = searchParams.get('search')
  if (search) filters.search = search

  const pageRaw = searchParams.get('page')
  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1

  const pageSizeRaw = searchParams.get('pageSize')
  const parsedPageSize = pageSizeRaw ? parseInt(pageSizeRaw, 10) : null
  const pageSize: PageSize =
    parsedPageSize !== null && (VALID_PAGE_SIZES as number[]).includes(parsedPageSize)
      ? (parsedPageSize as PageSize)
      : DEFAULT_PAGE_SIZE

  const sortField = searchParams.get('sortField')
  const sortDir = searchParams.get('sortDir')
  const sort: Sort = {
    field:
      sortField && (VALID_SORT_FIELDS as string[]).includes(sortField)
        ? (sortField as SortField)
        : DEFAULT_SORT.field,
    dir:
      sortDir && (VALID_SORT_DIRS as string[]).includes(sortDir)
        ? (sortDir as SortDir)
        : DEFAULT_SORT.dir,
  }

  return { filters, page, pageSize, sort }
}

export function serializeFiltersToUrl(state: UrlState): URLSearchParams {
  const params = new URLSearchParams()

  if (state.filters.dateFrom) params.set('dateFrom', state.filters.dateFrom)
  if (state.filters.dateTo) params.set('dateTo', state.filters.dateTo)
  if (state.filters.type) params.set('type', state.filters.type)
  if (state.filters.status) params.set('status', state.filters.status)
  if (state.filters.currency) params.set('currency', state.filters.currency)
  if (state.filters.amountMin !== undefined) params.set('amountMin', String(state.filters.amountMin))
  if (state.filters.amountMax !== undefined) params.set('amountMax', String(state.filters.amountMax))
  if (state.filters.search) params.set('search', state.filters.search)

  if (state.page > 1) params.set('page', String(state.page))
  if (state.pageSize !== DEFAULT_PAGE_SIZE) params.set('pageSize', String(state.pageSize))

  if (state.sort.field !== DEFAULT_SORT.field || state.sort.dir !== DEFAULT_SORT.dir) {
    params.set('sortField', state.sort.field)
    params.set('sortDir', state.sort.dir)
  }

  return params
}
