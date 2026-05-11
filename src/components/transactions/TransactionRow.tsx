import { useState } from 'react'
import { Transaction } from '../../types/transaction'
import { formatCurrency, formatDate } from '../../lib/formatters'

interface Props {
  transaction: Transaction
}

const TYPE_LABELS: Record<Transaction['type'], string> = {
  credit: 'Crédito',
  debit: 'Débito',
}

const STATUS_LABELS: Record<Transaction['status'], string> = {
  completed: 'Completado',
  pending: 'Pendiente',
  failed: 'Fallido',
}

const STATUS_STYLES: Record<Transaction['status'], string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
}

export function TransactionRow({ transaction: tx }: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  const isFailed = tx.status === 'failed'
  const rowClass = isFailed
    ? 'border-b border-gray-100 bg-red-50 opacity-70 hover:opacity-90 transition-opacity'
    : 'border-b border-gray-100 hover:bg-gray-50 transition-colors'

  const amountClass =
    tx.type === 'debit'
      ? 'text-right font-medium text-red-600'
      : 'text-right font-medium text-green-600'

  return (
    <tr className={rowClass}>
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {formatDate(tx.date)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">
        {tx.description}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            tx.type === 'credit'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-orange-100 text-orange-800'
          }`}
        >
          {TYPE_LABELS[tx.type]}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[tx.status]}`}
        >
          {STATUS_LABELS[tx.status]}
        </span>
      </td>
      <td className={`px-4 py-3 text-sm whitespace-nowrap ${amountClass}`}>
        {tx.type === 'debit' ? '−' : '+'}
        {formatCurrency(tx.amount, tx.currency)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div
          className="relative inline-block"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span className="font-mono text-xs cursor-default underline decoration-dotted decoration-gray-400">
            {tx.accountOrigin}
          </span>
          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-1 z-10 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
              <span className="text-gray-400 mr-1">Destino:</span>
              {tx.accountDestination}
              <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900" />
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
