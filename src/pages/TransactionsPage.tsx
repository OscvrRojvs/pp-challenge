import { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { TransactionsTable } from '../components/transactions/TransactionsTable'
import { TransactionsFilters } from '../components/transactions/TransactionsFilters'
import { TransactionsPagination } from '../components/transactions/TransactionsPagination'

export function TransactionsPage() {
  const {
    data,
    total,
    page,
    pageSize,
    totalPages,
    status,
    error,
    filters,
    sort,
    setFilter,
    resetFilters,
    setPage,
    setPageSize,
    setSort,
    retry,
    exportCsv,
  } = useTransactions()

  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportCsv()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Historial de Transacciones</h1>
            <p className="text-sm text-gray-500 mt-0.5">Módulo de revisión de movimientos de cuentas</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || status === 'loading'}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Exportar a CSV"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Exportando…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
        <TransactionsFilters
          filters={filters}
          onFilter={setFilter}
          onReset={resetFilters}
        />

        <TransactionsTable
          data={data}
          status={status}
          error={error}
          pageSize={pageSize}
          sort={sort}
          onSort={setSort}
          onRetry={retry}
          onReset={resetFilters}
        />

        {(status === 'success' || status === 'loading') && (
          <TransactionsPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPage={setPage}
            onPageSize={setPageSize}
          />
        )}
      </main>
    </div>
  )
}
