import { cookies } from 'next/headers'

const GUEST_SESSION_COOKIE = 'wyshkit_guest_session'

/**
 * Read-only: use in Server Components (layout, page) where cookies cannot be modified.
 * Returns null if no session cookie exists.
 */
export async function getGuestSessionIdReadOnly(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(GUEST_SESSION_COOKIE)?.value ?? null
}

/**
 * Read or create guest session. Use only in Server Actions / Route Handlers (can modify cookies).
 * In Server Components, use getGuestSessionIdReadOnly() instead.
 */
export async function getGuestSessionId(): Promise<string> {
    const cookieStore = await cookies()
    let sessionId = cookieStore.get(GUEST_SESSION_COOKIE)?.value

    if (!sessionId) {
        sessionId = crypto.randomUUID()
        cookieStore.set(GUEST_SESSION_COOKIE, sessionId, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
        })
    }

    return sessionId
}

export async function clearGuestSessionId() {
    const cookieStore = await cookies()
    cookieStore.delete(GUEST_SESSION_COOKIE)
}
