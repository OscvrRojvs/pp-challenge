import { useReducer, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filters, PageSize, Sort } from '../types/transaction'
import { fetchTransactions, fetchAllFiltered } from '../lib/api'
import {
  transactionsReducer,
  createInitialState,
  TransactionsState,
} from '../reducers/transactionsReducer'
import { parseFiltersFromUrl, serializeFiltersToUrl } from '../lib/urlParams'
import { exportToCsv } from '../lib/csv'

const LS_PAGE_SIZE_KEY = 'transactions:pageSize'

function getStoredPageSize(): PageSize | null {
  try {
    const raw = localStorage.getItem(LS_PAGE_SIZE_KEY)
    if (raw === '10' || raw === '25' || raw === '50') return parseInt(raw, 10) as PageSize
  } catch {
    // ignore
  }
  return null
}

export function useTransactions() {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlState = parseFiltersFromUrl(searchParams)

  const storedPageSize = getStoredPageSize()
  const initialPageSize: PageSize =
    searchParams.has('pageSize') ? urlState.pageSize : (storedPageSize ?? urlState.pageSize)

  const [state, dispatch] = useReducer(
    transactionsReducer,
    createInitialState({
      filters: urlState.filters,
      page: urlState.page,
      pageSize: initialPageSize,
      sort: urlState.sort,
    })
  )

  const requestIdRef = useRef(0)

  const doFetch = useCallback(
    async (s: TransactionsState) => {
      const id = ++requestIdRef.current
      dispatch({ type: 'FETCH_START' })
      try {
        const result = await fetchTransactions({
          page: s.page,
          pageSize: s.pageSize,
          filters: s.filters,
          sort: s.sort,
        })
        if (requestIdRef.current === id) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result })
        }
      } catch (err) {
        if (requestIdRef.current === id) {
          const msg = err instanceof Error ? err.message : 'Error desconocido'
          dispatch({ type: 'FETCH_ERROR', payload: msg })
        }
      }
    },
    []
  )

  useEffect(() => {
    void doFetch(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters, state.page, state.pageSize, state.sort])

  useEffect(() => {
    const params = serializeFiltersToUrl({
      filters: state.filters,
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sort,
    })
    setSearchParams(params, { replace: true })
  }, [state.filters, state.page, state.pageSize, state.sort, setSearchParams])

  const setFilter = useCallback((payload: Partial<Filters>) => {
    dispatch({ type: 'SET_FILTER', payload })
  }, [])

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' })
  }, [])

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page })
  }, [])

  const setPageSize = useCallback((pageSize: PageSize) => {
    try {
      localStorage.setItem(LS_PAGE_SIZE_KEY, String(pageSize))
    } catch {
      // ignore
    }
    dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize })
  }, [])

  const setSort = useCallback((sort: Sort) => {
    dispatch({ type: 'SET_SORT', payload: sort })
  }, [])

  const retry = useCallback(() => {
    void doFetch(state)
  }, [doFetch, state])

  const exportCsv = useCallback(async () => {
    try {
      const data = await fetchAllFiltered({
        filters: state.filters,
        sort: state.sort,
      })
      exportToCsv(data)
    } catch {
      // silently ignore export errors
    }
  }, [state.filters, state.sort])

  return {
    data: state.data,
    total: state.total,
    page: state.page,
    pageSize: state.pageSize,
    totalPages: state.totalPages,
    status: state.status,
    error: state.error,
    filters: state.filters,
    sort: state.sort,
    setFilter,
    resetFilters,
    setPage,
    setPageSize,
    setSort,
    retry,
    exportCsv,
  }
}
