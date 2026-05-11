import { Transaction, Filters, PageSize, FetchResult, Sort } from '../types/transaction'

export interface TransactionsState {
  data: Transaction[]
  total: number
  totalPages: number
  page: number
  pageSize: PageSize
  filters: Filters
  sort: Sort
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
}

export type TransactionsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: FetchResult }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<Filters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: PageSize }
  | { type: 'SET_SORT'; payload: Sort }

export const INITIAL_FILTERS: Filters = {}

export const DEFAULT_PAGE_SIZE: PageSize = 10

export function createInitialState(overrides?: Partial<TransactionsState>): TransactionsState {
  return {
    data: [],
    total: 0,
    totalPages: 1,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    filters: INITIAL_FILTERS,
    sort: { field: 'date', dir: 'desc' },
    status: 'idle',
    error: null,
    ...overrides,
  }
}

export function transactionsReducer(
  state: TransactionsState,
  action: TransactionsAction
): TransactionsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null }

    case 'FETCH_SUCCESS':
      return {
        ...state,
        status: 'success',
        data: action.payload.data,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
        page: action.payload.page,
        pageSize: action.payload.pageSize as PageSize,
        error: null,
      }

    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.payload }

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        page: 1,
      }

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: INITIAL_FILTERS,
        page: 1,
        sort: { field: 'date', dir: 'desc' },
      }

    case 'SET_PAGE':
      return { ...state, page: action.payload }

    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload, page: 1 }

    case 'SET_SORT':
      return { ...state, sort: action.payload, page: 1 }
  }
}
