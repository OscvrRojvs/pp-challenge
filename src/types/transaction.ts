export type Currency = 'USD' | 'EUR' | 'CLP' | 'BTC'
export type TransactionType = 'credit' | 'debit'
export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  date: string
  description: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: Currency
  accountOrigin: string
  accountDestination: string
}

export interface FetchParams {
  page: number
  pageSize: PageSize
  filters: Filters
  sort?: Sort
}

export interface FetchResult {
  data: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Filters {
  dateFrom?: string
  dateTo?: string
  type?: TransactionType
  status?: TransactionStatus
  currency?: Currency
  amountMin?: number
  amountMax?: number
  search?: string
}

export type PageSize = 10 | 25 | 50

export type SortField = 'date' | 'amount'
export type SortDir = 'asc' | 'desc'

export interface Sort {
  field: SortField
  dir: SortDir
}
