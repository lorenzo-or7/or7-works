// Gera screenshots reais (Chrome instalado via playwright-core) das rotas da Etapa 01.
// Uso: npm run dev (em outro terminal) e então: npm run screenshots -- [baseURL]
// Também verifica overflow horizontal e erros de console por rota.
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const base = process.argv[2] ?? 'http://localhost:5173'
// OUT: subpasta de destino (padrão: depois). WIDTHS=1 gera também a bateria de larguras do painel e do login.
const out = fileURLToPath(new URL(`../docs/etapa-01/screenshots/${process.env.OUT ?? 'depois'}/`, import.meta.url))
mkdirSync(out, { recursive: true })

const ROUTES = [
  ['entrar', '/entrar'],
  ['verificacao', '/entrar/verificacao'],
  ['recuperar-acesso', '/recuperar-acesso'],
  ['boas-vindas', '/boas-vindas'],
  ['painel', '/'],
  ['painel-editar', '/painel/editar'],
  ['notificacoes', '/notificacoes'],
  ['configuracoes', '/configuracoes'],
  ['configuracoes-aparencia', '/configuracoes/aparencia'],
  ['configuracoes-ia-custos', '/configuracoes/ia-custos'],
  ['leads', '/leads'],
  ['crm', '/crm'],
  ['propostas', '/propostas'],
  ['auditorias', '/auditorias'],
  ['agentes', '/agentes'],
  ['clientes', '/clientes'],
  ['projetos', '/projetos'],
  ['documentos', '/documentos'],
  ['financeiro', '/financeiro'],
  ['calendario', '/calendario'],
  ['relatorios', '/relatorios'],
  ['monitoramento', '/monitoramento'],
  ['404', '/nao-existe'],
]

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  android: {
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36',
  },
}

const only = process.env.ROUTES?.split(',')
const themes = (process.env.THEMES ?? 'light,dark').split(',')
const browser = await chromium.launch({ channel: 'chrome' })
const problems = []

for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  for (const theme of themes) {
    const ctx = await browser.newContext({ ...vp, colorScheme: theme, reducedMotion: 'reduce', locale: 'pt-BR' })
    const page = await ctx.newPage()
    page.on('console', (m) => m.type() === 'error' && problems.push(`[${vpName}/${theme}] console: ${m.text()}`))
    page.on('pageerror', (e) => problems.push(`[${vpName}/${theme}] pageerror: ${e.message}`))
    for (const [name, path] of ROUTES) {
      if (only && !only.includes(name)) continue
      await page.goto(base + path, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      if (overflow > 0) problems.push(`[${vpName}/${theme}] ${path}: overflow horizontal de ${overflow}px`)
      await page.screenshot({ path: `${out}${vpName}-${theme}-${name}.png`, fullPage: vpName === 'desktop' })
    }
    await ctx.close()
  }
}

if (process.env.WIDTHS) {
  for (const width of [360, 390, 412, 768, 1024, 1440, 1920]) {
    const mobile = width < 768
    const ctx = await browser.newContext({ viewport: { width, height: mobile ? 860 : 1000 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1, reducedMotion: 'reduce', locale: 'pt-BR' })
    const page = await ctx.newPage()
    for (const [name, path] of [['painel', '/'], ['entrar', '/entrar']]) {
      await page.goto(base + path, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      if (overflow > 0) problems.push(`[${width}px] ${path}: overflow horizontal de ${overflow}px`)
      await page.screenshot({ path: `${out}largura-${width}-${name}.png` })
    }
    await ctx.close()
  }
}

await browser.close()
console.log(problems.length ? problems.join('\n') : 'Sem overflow horizontal nem erros de console.')
