interface Props {
  message: string
  onRetry: () => void
}

export function TransactionsError({ message, onRetry }: Props) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-12 h-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-base font-medium text-gray-800">Error al cargar las transacciones</p>
          <p className="text-sm text-gray-500 max-w-sm">{message}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </td>
    </tr>
  )
}
