import { Currency } from '../types/transaction'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatCurrency(amount: number, currency: Currency): string {
  switch (currency) {
    case 'USD':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    case 'EUR':
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    case 'CLP':
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
      }).format(amount)
    case 'BTC': {
      const parts = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.floor(amount))
      const decimals = amount.toFixed(8).split('.')[1] ?? '00000000'
      const intPart = Math.floor(amount)
      if (intPart === 0) {
        return `₿0.${decimals}`
      }
      return `₿${parts}.${decimals}`
    }
  }
}

export function formatDate(isoString: string): string {
  try {
    return format(new Date(isoString), 'dd/MM/yyyy HH:mm', { locale: es })
  } catch {
    return isoString
  }
}

export function formatDateShort(isoString: string): string {
  try {
    return format(new Date(isoString), 'dd/MM/yyyy', { locale: es })
  } catch {
    return isoString
  }
}
