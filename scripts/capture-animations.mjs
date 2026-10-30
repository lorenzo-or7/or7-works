// Evidências de movimento em Chrome real: sequências de quadros + verificação automática de mudança entre quadros.
// Uso: node scripts/capture-animations.mjs [baseURL]
// Saída: docs/etapa-01/screenshots/animacoes/<efeito>-<n>.png e um resumo PASS/FAIL no terminal.
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const base = process.argv[2] ?? 'http://localhost:5173'
const out = fileURLToPath(new URL('../docs/etapa-01/screenshots/animacoes/', import.meta.url))
mkdirSync(out, { recursive: true })
const results = []
const browser = await chromium.launch({ channel: 'chrome' })

const desktop = { viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference', locale: 'pt-BR' }
const android = { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'no-preference', locale: 'pt-BR' }

async function page(opts, path, storage) {
  const ctx = await browser.newContext(opts)
  if (storage) await ctx.addInitScript((s) => Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v))), storage)
  const p = await ctx.newPage()
  p.on('pageerror', (e) => results.push(`ERRO ${path}: ${e.message}`))
  await p.goto(base + path, { waitUntil: 'domcontentloaded' })
  await p.evaluate(() => document.fonts.ready)
  return { p, ctx }
}

/** Captura quadros em instantes (ms) relativos ao início e registra se houve mudança visual. */
async function frames(p, name, times, clip, before) {
  if (before) await before()
  const t0 = Date.now()
  const shots = []
  for (const [i, t] of times.entries()) {
    const wait = t - (Date.now() - t0)
    if (wait > 0) await p.waitForTimeout(wait)
    shots.push(await p.screenshot({ path: `${out}${name}-${i + 1}.png`, clip }))
  }
  const changed = shots.some((s, i) => i > 0 && Buffer.compare(s, shots[i - 1]) !== 0)
  results.push(`${changed ? 'PASS' : 'FAIL'}  ${name}: ${changed ? 'quadros diferentes (movimento)' : 'quadros idênticos'}`)
  return changed
}

// 1. Orb (React Bits) — login desktop
{
  const { p, ctx } = await page(desktop, '/entrar')
  const box = await p.locator('aside').boundingBox()
  await frames(p, 'orb', [400, 1000, 1700, 2600], box)
  // reação ao ponteiro
  await p.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.35, { steps: 8 })
  await frames(p, 'orb-ponteiro', [100, 500], box)
  await ctx.close()
}
// 1b. Orb com movimento reduzido: deve ficar parado
{
  const { p, ctx } = await page({ ...desktop, reducedMotion: 'reduce' }, '/entrar')
  const box = await p.locator('aside').boundingBox()
  await p.waitForTimeout(800)
  const a = await p.screenshot({ clip: box, path: `${out}orb-reduzido-1.png` })
  await p.waitForTimeout(1200)
  const b = await p.screenshot({ clip: box, path: `${out}orb-reduzido-2.png` })
  results.push(`${Buffer.compare(a, b) === 0 ? 'PASS' : 'FAIL'}  orb-reduzido: ${Buffer.compare(a, b) === 0 ? 'parado com movimento reduzido' : 'ainda se move'}`)
  await ctx.close()
}
// 2. Blur Text — título do login (captura logo no carregamento)
{
  const ctx = await browser.newContext(desktop)
  const p = await ctx.newPage()
  await p.goto(base + '/entrar', { waitUntil: 'commit' })
  await p.waitForSelector('aside h2')
  const clip = await p.locator('aside h2').boundingBox()
  await frames(p, 'blur-text', [0, 180, 420, 1400], { x: clip.x - 8, y: clip.y - 20, width: clip.width + 40, height: clip.height + 40 })
  await ctx.close()
}
// 3. Shiny Text — marca no painel do login
{
  const { p, ctx } = await page(desktop, '/entrar')
  const el = p.locator('aside').getByText('Or7 Works').first()
  const b = await el.boundingBox()
  await frames(p, 'shiny-text', [200, 700, 1200, 1700, 2200], { x: b.x - 6, y: b.y - 6, width: b.width + 12, height: b.height + 12 })
  await ctx.close()
}
// 4. Sparkles — boas-vindas do onboarding
{
  const { p, ctx } = await page(desktop, '/boas-vindas')
  await p.waitForSelector('[data-sparkles] canvas', { timeout: 8000 }).catch(() => results.push('FAIL  sparkles: canvas não apareceu'))
  const b = await p.locator('[data-sparkles]').boundingBox()
  if (b) await frames(p, 'sparkles', [1200, 1700, 2300], b)
  await ctx.close()
}
// 5. Stepper — transição entre etapas
{
  const { p, ctx } = await page(desktop, '/boas-vindas')
  await p.waitForTimeout(600)
  const clip = { x: 340, y: 90, width: 760, height: 420 }
  await frames(p, 'stepper', [30, 160, 320, 900], clip, () => p.getByRole('button', { name: /Começar/ }).click())
  await ctx.close()
}
// 6. Sidebar — expansão por hover com a barra solta
{
  const { p, ctx } = await page(desktop, '/', { 'or7works:preferences': { sidebarPinned: false } })
  await p.mouse.move(900, 500)
  await p.waitForTimeout(400)
  const clip = { x: 0, y: 0, width: 320, height: 520 }
  await frames(p, 'sidebar-expandir', [0, 90, 200, 600], clip, () => p.mouse.move(30, 300))
  await frames(p, 'sidebar-indicador', [0, 120, 500], clip, () => p.getByRole('link', { name: /^Leads/ }).first().click())
  await ctx.close()
}
// 7. Bento — hover em indicador; 8. Glowing Effect; 9. Moving Border; 10. Controle segmentado
{
  const { p, ctx } = await page(desktop, '/')
  await p.waitForTimeout(500)
  const card = p.getByRole('region', { name: 'Leads descobertos' })
  const cb = await card.boundingBox()
  await frames(p, 'bento-hover', [0, 150, 450], cb, () => card.hover())
  const hero = p.getByRole('region', { name: 'Configuração inicial' })
  const hb = await hero.boundingBox()
  await p.mouse.move(hb.x + 40, hb.y + hb.height + 30)
  await frames(p, 'glowing', [0, 500, 1300], { x: hb.x - 10, y: hb.y - 10, width: hb.width + 20, height: hb.height + 20 }, () =>
    p.mouse.move(hb.x + hb.width - 30, hb.y + 12, { steps: 12 }),
  )
  const cta = p.getByRole('link', { name: /configuração/ }).first()
  const ctab = await cta.boundingBox()
  await p.mouse.move(10, 10)
  await frames(p, 'moving-border', [0, 700, 1400], { x: ctab.x - 8, y: ctab.y - 8, width: ctab.width + 16, height: ctab.height + 16 })
  const seg = p.getByRole('group', { name: 'Período' })
  const sb = await seg.boundingBox()
  await frames(p, 'segmentado', [0, 90, 220, 600], { x: sb.x - 6, y: sb.y - 6, width: sb.width + 12, height: sb.height + 12 }, () =>
    p.getByRole('radio', { name: 'Últimos 90 dias' }).click(),
  )
  await ctx.close()
}
// 11. Counting Number + Progress — com progresso real de 2 etapas
{
  const { p, ctx } = await page(desktop, '/', { 'or7works:onboarding': { current: 2, completed: ['boas-vindas', 'perfil'], finished: false } })
  const hero = p.getByRole('region', { name: 'Configuração inicial' })
  await hero.waitFor()
  const hb = await hero.boundingBox()
  await frames(p, 'contador', [0, 250, 1200], hb)
  await ctx.close()
}
// 12. Stateful Button — salvar layout
{
  const { p, ctx } = await page(desktop, '/painel/editar')
  await p.getByRole('button', { name: 'Mover Configuração inicial para baixo' }).click()
  const btn = p.getByRole('button', { name: 'Salvar layout' })
  const bb = await btn.boundingBox()
  await frames(p, 'stateful', [0, 120, 700], { x: bb.x - 12, y: bb.y - 8, width: bb.width + 60, height: bb.height + 16 }, () => btn.click())
  await ctx.close()
}
// 13. Login: borda radial do input (Signup Form)
{
  const { p, ctx } = await page(desktop, '/entrar')
  const input = p.getByLabel('E-mail')
  const ib = await input.boundingBox()
  const clip = { x: ib.x - 12, y: ib.y - 12, width: ib.width + 24, height: ib.height + 24 }
  await frames(p, 'login-input', [0, 300], clip, () => p.mouse.move(ib.x + 60, ib.y + 10, { steps: 6 }))
  const btn = p.getByRole('button', { name: 'Entrar' })
  const bb = await btn.boundingBox()
  await frames(p, 'login-botao-hover', [0, 600], { x: bb.x - 6, y: bb.y - 6, width: bb.width + 12, height: bb.height + 12 }, () => btn.hover())
  await ctx.close()
}
// 14. Android: Dock (indicador + ampliação) e Ripple ao tocar
{
  const { p, ctx } = await page(android, '/')
  await p.waitForTimeout(400)
  const nav = p.getByRole('navigation', { name: 'Navegação principal' }).last()
  const nb = await nav.boundingBox()
  await frames(p, 'dock-ripple', [40, 160, 420, 900], nb, () => p.getByRole('link', { name: 'Leads' }).last().tap())
  await ctx.close()
}

await browser.close()
console.log(results.join('\n'))
