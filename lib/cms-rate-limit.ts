/**
 * Basic in-memory rate limiting for the /cms login endpoint.
 *
 * This is a lightweight deterrent against brute-force passcode guessing, not
 * a hardened distributed rate limiter. It resets if the server process
 * restarts, which is an acceptable tradeoff for a small internal admin tool
 * gated by a single shared passcode.
 */

const MAX_ATTEMPTS = 5
const WINDOW_MS = 1000 * 60 * 10 // 10 minutes

type AttemptRecord = {
  count: number
  firstAttemptAt: number
}

const attempts = new Map<string, AttemptRecord>()

export function isRateLimited(key: string): boolean {
  const record = attempts.get(key)
  if (!record) return false

  const windowExpired = Date.now() - record.firstAttemptAt > WINDOW_MS
  if (windowExpired) {
    attempts.delete(key)
    return false
  }

  return record.count >= MAX_ATTEMPTS
}

export function recordFailedAttempt(key: string): void {
  const record = attempts.get(key)
  const now = Date.now()

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now })
    return
  }

  record.count += 1
}

export function clearAttempts(key: string): void {
  attempts.delete(key)
}
