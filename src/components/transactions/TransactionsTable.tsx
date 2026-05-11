import { Transaction, Sort, SortField } from '../../types/transaction'
import { TransactionRow } from './TransactionRow'
import { TransactionsSkeleton } from './TransactionsSkeleton'
import { TransactionsEmpty } from './TransactionsEmpty'
import { TransactionsError } from './TransactionsError'

interface Props {
  data: Transaction[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  pageSize: number
  sort: Sort
  onSort: (sort: Sort) => void
  onRetry: () => void
  onReset: () => void
}

function SortIcon({ field, sort }: { field: SortField; sort: Sort }) {
  if (sort.field !== field) {
    return (
      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
  }
  return sort.dir === 'asc' ? (
    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function SortableHeader({
  field,
  label,
  sort,
  onSort,
  className = '',
}: {
  field: SortField
  label: string
  sort: Sort
  onSort: (sort: Sort) => void
  className?: string
}) {
  const handleClick = () => {
    onSort({
      field,
      dir: sort.field === field && sort.dir === 'asc' ? 'desc' : 'asc',
    })
  }
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1 hover:text-gray-800 transition-colors"
        aria-label={`Ordenar por ${label}`}
      >
        {label}
        <SortIcon field={field} sort={sort} />
      </button>
    </th>
  )
}

export function TransactionsTable({
  data,
  status,
  error,
  pageSize,
  sort,
  onSort,
  onRetry,
  onReset,
}: Props) {
  const isLoading = status === 'idle' || status === 'loading'

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader field="date" label="Fecha" sort={sort} onSort={onSort} />
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <SortableHeader field="amount" label="Monto" sort={sort} onSort={onSort} className="text-right" />
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Cuenta Origen
            </th>
          </tr>
        </thead>
        <tbody
          className="divide-y divide-gray-100 bg-white"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading && <TransactionsSkeleton rows={pageSize} />}
          {status === 'error' && error && (
            <TransactionsError message={error} onRetry={onRetry} />
          )}
          {status === 'success' && data.length === 0 && (
            <TransactionsEmpty onReset={onReset} />
          )}
          {status === 'success' &&
            data.length > 0 &&
            data.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)}
        </tbody>
      </table>
    </div>
  )
}
