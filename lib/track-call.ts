const CALL_TRACKING_WEBHOOK =
  "https://n8n-customer-automations.onrender.com/webhook/66efcdcc-49af-4630-a088-a0d5fc2174e7"

export function trackCall(label?: string): void {
  try {
    fetch(CALL_TRACKING_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "phone_call_initiated",
        label: label ?? "unknown",
        page: typeof window !== "undefined" ? window.location.href : "",
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    }).catch(() => {
      // Silently ignore — never block the call
    })
  } catch {
    // Silently ignore — never block the call
  }
}
