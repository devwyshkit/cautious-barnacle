import { createClient } from "@/lib/supabase/server";
import { getAddresses } from "@/lib/actions/addresses";
import { redirect } from "next/navigation";
import { ProfileSurface } from "@/components/customer/ProfileSurface";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?intent=signin&returnUrl=/profile");
  }

  const { addresses = [] } = await getAddresses() || {};

  return (
    <div className="min-h-screen bg-white">
      <ProfileSurface initialAddresses={addresses} />
    </div>
  );
}
