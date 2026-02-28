export const HYPERLOCAL_CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];

export function isHyperlocalCity(city?: string | null): boolean {
  if (!city) return false;
  return HYPERLOCAL_CITIES.some(hc => hc.toLowerCase() === city.toLowerCase());
}
