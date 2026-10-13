/**
 * Gera src/lib/redirects/static-redirects.ts a partir de docs/migration-url-map.csv.
 *
 * O CSV é a fonte da verdade do mapa de migração. Transcrever 50 linhas à mão
 * para o código seria uma fonte de erro silencioso; este script mantém os dois
 * em sincronia e pode ser reexecutado sempre que o CSV mudar.
 *
 *   npx tsx scripts/generate-redirects.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CSV = resolve(root, 'docs/migration-url-map.csv')
const OUT = resolve(root, 'src/lib/redirects/static-redirects.ts')

/** Parser de CSV com suporte a campo entre aspas contendo vírgula. */
const parseCsv = (text: string): string[][] => {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += char
      continue
    }
    if (char === '"') inQuotes = true
    else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      if (row.some((c) => c.trim() !== '')) rows.push(row)
      row = []
      field = ''
    } else if (char !== '\r') field += char
  }
  row.push(field)
  if (row.some((c) => c.trim() !== '')) rows.push(row)
  return rows
}

type Entry = { source: string; destination: string; permanent: boolean }
type QueryEntry = { key: string; value: string; destination: string; permanent: boolean }

const rows = parseCsv(readFileSync(CSV, 'utf8')).slice(1)

const entries: Entry[] = []
const queryEntries: QueryEntry[] = []
const gone: string[] = []
const skipped: string[] = []

for (const [oldUrl, newUrl, action, status, notes] of rows) {
  const from = (oldUrl ?? '').trim()
  const to = (newUrl ?? '').trim()
  const act = (action ?? '').trim().toUpperCase()

  // Regras de host e de esquema são resolvidas na infra, não aqui.
  if (from.startsWith('http')) {
    skipped.push(`${from} — tratado na infraestrutura (vhost/DNS)`)
    continue
  }
  // Curingas e endpoints do WordPress ficam de fora enquanto o WP existir.
  if (from.includes('{') || act.includes('PENDING') || act.includes('AVALIAR')) {
    skipped.push(`${from} — ${action}`)
    continue
  }
  if ((status ?? '').includes('410')) {
    // O proxy compara o path sem barra final.
    gone.push(from.replace(/\/$/, ''))
    continue
  }
  if (!to || act === 'KEEP' || act === 'SUBSTITUIR' || (status ?? '').trim() === '404') {
    skipped.push(`${from} — ${action || status}`)
    continue
  }

  // URLs não-canônicas do WordPress (/?p=121). Tratadas no proxy, não aqui:
  // o Next repassa a query string ao destino, o que transformaria
  // /?page_id=20 -> / em um loop infinito.
  const queryMatch = from.match(/^\/\?([a-z_]+)=(.+)$/i)
  if (queryMatch) {
    queryEntries.push({
      key: queryMatch[1],
      value: queryMatch[2],
      destination: to,
      permanent: (status ?? '').includes('301'),
    })
    continue
  }

  if (!from.startsWith('/')) {
    skipped.push(`${from} — formato não reconhecido`)
    continue
  }

  // Com trailingSlash: true, a origem fica exatamente como o WordPress a
  // publicou (com barra final). URLs sem barra chegam aqui depois do 308 do Next.
  const source = from

  if (source === to) {
    skipped.push(`${from} — origem igual ao destino`)
    continue
  }

  entries.push({ source, destination: to, permanent: (status ?? '').includes('301') })
}

// statusCode explícito em vez de `permanent: true`. O Next traduz `permanent`
// para 308, e o mapa de migração documenta 301. O Google trata os dois como
// permanentes, mas não há motivo para o código divergir do documento aprovado.
const serialize = (e: Entry) =>
  `  {\n    source: '${e.source}',\n    destination: '${e.destination}',\n    statusCode: ${e.permanent ? 301 : 302},\n  },`

const serializeQuery = (e: QueryEntry) =>
  `  { key: '${e.key}', value: '${e.value}', destination: '${e.destination}', permanent: ${e.permanent} },`

const file = `/**
 * GERADO AUTOMATICAMENTE — não editar à mão.
 * Fonte: docs/migration-url-map.csv
 * Regerar: npx tsx scripts/generate-redirects.ts
 *
 * Camada 2 do sistema de redirects: o mapa de migração, resolvido na build.
 * Todo destino aponta para a URL final que responde 200 — sem cadeia.
 *
 * Fora daqui, por decisão da FASE 2:
 *  - regras de host e esquema (www, http): vhost e DNS
 *  - endpoints do WordPress: reavaliados após o desligamento do WP
 */
import type { Redirect } from 'next/dist/lib/load-custom-routes'

export const staticRedirects: Redirect[] = [
${entries.map(serialize).join('\n')}
]

/**
 * URLs não-canônicas do WordPress (/?p=121, /?page_id=20).
 *
 * Não podem virar entradas de next.config: o Next repassa a query string ao
 * destino, então /?page_id=20 -> / entraria em loop. O proxy resolve e
 * descarta a query explicitamente.
 */
export const queryRedirects = [
${queryEntries.map(serializeQuery).join('\n')}
]

/** Removidas de propósito, sem equivalente. Aplicadas como 410 pelo proxy. */
export const goneUrls: string[] = [
${gone.map((g) => `  '${g.replace(/\/$/, '') || '/'}',`).join('\n')}
]
`

writeFileSync(OUT, file, 'utf8')

console.log(`301/302 estáticos : ${entries.length}`)
console.log(`redirects de query: ${queryEntries.length}`)
console.log(`410 gerados       : ${gone.length}`)
console.log(`fora do arquivo   : ${skipped.length}`)
skipped.forEach((s) => console.log(`   · ${s}`))
console.log(`\nEscrito em ${OUT}`)
