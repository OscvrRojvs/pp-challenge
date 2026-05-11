interface Props {
  rows?: number
}

export function TransactionsSkeleton({ rows = 10 }: Props) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-gray-100">
          <td className="px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-32" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-48" />
          </td>
          <td className="px-4 py-3">
            <div className="h-5 bg-gray-200 rounded-full w-16" />
          </td>
          <td className="px-4 py-3">
            <div className="h-5 bg-gray-200 rounded-full w-20" />
          </td>
          <td className="px-4 py-3 text-right">
            <div className="h-4 bg-gray-200 rounded w-24 ml-auto" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-36" />
          </td>
        </tr>
      ))}
    </>
  )
}
