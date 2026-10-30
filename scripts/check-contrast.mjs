// Verifica contraste WCAG de todo texto visível, com cores computadas pelo Chrome (inclui color-mix dos tokens).
// Uso: node scripts/check-contrast.mjs [baseURL]
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:5173'
const routes = ['/entrar', '/entrar/verificacao', '/boas-vindas', '/', '/painel/editar', '/notificacoes', '/configuracoes/aparencia', '/leads', '/calendario', '/financeiro']
const browser = await chromium.launch({ channel: 'chrome' })
const failures = []
let checked = 0

for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' })
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const res = await page.evaluate(() => {
      const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
      const rgba = (c) => {
        cv.clearRect(0, 0, 1, 1)
        cv.fillStyle = '#000'
        cv.fillStyle = c
        cv.fillRect(0, 0, 1, 1)
        const [r, g, b, a] = cv.getImageData(0, 0, 1, 1).data
        return [r, g, b, a / 255]
      }
      const lum = ([r, g, b]) => {
        const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
      }
      const over = (top, bottom) => top.slice(0, 3).map((v, i) => v * top[3] + bottom[i] * (1 - top[3]))
      const bgOf = (el) => {
        const stack = []
        for (let n = el; n; n = n.parentElement) {
          const s = getComputedStyle(n)
          if (s.backgroundImage !== 'none' && !n.matches('[data-orb] *')) return null // degradê/imagem: não avaliável
          const c = rgba(s.backgroundColor)
          if (c[3] > 0) stack.push(c)
          if (c[3] >= 1) break
        }
        let out = [255, 255, 255]
        for (const c of stack.reverse()) out = over(c, out)
        return out
      }
      const out = []
      let count = 0
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        const el = t.parentElement
        if (!t.textContent.trim() || !el || el.closest('[aria-hidden="true"], .sr-only, [hidden]')) continue
        const r = el.getBoundingClientRect()
        const s = getComputedStyle(el)
        if (!r.width || s.visibility === 'hidden' || Number(s.opacity) < 0.5 || s.webkitTextFillColor === 'rgba(0, 0, 0, 0)') continue
        const bg = bgOf(el)
        if (!bg) continue
        const fg = over(rgba(s.color), bg)
        const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x)
        const ratio = (a + 0.05) / (b + 0.05)
        const size = parseFloat(s.fontSize)
        const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700)
        count++
        if (ratio < (large ? 3 : 4.5)) out.push(`${ratio.toFixed(2)}:1  "${t.textContent.trim().slice(0, 40)}" (${size}px)`)
      }
      return { out, count }
    })
    checked += res.count
    for (const f of res.out) failures.push(`[${theme}] ${route}  ${f}`)
  }
  await page.close()
}
await browser.close()
console.log(`Textos verificados: ${checked}`)
console.log(failures.length ? failures.join('\n') : 'Todos os textos atingem AA (4,5:1; 3:1 para texto grande).')
