/**
 * WYSHKIT 2026: Cashback rules feature not yet available.
 * cashback_rules table does not exist in schema. Removed per plan Option B.
 */
export default function CashbackPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-lg font-semibold text-zinc-900">Cashback rules</h1>
      <p className="mt-2 text-sm text-zinc-500 max-w-sm">
        This feature is not yet available. Cashback rules will be added when the backend is ready.
      </p>
    </div>
  )
}
