/**
 * Validação do mapa de redirects. Roda antes de cada deploy.
 *
 * Verifica o que o checklist da FASE 2 exige: sem `from` duplicado, sem ciclo,
 * sem cadeia e sem destino que não existe na arquitetura aprovada.
 *
 *   npm run check:redirects
 *   npm run check:redirects -- --live https://gsrsistemas.com   (checa status HTTP real)
 */
import { goneUrls, queryRedirects, staticRedirects } from '../src/lib/redirects/static-redirects'

type Problem = { level: 'erro' | 'aviso'; message: string }

const problems: Problem[] = []
const err = (message: string) => problems.push({ level: 'erro', message })
const warn = (message: string) => problems.push({ level: 'aviso', message })

const sources = staticRedirects.map((r) => r.source)
const destinations = staticRedirects.map((r) => r.destination)

// 1. from duplicado — dois redirects disputando a mesma URL.
const seen = new Set<string>()
for (const source of sources) {
  if (seen.has(source)) err(`origem duplicada: ${source}`)
  seen.add(source)
}

// 2. self-redirect.
staticRedirects.forEach((r) => {
  if (r.source === r.destination) err(`redirect para si mesmo: ${r.source}`)
})

// 3. cadeia — destino que é origem de outro redirect. Custa um salto a mais e
//    dilui o sinal; o mapa foi montado justamente para não ter nenhuma.
staticRedirects.forEach((r) => {
  if (sources.includes(r.destination)) {
    err(`cadeia: ${r.source} -> ${r.destination}, que também redireciona`)
  }
})

// 4. ciclo direto.
staticRedirects.forEach((a) => {
  const back = staticRedirects.find((b) => b.source === a.destination && b.destination === a.source)
  if (back) err(`ciclo entre ${a.source} e ${a.destination}`)
})

// 5. destino que também está marcado como removido.
const gone = new Set(goneUrls)
destinations.forEach((d) => {
  if (gone.has(d)) err(`destino marcado como 410: ${d}`)
})

// 6. redirect de query apontando para origem de outro redirect.
queryRedirects.forEach((q) => {
  if (sources.includes(q.destination)) {
    err(`cadeia via query: ?${q.key}=${q.value} -> ${q.destination}, que também redireciona`)
  }
})

// 7. 302 em migração — deveria ser 301.
staticRedirects.forEach((r) => {
  if (r.statusCode !== 301) warn(`temporário (302) no mapa de migração: ${r.source}`)
})

const summary = () => {
  const errors = problems.filter((p) => p.level === 'erro')
  const warnings = problems.filter((p) => p.level === 'aviso')

  console.log(`redirects estáticos : ${staticRedirects.length}`)
  console.log(`redirects de query  : ${queryRedirects.length}`)
  console.log(`URLs 410            : ${goneUrls.length}`)
  console.log('')

  problems.forEach((p) => console.log(`${p.level === 'erro' ? 'ERRO ' : 'aviso'}  ${p.message}`))

  if (problems.length === 0) console.log('Nenhum problema encontrado.')
  console.log(`\n${errors.length} erro(s), ${warnings.length} aviso(s)`)

  return errors.length
}

const liveIndex = process.argv.indexOf('--live')
if (liveIndex === -1) {
  process.exit(summary() > 0 ? 1 : 0)
} else {
  // 8. Checagem contra o site publicado: todo destino precisa responder 200.
  const base = (process.argv[liveIndex + 1] ?? 'https://gsrsistemas.com').replace(/\/+$/, '')
  const targets = [...new Set([...destinations, ...queryRedirects.map((q) => q.destination)])]

  console.log(`Verificando ${targets.length} destinos em ${base}\n`)

  const check = async () => {
    for (const target of targets) {
      try {
        const response = await fetch(`${base}${target}`, { redirect: 'manual' })
        if (response.status !== 200) {
          err(`destino não responde 200: ${target} (${response.status})`)
        }
      } catch {
        err(`destino inacessível: ${target}`)
      }
    }
    process.exit(summary() > 0 ? 1 : 0)
  }

  void check()
}
