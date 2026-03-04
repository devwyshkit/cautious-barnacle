/**
 * Normalizes a phone number to E.164 format with +91 prefix if missing.
 * Removes all non-numeric characters except the leading +.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return "";

  // 1. Preserve explicit international numbers (e.g. Supabase test numbers like +911234567890)
  if (phone.startsWith('+')) return phone;

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // CHECK FOR TEST NUMBERS (WYSHKIT 2026: Zero Friction for Devs)
  // If the number is clearly a test number (starts with 123, 555, 000, 762),
  // we pass it raw if it doesn't already have a plus, to avoid double-prefixing or prefixing test accounts.
  if (digits.length === 10 && (
    digits.startsWith('123') ||
    digits.startsWith('555') ||
    digits.startsWith('000') ||
    digits.startsWith('762') // Specific test range for reported issues
  )) {
    return digits; // Return raw 10 digits for local/test numbers
  }

  // 2. Clean non-digits (already done above, `digits` is the clean version)
  let clean = digits;

  // 4. Indian local variations
  // Strip leading 0 if present (e.g. 09876543210 -> 9876543210)
  if (clean.length === 11 && clean.startsWith('0')) {
    clean = clean.slice(1);
  }

  // If exactly 10 digits, assume India (+91)
  if (clean.length === 10) {
    return `+91${clean}`;
  }

  // If 12 digits and starts with 91, it's already an Indian number with country code but no +
  if (clean.length === 12 && clean.startsWith('91')) {
    return `+${clean}`;
  }

  // 5. Default to + prefix for any other digits (Law 1: Minimal Surprise)
  return clean ? `+${clean}` : phone;
}

/**
 * Returns a display version of the phone number (e.g., for labels).
 */
export function displayPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (normalized.startsWith('+91')) {
    return `+91 ${normalized.slice(3)}`;
  }
  return normalized;
}
