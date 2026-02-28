/**
 * Passthrough layout for vendor auth routes (login, etc.).
 * No vendor check - these run before auth.
 */
export default function VendorAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
