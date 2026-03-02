import { headers } from "next/headers";
import { getAddresses } from "@/lib/actions/user/addresses";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ProfileSurface } from "@/components/customer/ProfileSurface";

export default async function ProfilePage() {
  const headerList = await headers();
  const userId = headerList.get('x-wyshkit-user-id');

  if (!userId) {
    redirect("/auth?intent=signin&returnUrl=/profile");
  }

  const { addresses = [] } = await getAddresses() || {};

  return (
    <div className="min-h-[100dvh] bg-[var(--background)]">
      <Suspense fallback={<div className="min-h-[100dvh] bg-[var(--background)] animate-pulse" />}>
        <ProfileSurface initialAddresses={addresses} />
      </Suspense>
    </div>
  );
}
