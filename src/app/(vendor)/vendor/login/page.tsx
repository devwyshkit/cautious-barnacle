'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, ArrowRight, ChevronLeft, Store } from 'lucide-react'
import { normalizePhone } from '@/lib/utils/phone'

/**
 * WYSHKIT 2026: Vendor Login
 * Phone OTP authentication for vendors.
 * Follows the same pattern as admin login — no password, no email, zero friction.
 */
export default function VendorLoginPage() {
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleSendOTP = async () => {
        if (!phone || phone.length !== 10) {
            setError('Enter a valid 10-digit number')
            return
        }

        setError('')
        setLoading(true)

        try {
            const normalizedPhone = normalizePhone(phone)
            const { error: otpError } = await supabase.auth.signInWithOtp({
                phone: normalizedPhone,
                options: { channel: 'sms' },
            })

            setLoading(false)

            if (otpError) {
                if (otpError.message.includes('500')) {
                    setError('Service issue. Proceed if you received OTP.')
                    setStep('otp')
                } else {
                    setError(otpError.message)
                }
                return
            }

            setStep('otp')
            setOtp('')
        } catch {
            setLoading(false)
            setError('Connection issue. Proceed if you received OTP.')
            setStep('otp')
        }
    }

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setError('Enter 6-digit OTP')
            return
        }

        setError('')
        setLoading(true)

        try {
            const normalizedPhone = normalizePhone(phone)
            let { data, error: verifyError } = await supabase.auth.verifyOtp({
                phone: normalizedPhone,
                token: otp,
                type: 'sms',
            })

            // Fallback for raw number formats
            if (verifyError && phone !== normalizedPhone) {
                const { data: fallbackData, error: fallbackError } = await supabase.auth.verifyOtp({
                    phone: phone,
                    token: otp,
                    type: 'sms',
                })
                if (!fallbackError && fallbackData.user) {
                    data = fallbackData
                    verifyError = null
                }
            }

            if (verifyError) {
                setError(verifyError.message)
                setLoading(false)
                return
            }

            if (data.user) {
                // WYSHKIT 2026: Let middleware and layout handle vendor verification.
                // We just confirm auth here and redirect to the vendor dashboard.
                router.push('/vendor')
                router.refresh()
            }
        } catch {
            setError('Verification failed')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[100dvh] bg-[var(--surface-muted)] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="size-12 rounded-xl bg-[var(--primary)] flex items-center justify-center mx-auto mb-4">
                        <Store className="size-6 text-[var(--text-inverse)]" />
                    </div>
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">
                        {step === 'phone' ? 'WyshKit Shop' : 'Verify code'}
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">
                        {step === 'phone'
                            ? 'Enter your registered phone number'
                            : `Code sent to +91 ${phone}`}
                    </p>
                </div>

                {step === 'phone' ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3">
                            <span className="text-[var(--text-secondary)] text-sm">+91</span>
                            <Input
                                type="tel"
                                inputMode="numeric"
                                placeholder="Phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                className="border-0 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus-visible:ring-0"
                                maxLength={10}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <Button
                            onClick={handleSendOTP}
                            disabled={loading || phone.length !== 10}
                            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-inverse)] font-medium shadow-brand"
                        >
                            {loading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <>Get OTP <ArrowRight className="size-4 ml-2" /></>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-center tracking-[0.5em] text-lg h-12"
                            maxLength={6}
                        />

                        {error && (
                            <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <Button
                            onClick={handleVerifyOTP}
                            disabled={loading || otp.length !== 6}
                            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-inverse)] font-medium shadow-brand"
                        >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Verify & Enter'}
                        </Button>

                        <div className="flex items-center justify-center gap-4 pt-2">
                            <button
                                onClick={() => {
                                    setStep('phone')
                                    setError('')
                                }}
                                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
                            >
                                <ChevronLeft className="size-3" />
                                Change number
                            </button>
                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
