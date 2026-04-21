import type { ScenarioPoint } from '@/types/scenario'
import { getIconUrl } from '@/components/scenario/icon-picker/scenarioIconOptions'

// ── Time ─────────────────────────────────────────────────────────────────────

export type TimeFormat = '12h' | '24h'

export function formatTime(hhmm: string, fmt: TimeFormat): string {
  const [hStr, mStr] = hhmm.split(':')
  const h = parseInt(hStr ?? '0', 10)
  const m = parseInt(mStr ?? '0', 10)
  const date = new Date(2000, 0, 1, h, m)
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: fmt === '12h',
  })
}

// ── Debounce ──────────────────────────────────────────────────────────────────

export function createKeyedDebounce(ms: number) {
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  return function debounced(key: string, fn: () => void): void {
    const existing = timers.get(key)
    if (existing) clearTimeout(existing)
    timers.set(key, setTimeout(() => {
      timers.delete(key)
      fn()
    }, ms))
  }
}

// ── Export ────────────────────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function exportScenarioTxt(
  points: ScenarioPoint[],
  title: string,
  timeFormat: TimeFormat,
  getLabel: (icon: string) => string,
  locale: string,
): void {
  const sep = '═'.repeat(52)
  const lines: string[] = [title, sep, '']

  for (const point of points) {
    const time = formatTime(point.time, timeFormat)
    const iconLabel = getLabel(point.icon)
    lines.push(`  ${time.padEnd(9)} ${iconLabel.padEnd(18)} ${point.title}`)
    if (point.note) {
      lines.push(`  ${' '.repeat(9)} ${' '.repeat(18)} ${point.note}`)
    }
    lines.push('')
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = locale === 'ru' ? 'сценарий.txt' : 'scenario.txt'
  a.click()
  URL.revokeObjectURL(url)
}

export function exportScenarioPdf(
  points: ScenarioPoint[],
  title: string,
  timeFormat: TimeFormat,
  getLabel: (icon: string) => string,
  locale: string,
): void {
  const rows = points.map((point) => {
    const time = formatTime(point.time, timeFormat)
    const iconLabel = getLabel(point.icon)
    const iconUrl = getIconUrl(point.icon)
    return `
      <tr>
        <td class="col-time">${time}</td>
        <td class="col-icon">
          <img src="${iconUrl}" alt="${escHtml(iconLabel)}" class="icon-img" />
        </td>
        <td class="col-body">
          <div class="point-title">${escHtml(point.title)}</div>
          ${point.note ? `<div class="point-note">${escHtml(point.note)}</div>` : ''}
        </td>
      </tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <title>${escHtml(title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1a1a2e; padding: 24px 32px; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 6px; color: #1a1a2e; }
    .rule { border: none; border-top: 2px solid #e0e0e0; margin-bottom: 18px; }
    table { width: 100%; border-collapse: collapse; }
    tr { border-bottom: 1px solid #f0f0f0; }
    tr:last-child { border-bottom: none; }
    td { padding: 8px 6px; vertical-align: middle; }
    .col-time { white-space: nowrap; font-size: 11px; font-weight: 700; color: #5a9e7a; width: 52px; }
    .col-icon { width: 32px; text-align: center; }
    .icon-img { width: 22px; height: 22px; object-fit: contain; }
    .col-body { padding-left: 8px; }
    .point-title { font-size: 13px; font-weight: 600; color: #1a1a2e; }
    .point-note { font-size: 11px; color: #777; margin-top: 2px; }
    @media print {
      body { padding: 16px 24px; }
      @page { margin: 12mm 16mm; }
    }
  </style>
</head>
<body>
  <h1>${escHtml(title)}</h1>
  <hr class="rule" />
  <table><tbody>${rows}</tbody></table>
</body>
</html>`

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument!
  doc.open()
  doc.write(html)
  doc.close()

  iframe.onload = () => {
    iframe.contentWindow!.print()
    iframe.contentWindow!.onafterprint = () => document.body.removeChild(iframe)
  }
}