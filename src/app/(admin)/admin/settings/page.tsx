import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from './settings-form'

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('platform_settings')
    .select('*')

  return (data || []) as Array<{ key: string; value: string }>;
}

export default async function SettingsPage() {
  const settings = await getSettings()

  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value
    return acc
  }, {} as Record<string, unknown>)

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">Settings</h1>
      <SettingsForm settings={settingsMap} />
    </div>
  )
}
