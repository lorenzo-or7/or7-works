// Verificações de interação em Chrome real (Ctrl+K, sidebar, teclado, menu Mais, toque).
// Uso: node scripts/check-interactions.mjs [baseURL]
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
const base = process.argv[2] ?? 'http://localhost:5173'
const out = fileURLToPath(new URL('../docs/etapa-01/screenshots/', import.meta.url))
const b = await chromium.launch({ channel: 'chrome' })
const errs = []
// Desktop: Ctrl+K, sidebar solta
let ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
let p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message))
await p.goto(base + '/'); await p.keyboard.press('Control+k'); await p.waitForSelector('[cmdk-input]')
await p.keyboard.type('fin'); await p.screenshot({ path: out + 'interacao-desktop-ctrl-k.png' })
await p.keyboard.press('Enter'); await p.waitForURL('**/financeiro'); console.log('ctrl+k ->', p.url())
await p.click('button[aria-label="Recolher barra lateral"]'); await p.mouse.move(900, 400); await p.waitForTimeout(300)
await p.screenshot({ path: out + 'interacao-desktop-sidebar-recolhida.png' })
await p.mouse.move(30, 300); await p.waitForTimeout(400)
await p.screenshot({ path: out + 'interacao-desktop-sidebar-hover.png' })
const pinned = await p.evaluate(() => JSON.parse(localStorage.getItem('or7works:preferences')).sidebarPinned); console.log('sidebarPinned salvo:', pinned)
// teclado: Tab até o primeiro link
await p.goto(base + '/')
const stops = []
for (let i = 0; i < 4; i++) {
  await p.keyboard.press('Tab')
  stops.push(await p.evaluate(() => { const a = document.activeElement; return (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 30) }))
}
console.log('ordem de Tab:', stops.join(' | '))
// filtro personalizado
await p.click('text=Personalizado'); await p.screenshot({ path: out + 'interacao-desktop-periodo-personalizado.png' })
await ctx.close()
// Android: Mais, configurações
ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message))
await p.goto(base + '/'); await p.tap('text=Mais'); await p.waitForTimeout(300)
await p.screenshot({ path: out + 'interacao-android-menu-mais.png' })
await p.goto(base + '/configuracoes'); await p.screenshot({ path: out + 'interacao-android-configuracoes-lista.png' })
await p.tap('text=Aparência'); await p.waitForTimeout(200); await p.screenshot({ path: out + 'interacao-android-configuracoes-aparencia.png' })
await p.goto(base + '/calendario'); await p.screenshot({ path: out + 'interacao-android-calendario.png', fullPage: true })
const sizes = await p.evaluate(() => [...document.querySelectorAll('nav[aria-label="Navegação principal"] a, nav[aria-label="Navegação principal"] button')].map(e => { const r = e.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height) }))
console.log('alvos de toque da barra inferior:', sizes.join(' '))
await ctx.close(); await b.close()
console.log(errs.length ? errs.join('\n') : 'sem erros de página')
