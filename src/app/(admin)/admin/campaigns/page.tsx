/**
 * WYSHKIT 2026: Campaigns feature not yet available.
 * campaigns table does not exist in schema. Removed per plan Option B.
 */
export default function CampaignsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">Campaigns</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm">
        This feature is not yet available. Campaigns will be added when the backend is ready.
      </p>
    </div>
  )
}
