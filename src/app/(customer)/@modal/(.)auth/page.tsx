import { AuthPageClient } from '@/components/auth/AuthPageClient';
import { InterceptedAuthSheet } from '@/components/auth/InterceptedAuthSheet';
import { Suspense } from 'react';

export default async function InterceptedAuthPage({
    searchParams,
}: {
    searchParams: Promise<{ intent?: string; returnUrl?: string }>;
}) {
    const params = await searchParams;
    const intent = (params.intent as 'signin' | 'signup') ?? 'signin';
    const returnUrl = params.returnUrl ?? '/';

    return (
        <Suspense fallback={null}>
            <InterceptedAuthSheet intent={intent} returnUrl={returnUrl} />
        </Suspense>
    );
}
