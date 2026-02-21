'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { updateSetting } from '@/lib/actions/commerce/admin-actions'

interface SettingsFormProps {
  settings: Record<string, unknown>
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    default_commission_rate: String(settings.default_commission_rate || 10),
    default_delivery_fee: String(settings.default_delivery_fee || 40),
    min_order_value: String(settings.min_order_value || 99),
    free_delivery_threshold: String(settings.free_delivery_threshold || 499),
    max_preview_revisions: String(settings.max_preview_revisions || 3),
    maintenance_mode: Boolean(settings.maintenance_mode),
  })
  const router = useRouter()

  const handleSave = async (key: string, value: string | number | boolean) => {
    setLoading(true)
    await updateSetting(key, value)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Commission</CardTitle>
          <CardDescription>Default platform commission settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label>Default commission rate (%)</Label>
              <Input 
                type="number" 
                value={form.default_commission_rate} 
                onChange={(e) => setForm({ ...form, default_commission_rate: e.target.value })} 
              />
            </div>
            <Button 
              onClick={() => handleSave('default_commission_rate', parseFloat(form.default_commission_rate))}
              disabled={loading}
              className="mt-6"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Delivery</CardTitle>
          <CardDescription>Delivery fee and threshold settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default delivery fee (₹)</Label>
              <Input 
                type="number" 
                value={form.default_delivery_fee} 
                onChange={(e) => setForm({ ...form, default_delivery_fee: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Free delivery above (₹)</Label>
              <Input 
                type="number" 
                value={form.free_delivery_threshold} 
                onChange={(e) => setForm({ ...form, free_delivery_threshold: e.target.value })} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Minimum order value (₹)</Label>
            <Input 
              type="number" 
              value={form.min_order_value} 
              onChange={(e) => setForm({ ...form, min_order_value: e.target.value })} 
            />
          </div>
          <Button 
            onClick={async () => {
              setLoading(true)
              await updateSetting('default_delivery_fee', parseFloat(form.default_delivery_fee))
              await updateSetting('free_delivery_threshold', parseFloat(form.free_delivery_threshold))
              await updateSetting('min_order_value', parseFloat(form.min_order_value))
              setLoading(false)
              router.refresh()
            }}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Save delivery settings'}
          </Button>
        </CardContent>
      </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Personalization</CardTitle>
            <CardDescription>Preview and personalization settings</CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label>Max preview revisions</Label>
              <Input 
                type="number" 
                value={form.max_preview_revisions} 
                onChange={(e) => setForm({ ...form, max_preview_revisions: e.target.value })} 
              />
            </div>
            <Button 
              onClick={() => handleSave('max_preview_revisions', parseInt(form.max_preview_revisions))}
              disabled={loading}
              className="mt-6"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          <CardDescription>System-wide settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance mode</p>
              <p className="text-sm text-zinc-500">Disable customer-facing features temporarily</p>
            </div>
            <Switch 
              checked={form.maintenance_mode} 
              onCheckedChange={async (v) => {
                setForm({ ...form, maintenance_mode: v })
                await handleSave('maintenance_mode', v)
              }} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
