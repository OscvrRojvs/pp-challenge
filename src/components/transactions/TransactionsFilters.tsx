import { useState, useEffect } from 'react'
import { Filters, Currency, TransactionType, TransactionStatus } from '../../types/transaction'
import { useDebounce } from '../../hooks/useDebounce'

interface Props {
  filters: Filters
  onFilter: (payload: Partial<Filters>) => void
  onReset: () => void
}

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'CLP', label: 'CLP' },
  { value: 'BTC', label: 'BTC' },
]

const TYPES: { value: TransactionType; label: string }[] = [
  { value: 'credit', label: 'Crédito' },
  { value: 'debit', label: 'Débito' },
]

const STATUSES: { value: TransactionStatus; label: string }[] = [
  { value: 'completed', label: 'Completado' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'failed', label: 'Fallido' },
]

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

const labelClass = 'block text-xs font-medium text-gray-600 mb-1'

export function TransactionsFilters({ filters, onFilter, onReset }: Props) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    onFilter({ search: debouncedSearch || undefined })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  useEffect(() => {
    if (!filters.search && searchInput) {
      setSearchInput('')
    }
  }, [filters.search])

  const hasActiveFilters =
    !!filters.dateFrom ||
    !!filters.dateTo ||
    !!filters.type ||
    !!filters.status ||
    !!filters.currency ||
    filters.amountMin !== undefined ||
    filters.amountMax !== undefined ||
    !!filters.search

  const handleReset = () => {
    setSearchInput('')
    onReset()
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Filtros</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {/* Búsqueda */}
        <div className="col-span-2">
          <label htmlFor="filter-search" className={labelClass}>
            Buscar descripción
          </label>
          <input
            id="filter-search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar..."
            className={inputClass}
          />
        </div>

        {/* Fecha desde */}
        <div>
          <label htmlFor="filter-date-from" className={labelClass}>
            Desde
          </label>
          <input
            id="filter-date-from"
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => onFilter({ dateFrom: e.target.value || undefined })}
            className={inputClass}
          />
        </div>

        {/* Fecha hasta */}
        <div>
          <label htmlFor="filter-date-to" className={labelClass}>
            Hasta
          </label>
          <input
            id="filter-date-to"
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(e) => onFilter({ dateTo: e.target.value || undefined })}
            className={inputClass}
          />
        </div>

        {/* Tipo */}
        <div>
          <label htmlFor="filter-type" className={labelClass}>
            Tipo
          </label>
          <select
            id="filter-type"
            value={filters.type ?? ''}
            onChange={(e) =>
              onFilter({ type: (e.target.value as TransactionType) || undefined })
            }
            className={inputClass}
          >
            <option value="">Todos</option>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label htmlFor="filter-status" className={labelClass}>
            Estado
          </label>
          <select
            id="filter-status"
            value={filters.status ?? ''}
            onChange={(e) =>
              onFilter({ status: (e.target.value as TransactionStatus) || undefined })
            }
            className={inputClass}
          >
            <option value="">Todos</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Moneda */}
        <div>
          <label htmlFor="filter-currency" className={labelClass}>
            Moneda
          </label>
          <select
            id="filter-currency"
            value={filters.currency ?? ''}
            onChange={(e) =>
              onFilter({ currency: (e.target.value as Currency) || undefined })
            }
            className={inputClass}
          >
            <option value="">Todas</option>
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Monto mínimo */}
        <div>
          <label htmlFor="filter-amount-min" className={labelClass}>
            Monto mín.
          </label>
          <input
            id="filter-amount-min"
            type="number"
            min={0}
            value={filters.amountMin ?? ''}
            onChange={(e) =>
              onFilter({
                amountMin: e.target.value !== '' ? parseFloat(e.target.value) : undefined,
              })
            }
            placeholder="0"
            className={inputClass}
          />
        </div>

        {/* Monto máximo */}
        <div>
          <label htmlFor="filter-amount-max" className={labelClass}>
            Monto máx.
          </label>
          <input
            id="filter-amount-max"
            type="number"
            min={0}
            value={filters.amountMax ?? ''}
            onChange={(e) =>
              onFilter({
                amountMax: e.target.value !== '' ? parseFloat(e.target.value) : undefined,
              })
            }
            placeholder="∞"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
