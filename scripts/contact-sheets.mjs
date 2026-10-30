// Monta folhas de contato (quadros lado a lado, com o instante) a partir de docs/etapa-01/screenshots/animacoes.
import { chromium } from 'playwright-core'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('../docs/etapa-01/screenshots/animacoes/', import.meta.url))
const groups = {}
for (const f of readdirSync(dir).filter((f) => /-\d+\.png$/.test(f))) {
  const name = f.replace(/-\d+\.png$/, '')
  ;(groups[name] ??= []).push(f)
}
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 400 } })
for (const [name, files] of Object.entries(groups)) {
  files.sort((a, b) => Number(a.match(/-(\d+)\.png$/)[1]) - Number(b.match(/-(\d+)\.png$/)[1]))
  const imgs = files
    .map((f, i) => `<figure><img src="data:image/png;base64,${readFileSync(dir + f).toString('base64')}"><figcaption>quadro ${i + 1}</figcaption></figure>`)
    .join('')
  await page.setContent(`<style>body{margin:0;padding:16px;background:#e9edf0;font:13px system-ui;color:#202c39}h1{font-size:15px;margin:0 0 10px}
    .row{display:flex;gap:12px;align-items:flex-start}figure{margin:0;flex:1;min-width:0}img{width:100%;display:block;border:1px solid #c9d2da;background:#fff}
    figcaption{margin-top:4px;color:#586878}</style><h1>${name}</h1><div class="row">${imgs}</div>`)
  await page.screenshot({ path: `${dir}folha-${name}.png`, fullPage: true })
}
await browser.close()
console.log('folhas:', Object.keys(groups).length)
