/** Normalize an email by trimming and lowercasing. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Basic email format validation. */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}


