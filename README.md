# Historial de Transacciones — PP Challenge

Módulo de historial de transacciones para operadores internos de un banco digital.

## Stack

| Capa | Elección |
|---|---|
| Build | Vite 8 |
| Framework | React 19 + TypeScript (strict) |
| Estilos | Tailwind CSS v4 |
| Routing | React Router v7 |
| Fechas | date-fns |

## Cómo correr

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Estructura de carpetas

```
src/
├── components/
│   └── transactions/
│       ├── TransactionRow.tsx       # Fila con tooltip de cuenta destino
│       ├── TransactionsEmpty.tsx    # Estado vacío
│       ├── TransactionsError.tsx    # Estado de error + reintentar
│       ├── TransactionsFilters.tsx  # Panel de filtros
│       ├── TransactionsPagination.tsx
│       ├── TransactionsSkeleton.tsx # Skeleton loaders
│       └── TransactionsTable.tsx   # Tabla con headers de ordenamiento
├── hooks/
│   ├── useDebounce.ts
│   └── useTransactions.ts          # Hook principal con useReducer
├── lib/
│   ├── api.ts                      # Mock de servidor: filtros, delay 600ms, error 10%
│   ├── csv.ts                      # Generación y descarga de CSV
│   ├── formatters.ts               # Intl.NumberFormat por moneda
│   ├── mockData.ts                 # 250 transacciones con seed determinista
│   └── urlParams.ts                # Serialización/parseo URL ↔ estado
├── pages/
│   └── TransactionsPage.tsx
├── reducers/
│   └── transactionsReducer.ts
└── types/
    └── transaction.ts
```

## Decisiones técnicas

**URL como fuente de verdad:** los filtros, página, page size y sort se serializan en la URL. Solo los valores no-default aparecen en los query params para mantener la URL limpia. Compartir la URL reproduce la vista exacta.

Ejemplo: `?dateFrom=2025-01-01&type=debit&currency=USD&page=2&sortField=amount&sortDir=asc`

**Race conditions en el fetch:** cada llamada incrementa un `requestId` en un `useRef`. Al resolver la promesa, solo se despacha si el id coincide con el actual, descartando respuestas de fetches anteriores que llegan tarde.

**Error simulado al 10%:** el mock del servidor lanza un error aleatorio el 10% de las veces para probar el estado de error y el botón de reintento.

**Formato BTC manual:** `Intl.NumberFormat` no soporta BTC. Se formatea manualmente: `₿0.00123456` con `.toFixed(8)`.

**localStorage para pageSize:** se persiste en `transactions:pageSize`. Prioridad: URL > localStorage > default (10).

## Bonus implementados

- **Tooltip cuenta destino:** hover sobre la cuenta origen muestra la cuenta destino.
- **Ordenamiento por columna:** headers de Fecha y Monto clickeables; mantiene filtros activos.
- **Persistencia de pageSize:** guardado en `localStorage`.

## Posibles mejoras

- Tests con Vitest + Testing Library.
- Virtualización con TanStack Virtual para datasets grandes.
- Paginación cursor-based para mejor rendimiento.
- i18n con `react-i18next`.
