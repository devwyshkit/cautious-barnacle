export default async function ServiceabilityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-zinc-900">Serviceability</h1>
      <div className="p-8 border rounded-lg bg-zinc-50 text-center">
        <h2 className="text-zinc-600 font-medium mb-2">Serviceability is now managed per-vendor</h2>
        <p className="text-sm text-zinc-500">
          Global pincode configuration has been deprecated on this page. Navigate to the Vendors tab to manage serviceability radius and applicable pincodes for individual storefronts.
        </p>
      </div>
    </div>
  )
}
