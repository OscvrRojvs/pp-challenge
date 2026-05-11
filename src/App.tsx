import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TransactionsPage } from './pages/TransactionsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TransactionsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
