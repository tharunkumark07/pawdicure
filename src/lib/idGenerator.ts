/**
 * Generates a unique, permanent, human-readable Application Number.
 * Format: PWC-PET-XXXXXX
 */
export function generateApplicationNumber(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous chars
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `PWC-PET-${result}`;
}
