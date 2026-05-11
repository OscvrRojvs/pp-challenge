interface Props {
  onReset: () => void
}

export function TransactionsEmpty({ onReset }: Props) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg
            className="w-12 h-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17v-2m3 2v-4m3 4v-6M5 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
            />
          </svg>
          <p className="text-base font-medium text-gray-700">Sin resultados</p>
          <p className="text-sm">No hay transacciones que coincidan con los filtros aplicados.</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </td>
    </tr>
  )
}
