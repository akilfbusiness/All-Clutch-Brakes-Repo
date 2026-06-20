"use client"

// ─────────────────────────────────────────────
// WEBHOOK CONFIGURATION — replace with your n8n URLs
// ─────────────────────────────────────────────
// const PARTIAL_CAPTURE_WEBHOOK    = "YOUR_WEBHOOK_URL_HERE"
// const AI_QUESTIONS_WEBHOOK       = "YOUR_WEBHOOK_URL_HERE"
// const DIAGNOSIS_WEBHOOK          = "YOUR_WEBHOOK_URL_HERE"
// const CALL_WEBHOOK               = "YOUR_WEBHOOK_URL_HERE"
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────

export interface LeadQualificationFormProps {
  businessName: string
  phoneNumber: string
  accentColor?: string
  services: string[]
  defaultService?: string
  webhookUrl1?: string
  webhookUrl2?: string
  webhookUrlPartial?: string
  webhookUrlCall?: string
  onComplete?: (data: CollectedData) => void
}

interface CollectedData {
  name: string
  phone: string
  email: string
  service: string
  message: string
  make: string
  model: string
  year: string
  drivable: string
  emergency: string
  answers: Record<string, string>
  sessionId: string
}

interface Question {
  id: string
  heading: string
  options: Record<string, string>
  hint: Record<string, string>
}

interface Step1Data {
  name: string
  phone: string
  email: string
  service: string
  otherService?: string
  message: string
}

interface Step2Data {
  make: string
  model: string
  year: string
  drivable: string
  emergency: string
}

// ─── Mock Fallback Data ───────────────────────

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    heading: "What sound do you hear when the issue occurs?",
    options: { A: "No unusual sound", B: "Light squealing", C: "Grinding or scraping", D: "Loud clunking" },
    hint: {
      A: "Good sign — may be minor wear.",
      B: "Wear beginning — worth checking soon.",
      C: "Likely component damage — book this week.",
      D: "Urgent — stop driving if possible.",
    },
  },
  {
    id: "q2",
    heading: "When does the problem most often occur?",
    options: { A: "Only occasionally", B: "When starting from stopped", C: "At higher speeds", D: "Constantly" },
    hint: {
      A: "Intermittent — may worsen over time.",
      B: "Suggests clutch or brake engagement issue.",
      C: "Could indicate rotor or drivetrain wear.",
      D: "Needs immediate inspection.",
    },
  },
  {
    id: "q3",
    heading: "How long has this been happening?",
    options: { A: "Just started today", B: "A few days", C: "A few weeks", D: "A month or more" },
    hint: {
      A: "Early — best time to address it.",
      B: "Getting worse — don't delay.",
      C: "Likely progressed — book this week.",
      D: "Significant wear likely — call now.",
    },
  },
]

const MOCK_DIAGNOSIS_RESPONSE = {
  diagnosis:
    "Based on your answers, your vehicle is showing signs of moderate wear that — if left unchecked — will develop into a more serious and more expensive problem. The symptoms you've described are consistent with early to mid-stage component wear. Getting this inspected now is the smartest move: catching it at this stage typically saves hundreds compared to addressing it after failure.",
}

// ─── Loading screen copy per transition ──────

const LOADING_LINES: Record<string, { text: string; delay: number }[]> = {
  s1_to_s2: [
    { text: "Securing your details...", delay: 350 },
    { text: "Initialising vehicle profile...", delay: 900 },
    { text: "Preparing diagnostic questions...", delay: 1550 },
    { text: "Ready.", delay: 2300 },
  ],
  s2_to_s3: [
    { text: "Analysing vehicle data...", delay: 350 },
    { text: "Cross-referencing service patterns...", delay: 900 },
    { text: "Generating tailored questions...", delay: 1550 },
    { text: "Ready.", delay: 2300 },
  ],
  s3_to_s4: [
    { text: "Processing your responses...", delay: 350 },
    { text: "Running diagnostic model...", delay: 900 },
    { text: "Building your vehicle report...", delay: 1550 },
    { text: "Ready.", delay: 2300 },
  ],
}

// ─── Service Icons ────────────────────────────

const SERVICE_ICONS: Record<string, string> = {
  "Brake Service": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>`,
  "Clutch Replacement": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  "Clutch Inspection": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v3l2 2"/></svg>`,
  "Rotor Machining": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
  "General Service": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  "Other / Not Sure": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
}

function getServiceIcon(service: string): string {
  return SERVICE_ICONS[service] ?? SERVICE_ICONS["Other / Not Sure"]
}

// ─── Utility ──────────────────────────────────

function fireWebhook(url: string, payload: Record<string, unknown>) {
  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {})
  } catch {
    // Silent — never surface webhook errors to the user
  }
}

// ─── Urgency Color (red — call CTA, % counters, alerts) ──────
const URGENT = "#E63946"

// ─── Dark Theme Tokens ────────────────────────

const T = {
  bg: "#0D0F12",
  surface: "#161A1F",
  surfaceHover: "#1C2128",
  border: "#252B33",
  borderHover: "#353D47",
  text: "#F0F2F5",
  textMuted: "#6B7585",
  textSubtle: "#9AA3B0",
}

// ─── Shared Input Styles ──────────────────────

function getInputStyle(accent: string, focused: boolean): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    padding: "0.5625rem 0.875rem",
    fontSize: "0.875rem",
    border: `1px solid ${focused ? accent : T.border}`,
    borderRadius: "4px",
    outline: "none",
    boxSizing: "border-box",
    background: focused ? "#0D1117" : T.surface,
    color: T.text,
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
    boxShadow: "none",
  }
}

// ─── Progress Bar ─────────────────────────────

function ProgressBar({ pct, accent, stepLabel }: { pct: number; accent: string; stepLabel: string }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {stepLabel}
        </span>
        <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: URGENT, letterSpacing: "0.04em" }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: "3px", background: T.border, borderRadius: "9999px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent}cc, ${accent})`,
            borderRadius: "9999px",
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: `0 0 8px ${accent}88`,
          }}
        />
      </div>
    </div>
  )
}

// ─── Fake Loading Screen ──────────────────────

function FakeLoadingScreen({ accent, transitionKey, onDone }: { accent: string; transitionKey: string; onDone: () => void }) {
  const lines = LOADING_LINES[transitionKey] ?? LOADING_LINES["s1_to_s2"]
  const [visible, setVisible] = useState<number[]>([])
  const [scanPos, setScanPos] = useState(0)
  const [scanPct, setScanPct] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    lines.forEach((line, i) => {
      timers.push(setTimeout(() => setVisible((v) => [...v, i]), line.delay))
    })
    timers.push(setTimeout(onDone, 6000))
    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Crawl to 85% in 3s then hold — never shows 100% until webhook returns
  useEffect(() => {
    let frame: number
    let start: number | null = null
    const duration = 6000
    const cap = 99
    function tick(ts: number) {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress < 1 ? progress : 1
      setScanPos((Math.sin(eased * Math.PI * 2) * 0.5 + 0.5) * 96)
      setScanPct(Math.round(eased * cap))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div style={{ minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "1rem 0", animation: "lqfFadeIn 0.35s ease" }}>

      {/* Diagnostic scanner graphic */}
      <div
        style={{
          position: "relative",
          height: "100px",
          background: "#0a0c0f",
          borderRadius: "6px",
          border: `1px solid ${T.border}`,
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        {/* Horizontal grid lines */}
        {[25, 50, 75].map((p) => (
          <div key={p} style={{ position: "absolute", top: `${p}%`, left: 0, right: 0, height: "1px", background: `${T.border}88` }} />
        ))}
        {/* Vertical grid lines */}
        {[16.6, 33.3, 50, 66.6, 83.3].map((p) => (
          <div key={p} style={{ position: "absolute", left: `${p}%`, top: 0, bottom: 0, width: "1px", background: `${T.border}55` }} />
        ))}

        {/* Glow sweep behind scan line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${scanPos}%`,
            width: "80px",
            background: `linear-gradient(90deg, transparent, ${accent}18, transparent)`,
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* Scan line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${scanPos}%`,
            width: "2px",
            background: `linear-gradient(180deg, transparent, ${accent}, ${accent}, transparent)`,
            boxShadow: `0 0 16px 3px ${accent}88`,
            transition: "left 0.04s linear",
          }}
        />

        {/* Top-left label */}
        <div style={{ position: "absolute", top: "10px", left: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: accent, animation: "lqfPulse 1s ease-in-out infinite" }} />
          <span style={{ fontSize: "0.625rem", fontWeight: 700, color: accent, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            AI Diagnostic
          </span>
        </div>

        {/* Percentage counter — bottom right */}
        <div style={{ position: "absolute", bottom: "10px", right: "12px" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: URGENT, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
            {scanPct}
          </span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: URGENT, marginLeft: "2px" }}>%</span>
        </div>

        {/* Bottom progress fill */}
        <div style={{ position: "absolute", bottom: 0, left: 0, height: "2px", width: `${scanPct}%`, background: accent, transition: "width 0.08s linear", boxShadow: `0 0 6px ${accent}` }} />
      </div>

      {/* Status lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {lines.map((line, i) => {
          const isReady = line.text === "Ready."
          const isVisible = visible.includes(i)
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                opacity: isVisible ? 1 : 0.15,
                transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              {/* Status dot */}
              <div
                style={{
                  width: isReady ? "8px" : "5px",
                  height: isReady ? "8px" : "5px",
                  borderRadius: "50%",
                  background: isVisible ? (isReady ? accent : `${accent}99`) : T.border,
                  flexShrink: 0,
                  boxShadow: isVisible && isReady ? `0 0 8px ${accent}` : "none",
                  transition: "all 0.3s",
                }}
              />
              <span
                style={{
                  fontSize: isReady ? "1rem" : "0.875rem",
                  fontWeight: isReady ? 700 : 400,
                  color: isVisible ? (isReady ? T.text : T.textSubtle) : T.border,
                  letterSpacing: isReady ? "0.01em" : "0",
                  transition: "color 0.3s",
                }}
              >
                {line.text}
              </span>

              {/* Typing dots for non-ready non-last visible */}
              {isVisible && !isReady && (
                <span style={{ display: "flex", gap: "3px", marginLeft: "2px" }}>
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      style={{
                        width: "3px", height: "3px", borderRadius: "50%",
                        background: T.textMuted,
                        display: "inline-block",
                        animation: `lqfPulse 1.2s ease-in-out ${d * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Staggered Field Wrapper ──────────────────

function StaggerField({ index, children }: { index: number; children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), index * 60)
    return () => clearTimeout(t)
  }, [index])
  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      {children}
    </div>
  )
}

// ─── Field Label ──────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: T.textMuted, marginBottom: "0.3rem", letterSpacing: "0.03em", textTransform: "uppercase" }}>
      {children}
    </label>
  )
}

// ─── Text Input ───────────────────────────────

function TextInput({
  type = "text",
  value,
  onChange,
  onKeyDown,
  placeholder,
  autoFocus,
  accent,
}: {
  type?: string
  value: string
  onChange: (v: string) => void
  onKeyDown?: React.KeyboardEventHandler
  placeholder?: string
  autoFocus?: boolean
  accent: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      autoFocus={autoFocus}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      style={getInputStyle(accent, focused)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

// ─── Next Button ──────────────────────────────

function NextButton({ onClick, disabled, accent, label = "Continue", requireConfirm = true }: {
  onClick: () => void
  disabled?: boolean
  accent: string
  label?: string
  requireConfirm?: boolean
}) {
  const [confirming, setConfirming] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (disabled) setConfirming(false)
  }, [disabled])

  const handleClick = () => {
    if (!requireConfirm) { onClick(); return }
    if (confirming) { setConfirming(false); onClick() }
    else setConfirming(true)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginTop: "0.25rem" }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "block",
          width: "100%",
          padding: "0.75rem",
          fontSize: "0.875rem",
          fontWeight: 700,
          color: disabled ? T.textMuted : "#fff",
          background: disabled ? T.surface : hovered ? `${accent}dd` : accent,
          border: `1px solid ${disabled ? T.border : accent}`,
          borderRadius: "4px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          fontFamily: "inherit",
          letterSpacing: "0.02em",
          boxShadow: disabled ? "none" : hovered ? `0 0 20px ${accent}55` : `0 0 12px ${accent}33`,
        }}
      >
        {confirming ? "Confirm & Continue →" : `${label} →`}
      </button>
      {confirming && (
        <button
          type="button"
          onClick={() => setConfirming(false)}
          style={{
            background: "none",
            border: "none",
            color: T.textMuted,
            fontSize: "0.75rem",
            cursor: "pointer",
            padding: "0.2rem",
            fontFamily: "inherit",
            textAlign: "center",
            width: "100%",
            transition: "color 0.15s",
          }}
        >
          ← Go back
        </button>
      )}
    </div>
  )
}

// ─── Service Dropdown ─────────────────────────

function ServiceDropdown({ options, selected, onSelect, accent }: {
  options: string[]
  selected: string
  onSelect: (v: string) => void
  accent: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...getInputStyle(accent, focused),
        cursor: "pointer",
        appearance: "none",
        WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7585' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.875rem center",
        paddingRight: "2.25rem",
      }}
    >
      <option value="" disabled>Select a service...</option>
      {options.map((opt) => (
        <option key={opt} value={opt} style={{ background: "#161A1F", color: "#F0F2F5" }}>{opt}</option>
      ))}
    </select>
  )
}

// ─── Service Card Grid ────────────────────────

function ServiceCardGrid({ options, selected, onSelect, accent }: {
  options: string[]
  selected: string
  onSelect: (v: string) => void
  accent: string
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
      {options.map((opt) => {
        const active = selected === opt
        return (
          <ServiceCard key={opt} label={opt} active={active} onSelect={() => onSelect(opt)} accent={accent} />
        )
      })}
    </div>
  )
}

function ServiceCard({ label, active, onSelect, accent }: { label: string; active: boolean; onSelect: () => void; accent: string }) {
  const [hovered, setHovered] = useState(false)
  const iconSvg = getServiceIcon(label)
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5625rem 0.75rem",
        textAlign: "left",
        background: active ? `${accent}18` : hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${active ? accent : hovered ? T.borderHover : T.border}`,
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "inherit",
        color: active ? accent : T.textSubtle,
        boxShadow: active ? `0 0 10px ${accent}22` : "none",
        minHeight: "40px",
      }}
      dangerouslySetInnerHTML={{
        __html: `
          <span style="display:inline-flex;flex-shrink:0;width:16px;height:16px;color:${active ? accent : T.textMuted}">${iconSvg}</span>
          <span style="font-size:0.8rem;font-weight:${active ? 600 : 400};color:${active ? T.text : T.textSubtle};line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${label}</span>
        `,
      }}
    />
  )
}

// ─── Yes/No/N-A Card ──────────────────────────────

function YesNoCards({ selected, onSelect, accent }: { selected: string; onSelect: (v: string) => void; accent: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
      {["Yes", "No", "N/A"].map((opt) => {
        const active = selected === opt
        return (
          <TapCard key={opt} label={opt} active={active} onSelect={() => onSelect(opt)} accent={accent} />
        )
      })}
    </div>
  )
}

function TapCard({ label, active, onSelect, accent }: { label: string; active: boolean; onSelect: () => void; accent: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.625rem",
        fontSize: "0.875rem",
        fontWeight: active ? 700 : 500,
        color: active ? "#fff" : T.textSubtle,
        background: active ? accent : hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${active ? accent : hovered ? T.borderHover : T.border}`,
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "inherit",
        boxShadow: active ? `0 0 10px ${accent}44` : "none",
        minHeight: "42px",
      }}
    >
      {label}
    </button>
  )
}

// ─── Step 1 — Contact + Service + Message ─────

function Step1({
  data, onChange, onComplete, services, defaultService, accent, onFieldFilled,
}: {
  data: Step1Data
  onChange: (d: Partial<Step1Data>) => void
  onComplete: () => void
  services: string[]
  defaultService?: string
  accent: string
  onFieldFilled: (key: string, filled: boolean) => void
}) {
  const skipService = Boolean(defaultService)
  const isValid = data.name.trim() && data.phone.trim() && data.email.trim() && (skipService || data.service.trim()) && data.message.trim()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <StaggerField index={0}>
        <FieldLabel>Full name</FieldLabel>
        <TextInput
          autoFocus
          value={data.name}
          onChange={(v) => { onChange({ name: v }); onFieldFilled("name", v.trim().length > 0) }}
          onKeyDown={(e) => { if (e.key === "Enter" && isValid) onComplete() }}
          placeholder="e.g. Sarah"
          accent={accent}
        />
      </StaggerField>

      <StaggerField index={1}>
        <FieldLabel>Best phone number</FieldLabel>
        <TextInput
          type="tel"
          value={data.phone}
          onChange={(v) => { onChange({ phone: v }); onFieldFilled("phone", v.trim().length > 0) }}
          onKeyDown={(e) => { if (e.key === "Enter" && isValid) onComplete() }}
          placeholder="e.g. 0412 345 678"
          accent={accent}
        />
      </StaggerField>

      <StaggerField index={2}>
        <FieldLabel>Email address</FieldLabel>
        <TextInput
          type="email"
          value={data.email}
          onChange={(v) => { onChange({ email: v }); onFieldFilled("email", v.trim().length > 0) }}
          onKeyDown={(e) => { if (e.key === "Enter" && isValid) onComplete() }}
          placeholder="e.g. sarah@email.com"
          accent={accent}
        />
      </StaggerField>

      {!skipService && (
        <StaggerField index={3}>
          <FieldLabel>What service do you need?</FieldLabel>
          <ServiceDropdown
            options={services}
            selected={data.service}
            onSelect={(s) => {
              onChange({ service: s, otherService: "" })
              onFieldFilled("service", true)
            }}
            accent={accent}
          />
        </StaggerField>
      )}

      <StaggerField index={skipService ? 3 : 4}>
        <FieldLabel>Briefly describe the issue</FieldLabel>
        <div>
          {(() => {
            const [focused, setFocused] = useState(false)
            return (
              <textarea
                value={data.message}
                onChange={(e) => onChange({ message: e.target.value })}
                placeholder="e.g. grinding noise when braking, clutch slipping..."
                rows={2}
                style={{
                  ...getInputStyle(accent, focused),
                  resize: "vertical",
                  lineHeight: "1.6",
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            )
          })()}
        </div>
      </StaggerField>

      <StaggerField index={skipService ? 4 : 5}>
        <NextButton onClick={onComplete} disabled={!isValid} accent={accent} label="Get My Free Diagnosis" />
      </StaggerField>
    </div>
  )
}

// ─── Step 2 — Vehicle Details ─────────────────

function Step2({
  data, onChange, onComplete, accent, onFieldFilled,
}: {
  data: Step2Data
  onChange: (d: Partial<Step2Data>) => void
  onComplete: () => void
  accent: string
  onFieldFilled: (key: string, filled: boolean) => void
}) {
  const isValid = Boolean(data.drivable && data.emergency)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <StaggerField index={0}>
        <FieldLabel>Vehicle make</FieldLabel>
        <TextInput
          autoFocus
          value={data.make}
          onChange={(v) => { onChange({ make: v }); onFieldFilled("make", v.trim().length > 0) }}
          onKeyDown={(e) => { if (e.key === "Enter" && isValid) onComplete() }}
          placeholder="e.g. Toyota"
          accent={accent}
        />
      </StaggerField>

      <StaggerField index={1}>
        <FieldLabel>Model</FieldLabel>
        <TextInput
          value={data.model}
          onChange={(v) => { onChange({ model: v }); onFieldFilled("model", v.trim().length > 0) }}
          onKeyDown={(e) => { if (e.key === "Enter" && isValid) onComplete() }}
          placeholder="e.g. Corolla"
          accent={accent}
        />
      </StaggerField>

      <StaggerField index={2}>
        <FieldLabel>Year</FieldLabel>
        <TextInput
          type="number"
          value={data.year}
          onChange={(v) => { onChange({ year: v }); onFieldFilled("year", v.trim().length > 0) }}
          onKeyDown={(e) => { if (e.key === "Enter" && isValid) onComplete() }}
          placeholder="e.g. 2018"
          accent={accent}
        />
      </StaggerField>

      <StaggerField index={3}>
        <FieldLabel>Is your vehicle currently drivable?</FieldLabel>
        <YesNoCards
          selected={data.drivable}
          onSelect={(v) => { onChange({ drivable: v }); onFieldFilled("drivable", true) }}
          accent={accent}
        />
      </StaggerField>

      <StaggerField index={4}>
        <FieldLabel>Is this urgent — do you need help today?</FieldLabel>
        <YesNoCards
          selected={data.emergency}
          onSelect={(v) => { onChange({ emergency: v }); onFieldFilled("emergency", true) }}
          accent={accent}
        />
      </StaggerField>

      <StaggerField index={5}>
        <NextButton onClick={onComplete} disabled={!isValid} accent={accent} label="Continue" />
      </StaggerField>
    </div>
  )
}

// ─── Step 3 — Tailored Questions (one at a time) ──────────────

function Step3({
  questions, answers, onAnswer, onComplete, accent, onFieldFilled,
}: {
  questions: Question[]
  answers: Record<string, string>
  onAnswer: (qId: string, key: string) => void
  onComplete: () => void
  accent: string
  onFieldFilled: (key: string, filled: boolean) => void
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const q = questions[currentIdx]
  const isLast = currentIdx === questions.length - 1
  const answered = q ? Boolean(answers[q.id]) : false

  const handleNext = () => {
    if (isLast) {
      onComplete()
    } else {
      setCurrentIdx((i) => i + 1)
    }
  }

  if (!q) return null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <StaggerField key={q.id} index={0}>
        <div>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>
            Question {currentIdx + 1} of {questions.length}
          </p>
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: T.text, marginBottom: "0.875rem", lineHeight: 1.5 }}>
            {q.heading}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4375rem" }}>
            {Object.entries(q.options).map(([key, text]) => {
              const active = answers[q.id] === key
              return (
                <AnswerButton
                  key={key}
                  letterKey={key}
                  text={text}
                  active={active}
                  accent={accent}
                  onClick={() => { onAnswer(q.id, key); onFieldFilled(q.id, true) }}
                />
              )
            })}
          </div>
          {answers[q.id] && q.hint[answers[q.id]] && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem 1rem",
                background: `${accent}0f`,
                border: `1px solid ${accent}33`,
                borderRadius: "4px",
                animation: "lqfFadeIn 0.35s ease",
              }}
            >
              <p style={{ fontSize: "0.8125rem", color: T.textSubtle, margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
                {q.hint[answers[q.id]]}
              </p>
            </div>
          )}
        </div>
      </StaggerField>

      <NextButton
        onClick={handleNext}
        disabled={!answered}
        accent={accent}
        label={isLast ? "Get My Diagnosis" : "Next Question"}
        requireConfirm={isLast}
      />
    </div>
  )
}

function AnswerButton({ letterKey, text, active, accent, onClick }: { letterKey: string; text: string; active: boolean; accent: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        width: "100%",
        padding: "0.5625rem 0.75rem",
        textAlign: "left",
        fontSize: "0.8125rem",
        color: active ? T.text : T.textSubtle,
        background: active ? `${accent}18` : hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${active ? accent : hovered ? T.borderHover : T.border}`,
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.16s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "inherit",
        boxShadow: active ? `0 0 10px ${accent}22` : "none",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          borderRadius: "5px",
          background: active ? accent : T.border,
          fontSize: "0.6875rem",
          fontWeight: 700,
          color: active ? "#fff" : T.textMuted,
          flexShrink: 0,
          transition: "all 0.16s",
        }}
      >
        {letterKey}
      </span>
      <span style={{ fontWeight: active ? 600 : 400 }}>{text}</span>
    </button>
  )
}

// ─── Step 4 — Diagnosis + CTA ─────────────────

function Step4({ diagnosis, phoneNumber, businessName, accent, sessionId, webhookUrlCall }: {
  diagnosis: string
  phoneNumber: string
  businessName: string
  accent: string
  sessionId: string
  webhookUrlCall?: string
}) {
  const [entered, setEntered] = useState(false)
  const [callHovered, setCallHovered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleCall = () => {
    if (webhookUrlCall) fireWebhook(webhookUrlCall, { session_id: sessionId, timestamp: new Date().toISOString() })
    window.location.href = `tel:${phoneNumber.replace(/\s/g, "")}`
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Diagnosis card */}
      <div
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "4px",
          padding: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "4px",
              background: `${accent}20`,
              border: `1px solid ${accent}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Vehicle Diagnosis
          </span>
        </div>
        <p style={{ fontSize: "0.875rem", color: T.textSubtle, lineHeight: 1.7, margin: 0 }}>{diagnosis}</p>
      </div>

      {/* Call CTA */}
      <div
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.5s ease 0.12s, transform 0.5s ease 0.12s",
          position: "relative",
        }}
      >
        {/* Pulse ring */}
        <div
          style={{
            position: "absolute",
            inset: "-2px",
            borderRadius: "13px",
            background: "transparent",
            border: `2px solid ${URGENT}`,
            opacity: callHovered ? 0 : 1,
            animation: "lqfRingPulse 2s ease-out infinite",
            pointerEvents: "none",
          }}
        />
        <button
          type="button"
          onClick={handleCall}
          onMouseEnter={() => setCallHovered(true)}
          onMouseLeave={() => setCallHovered(false)}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            width: "100%",
            padding: "1.0625rem",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#fff",
            background: callHovered ? `${URGENT}ee` : URGENT,
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            transition: "all 0.2s",
            boxShadow: callHovered ? `0 0 32px ${URGENT}66` : `0 0 18px ${URGENT}44`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.53 2 2 0 0 1 3.57 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
          </svg>
          Call Now — {phoneNumber}
        </button>
      </div>

      {/* Confirmation badge */}
      <div
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 0.5s ease 0.28s",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.625rem",
          padding: "0.875rem 1rem",
          background: "#0a1f13",
          border: "1px solid #1a4a2e",
          borderRadius: "4px",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <p style={{ fontSize: "0.8125rem", color: "#4ade80", margin: 0, lineHeight: 1.6 }}>
          Inquiry received. The {businessName} team has been notified and will be in touch shortly.
        </p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────

export function LeadQualificationForm({
  businessName,
  phoneNumber,
  accentColor = "#E63946",
  services,
  defaultService,
  webhookUrl1,
  webhookUrl2,
  webhookUrlPartial,
  webhookUrlCall,
  onComplete,
}: LeadQualificationFormProps) {

  type StepKey = "s1" | "loading_s1_s2" | "s2" | "loading_s2_s3" | "s3" | "loading_s3_s4" | "s4"
  const [step, setStep] = useState<StepKey>("s1")

  const [step1, setStep1] = useState<Step1Data>({ name: "", phone: "", email: "", service: defaultService || "", otherService: "", message: "" })
  const [step2, setStep2] = useState<Step2Data>({ make: "", model: "", year: "", drivable: "", emergency: "" })
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [diagnosis, setDiagnosis] = useState("")
  const [sessionId] = useState(() => crypto.randomUUID())
  const [webhookReady, setWebhookReady] = useState(false)
  const [animationReady, setAnimationReady] = useState(false)
  const [webhookReady3, setWebhookReady3] = useState(false)
  const [animationReady3, setAnimationReady3] = useState(false)

  const skipService = Boolean(defaultService)

  const [filledFields, setFilledFields] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    if (defaultService) init["service"] = true
    return init
  })

  const allFields = [
    "name", "phone", "email",
    ...(skipService ? [] : ["service"]),
    "make", "model", "year", "drivable", "emergency",
    "q1", "q2", "q3",
  ]

  const filledCount = allFields.filter((f) => filledFields[f]).length
  const progressPct = Math.round((filledCount / allFields.length) * 100)

  const handleFieldFilled = useCallback((key: string, filled: boolean) => {
    setFilledFields((prev) => ({ ...prev, [key]: filled }))
  }, [])

  useEffect(() => {
    if (webhookReady && animationReady && step === "loading_s2_s3") {
      setStep("s3")
    }
  }, [webhookReady, animationReady, step])

  useEffect(() => {
    if (webhookReady3 && animationReady3 && step === "loading_s3_s4") {
      setStep("s4")
    }
  }, [webhookReady3, animationReady3, step])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lqf_session")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.step1) setStep1(parsed.step1)
      }
    } catch {}
  }, [])

  // Freeze progress during loading transitions — only reflects real user-filled fields
  const isLoading = step === "loading_s1_s2" || step === "loading_s2_s3" || step === "loading_s3_s4"
  const [frozenPct, setFrozenPct] = useState(0)
  useEffect(() => {
    if (isLoading) setFrozenPct(progressPct)
  }, [isLoading]) // eslint-disable-line react-hooks/exhaustive-deps
  const displayPct = isLoading ? frozenPct : progressPct

  const stepLabel = (() => {
    if (step === "s1") return "Step 1 of 3 — Your Details"
    if (step === "loading_s1_s2") return "Step 1 of 3 — Your Details"
    if (step === "s2") return "Step 2 of 3 — Your Vehicle"
    if (step === "loading_s2_s3") return "Step 2 of 3 — Your Vehicle"
    if (step === "s3") return "Step 3 of 3 — Diagnostics"
    if (step === "loading_s3_s4") return "Step 3 of 3 — Diagnostics"
    return "Complete"
  })()

  const handleStep1Complete = useCallback(() => {
    try { localStorage.setItem("lqf_session", JSON.stringify({ step1 })) } catch {}
    if (webhookUrlPartial) {
      fireWebhook(webhookUrlPartial, {
        session_id: sessionId,
        name: step1.name, phone: step1.phone, email: step1.email,
        service: step1.service,
        otherService: step1.otherService || "",
        message: step1.message,
      })
    }
    setStep("loading_s1_s2")
  }, [step1, webhookUrlPartial])

  const handleStep2Complete = useCallback(async () => {
    setWebhookReady(false)
    setAnimationReady(false)
    setStep("loading_s2_s3")
    const payload = {
      session_id: sessionId,
      name: step1.name, phone: step1.phone, email: step1.email,
      service: step1.service,
      otherService: step1.otherService || "",
      message: step1.message,
      make: step2.make, model: step2.model, year: step2.year,
      drivable: step2.drivable, emergency: step2.emergency,
    }
    if (webhookUrl1) {
      try {
        const res = await fetch(webhookUrl1, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        if (res.ok) {
          const result = await res.json()
          if (result?.questions?.length) {
            setQuestions(result.questions)
          }
        }
      } catch {}
    }
    setWebhookReady(true)
  }, [step1, step2, webhookUrl1, sessionId])

  const handleStep3Complete = useCallback(async () => {
    setWebhookReady3(false)
    setAnimationReady3(false)
    setStep("loading_s3_s4")
    const resolvedAnswers = questions.map((q) => ({
      question: q.heading,
      selected_key: answers[q.id],
      selected_answer: q.options[answers[q.id]] ?? "",
      hint: q.hint[answers[q.id]] ?? "",
    }))
    const payload = {
      session_id: sessionId,
      answers,
      resolved_answers: resolvedAnswers,
      service: step1.service,
      make: step2.make, model: step2.model, year: step2.year,
      drivable: step2.drivable, emergency: step2.emergency,
      message: step1.message,
    }
    if (webhookUrl2) {
      try {
        const res = await fetch(webhookUrl2, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        if (res.ok) {
          const result = await res.json()
          setDiagnosis(result?.diagnosis || MOCK_DIAGNOSIS_RESPONSE.diagnosis)
        } else {
          setDiagnosis(MOCK_DIAGNOSIS_RESPONSE.diagnosis)
        }
      } catch {
        setDiagnosis(MOCK_DIAGNOSIS_RESPONSE.diagnosis)
      }
    } else {
      setDiagnosis(MOCK_DIAGNOSIS_RESPONSE.diagnosis)
    }
    setWebhookReady3(true)
    if (onComplete) {
      onComplete({
        name: step1.name, phone: step1.phone, email: step1.email,
        service: step1.service, message: step1.message,
        make: step2.make, model: step2.model, year: step2.year,
        drivable: step2.drivable, emergency: step2.emergency,
        answers, sessionId,
      })
    }
  }, [sessionId, answers, webhookUrl2, step1, step2, onComplete])

  return (
    <>
      <style>{`
        @keyframes lqfFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes lqfSlideDown { from { opacity:0;transform:translateY(-6px) } to { opacity:1;transform:translateY(0) } }
        @keyframes lqfPulse { 0%,100% { opacity:1;transform:scale(1) } 50% { opacity:0.4;transform:scale(0.78) } }
        @keyframes lqfRingPulse { 0% { transform:scale(1);opacity:0.7 } 70% { transform:scale(1.08);opacity:0 } 100% { transform:scale(1.08);opacity:0 } }
        .lqf-root * { box-sizing:border-box }
        .lqf-root input[type=number]::-webkit-inner-spin-button,
        .lqf-root input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none }
        .lqf-root input::placeholder,.lqf-root textarea::placeholder { color:#3d4550 }
      `}</style>

      <div
        className="lqf-root"
        style={{
          fontFamily: "inherit",
          background: T.bg,
          borderRadius: "6px",
          padding: "1.25rem",
          width: "100%",
          border: `1px solid ${T.border}`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.4)",
          color: T.text,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.25rem" }}>
              {businessName}
            </p>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.3 }}>
              {step === "s4" ? "Your Vehicle Report" : "Get a Free Diagnosis"}
            </h2>
          </div>
          {/* Status dot */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.125rem" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontSize: "0.6875rem", color: T.textMuted, fontWeight: 600 }}>Online</span>
          </div>
        </div>

        {/* Progress bar */}
        {step !== "s4" && (
          <ProgressBar pct={displayPct} accent={accentColor} stepLabel={stepLabel} />
        )}

        {/* Steps */}
        {step === "s1" && (
          <Step1
            data={step1}
            onChange={(d) => setStep1((p) => ({ ...p, ...d }))}
            onComplete={handleStep1Complete}
            services={services}
            defaultService={defaultService}
            accent={accentColor}
            onFieldFilled={handleFieldFilled}
          />
        )}

        {step === "loading_s1_s2" && (
          <FakeLoadingScreen accent={accentColor} transitionKey="s1_to_s2" onDone={() => setStep("s2")} />
        )}

        {step === "s2" && (
          <Step2
            data={step2}
            onChange={(d) => setStep2((p) => ({ ...p, ...d }))}
            onComplete={handleStep2Complete}
            accent={accentColor}
            onFieldFilled={handleFieldFilled}
          />
        )}

        {step === "loading_s2_s3" && (
          <FakeLoadingScreen accent={accentColor} transitionKey="s2_to_s3" onDone={() => setAnimationReady(true)} />
        )}

        {step === "s3" && (
          <Step3
            questions={questions}
            answers={answers}
            onAnswer={(qId, key) => setAnswers((p) => ({ ...p, [qId]: key }))}
            onComplete={handleStep3Complete}
            accent={accentColor}
            onFieldFilled={handleFieldFilled}
          />
        )}

        {step === "loading_s3_s4" && (
          <FakeLoadingScreen accent={accentColor} transitionKey="s3_to_s4" onDone={() => setAnimationReady3(true)} />
        )}

        {step === "s4" && (
          <Step4
            diagnosis={diagnosis}
            phoneNumber={phoneNumber}
            businessName={businessName}
            accent={accentColor}
            sessionId={sessionId}
            webhookUrlCall={webhookUrlCall}
          />
        )}
      </div>
    </>
  )
}

/*
──────────────────────────────────────────────────────────────
USAGE — drop into any page, modal, sidebar, or chat widget
──────────────────────────────────────────────────────────────

import { LeadQualificationForm } from "@/components/LeadQualificationForm"

// Basic (mock data — no webhooks needed to test):
<LeadQualificationForm
  businessName="All Clutch & Brake"
  phoneNumber="08 8277 8122"
  accentColor="#E63946"
  services={[
    "Brake Service",
    "Clutch Replacement",
    "Clutch Inspection",
    "Rotor Machining",
    "General Service",
    "Other / Not Sure",
  ]}
/>

// With n8n webhooks wired up:
<LeadQualificationForm
  businessName="All Clutch & Brake"
  phoneNumber="08 8277 8122"
  accentColor="#E63946"
  services={["Brake Service", "Clutch Replacement", "Rotor Machining", "Other"]}
  webhookUrl1="YOUR_N8N_WEBHOOK_URL_HERE"
  webhookUrl2="YOUR_N8N_WEBHOOK_URL_HERE"
  webhookUrlPartial="YOUR_N8N_WEBHOOK_URL_HERE"
  webhookUrlCall="YOUR_N8N_WEBHOOK_URL_HERE"
  onComplete={(data) => console.log("Lead captured:", data)}
/>
──────────────────────────────────────────────────────────────
*/
