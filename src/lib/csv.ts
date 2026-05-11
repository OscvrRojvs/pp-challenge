import { Transaction } from '../types/transaction'
import { format } from 'date-fns'

function escapeField(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCsv(transactions: Transaction[]): void {
  const headers = [
    'Fecha',
    'Descripción',
    'Tipo',
    'Estado',
    'Monto',
    'Moneda',
    'Cuenta Origen',
    'Cuenta Destino',
  ]

  const typeLabel: Record<Transaction['type'], string> = {
    credit: 'Crédito',
    debit: 'Débito',
  }
  const statusLabel: Record<Transaction['status'], string> = {
    completed: 'Completado',
    pending: 'Pendiente',
    failed: 'Fallido',
  }

  const rows = transactions.map((tx) => [
    escapeField(tx.date),
    escapeField(tx.description),
    escapeField(typeLabel[tx.type]),
    escapeField(statusLabel[tx.status]),
    escapeField(tx.amount),
    escapeField(tx.currency),
    escapeField(tx.accountOrigin),
    escapeField(tx.accountDestination),
  ])

  const csvLines = [
    headers.map(escapeField).join(','),
    ...rows.map((row) => row.join(',')),
  ]

  const csvContent = '﻿' + csvLines.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `movimientos-${format(new Date(), 'yyyy-MM-dd')}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
