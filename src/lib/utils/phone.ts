/**
 * Normalizes a phone number to E.164 format with +91 prefix if missing.
 * Removes all non-numeric characters except the leading +.
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle 10 digit number
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // Handle 12 digit number starting with 91
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  
  // Handle 11 digit number starting with 0
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91${digits.slice(1)}`;
  }
  
  // If it's already in E.164 format (starts with +)
  if (phone.startsWith('+')) {
    return phone.replace(/[^\d+]/g, '');
  }
  
  return `+91${digits}`;
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
