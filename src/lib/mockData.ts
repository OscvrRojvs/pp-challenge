import { Transaction, Currency, TransactionType, TransactionStatus } from '../types/transaction'

const DESCRIPTIONS: string[] = [
  'Transferencia bancaria nacional',
  'Pago de servicios básicos',
  'Depósito en cuenta corriente',
  'Retiro cajero automático',
  'Pago suscripción streaming',
  'Compra supermercado',
  'Transferencia internacional',
  'Pago arriendo mensual',
  'Comisión por mantenimiento',
  'Depósito nómina empresa',
  'Pago tarjeta de crédito',
  'Compra farmacia',
  'Transferencia a terceros',
  'Pago servicios de internet',
  'Recarga tarjeta prepago',
  'Pago dividendo hipotecario',
  'Inversión fondo mutuo',
  'Retiro inversión',
  'Pago seguro de salud',
  'Compra electrónico en línea',
  'Transferencia cripto',
  'Depósito plazo fijo',
  'Pago de impuestos',
  'Devolución compra anulada',
  'Pago proveedor servicios',
  'Comisión transacción internacional',
  'Depósito ahorro programado',
  'Pago cuenta telefónica',
  'Compra comercio local',
  'Transferencia entre cuentas propias',
  'Pago cuota préstamo',
  'Abono capital crédito',
  'Pago agua potable',
  'Pago electricidad',
  'Pago gas domiciliario',
  'Bono empresa',
  'Reintegro gastos viaje',
  'Pago curso online',
  'Donación organización',
  'Pago servicio de streaming música',
]

const CURRENCIES: Currency[] = ['USD', 'EUR', 'CLP', 'BTC']
const TYPES: TransactionType[] = ['credit', 'debit']
const STATUSES: TransactionStatus[] = ['completed', 'pending', 'failed']

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function randomAccount(rng: () => number): string {
  const segments = Array.from({ length: 4 }, () =>
    Math.floor(rng() * 9000 + 1000).toString()
  )
  return segments.join('-')
}

function randomAmount(currency: Currency, rng: () => number): number {
  switch (currency) {
    case 'BTC':
      return Math.round(rng() * 0.09999999 * 100000000) / 100000000
    case 'CLP':
      return Math.floor(rng() * 4900000 + 100000)
    case 'USD':
      return Math.round((rng() * 9900 + 100) * 100) / 100
    case 'EUR':
      return Math.round((rng() * 9900 + 100) * 100) / 100
  }
}

function randomDate(rng: () => number): string {
  const now = new Date('2026-05-11T00:00:00Z')
  const msInYear = 365 * 24 * 60 * 60 * 1000
  const offset = Math.floor(rng() * msInYear)
  const d = new Date(now.getTime() - offset)
  return d.toISOString()
}

function weightedPick<T>(items: T[], weights: number[], rng: () => number): T {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rng() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i] ?? 0
    if (r <= 0) return items[i] as T
  }
  return items[items.length - 1] as T
}

export function generateMockData(): Transaction[] {
  const rng = seededRandom(42)
  const transactions: Transaction[] = []

  for (let i = 0; i < 250; i++) {
    const currency = weightedPick<Currency>(
      CURRENCIES,
      [40, 30, 20, 10],
      rng
    )
    const type = weightedPick<TransactionType>(TYPES, [50, 50], rng)
    const status = weightedPick<TransactionStatus>(
      STATUSES,
      [70, 20, 10],
      rng
    )
    const descIdx = Math.floor(rng() * DESCRIPTIONS.length)
    const description = DESCRIPTIONS[descIdx] ?? DESCRIPTIONS[0] ?? 'Transacción'

    transactions.push({
      id: `txn-${String(i + 1).padStart(4, '0')}`,
      date: randomDate(rng),
      description,
      type,
      status,
      amount: randomAmount(currency, rng),
      currency,
      accountOrigin: randomAccount(rng),
      accountDestination: randomAccount(rng),
    })
  }

  return transactions
}

export const MOCK_DATA: Transaction[] = generateMockData()
