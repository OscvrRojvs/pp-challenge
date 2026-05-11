import { PageSize } from '../../types/transaction'

interface Props {
  page: number
  totalPages: number
  total: number
  pageSize: PageSize
  onPage: (page: number) => void
  onPageSize: (size: PageSize) => void
}

const PAGE_SIZES: PageSize[] = [10, 25, 50]

export function TransactionsPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPage,
  onPageSize,
}: Props) {
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  const pageNumbers = buildPageNumbers(page, totalPages)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span>
          Mostrando{' '}
          <span className="font-medium text-gray-900">
            {total === 0 ? 0 : start}–{end}
          </span>{' '}
          de{' '}
          <span className="font-medium text-gray-900">{total}</span> resultados
        </span>
        <label htmlFor="page-size" className="sr-only">
          Registros por página
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSize(parseInt(e.target.value, 10) as PageSize)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Registros por página"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s} por página
            </option>
          ))}
        </select>
      </div>

      <nav className="flex items-center gap-1" aria-label="Paginación">
        <PageButton
          onClick={() => onPage(1)}
          disabled={page === 1}
          aria-label="Primera página"
        >
          «
        </PageButton>
        <PageButton
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          aria-label="Página anterior"
        >
          ‹
        </PageButton>

        {pageNumbers.map((n, i) =>
          n === '...' ? (
            <span key={`dots-${i}`} className="px-2 py-1 text-sm text-gray-400">
              …
            </span>
          ) : (
            <PageButton
              key={n}
              onClick={() => onPage(n as number)}
              active={n === page}
              aria-label={`Página ${n}`}
              aria-current={n === page ? 'page' : undefined}
            >
              {n}
            </PageButton>
          )
        )}

        <PageButton
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Página siguiente"
        >
          ›
        </PageButton>
        <PageButton
          onClick={() => onPage(totalPages)}
          disabled={page === totalPages}
          aria-label="Última página"
        >
          »
        </PageButton>
      </nav>
    </div>
  )
}

interface PageButtonProps {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  children: React.ReactNode
  'aria-label'?: string
  'aria-current'?: 'page' | undefined
}

function PageButton({ onClick, disabled, active, children, ...rest }: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      {...rest}
    >
      {children}
    </button>
  )
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = []

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', total)
  } else if (current >= total - 3) {
    pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }

  return pages
}
