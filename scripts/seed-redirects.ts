/**
 * Carrega o mapa de migração na collection Redirects.
 *
 * A camada 2 (next.config.ts) já resolve estes redirects na build. O seed existe
 * para que eles fiquem visíveis e editáveis no painel, e para que o contador
 * `hits` mostre, depois de alguns meses, quais ainda recebem tráfego.
 *
 *   npm run seed:redirects
 *
 * As variaveis vem de .env.local via --env-file (nativo do Node 24).
 */
import { goneUrls, queryRedirects, staticRedirects } from '../src/lib/redirects/static-redirects'

const run = async () => {
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  type Row = { from: string; to: string | null; type: '301' | '302' | '410'; notes: string }

  const rows: Row[] = [
    ...staticRedirects.map((r) => ({
      from: r.source,
      to: r.destination,
      type: (r.permanent || ('statusCode' in r && r.statusCode === 301) ? '301' : '302') as '301' | '302',
      notes: 'Mapa de migração do WordPress. Também resolvido na build (next.config.ts).',
    })),
    ...queryRedirects.map((r) => ({
      from: `/?${r.key}=${r.value}`,
      to: r.destination,
      type: (r.permanent ? '301' : '302') as '301' | '302',
      notes: 'URL não-canônica do WordPress. Resolvida no proxy, que descarta a query.',
    })),
    ...goneUrls.map((from) => ({
      from,
      to: null,
      type: '410' as const,
      notes: 'Removida de propósito, sem equivalente. Aplicada como 410 pelo proxy.',
    })),
  ]

  // Mesma normalização do hook da collection (barra final, minúsculas).
  const canonical = (p: string) =>
    (!p.includes('?') && !/\.[a-z0-9]+$/i.test(p) && !p.endsWith('/') ? `${p}/` : p).toLowerCase()

  let created = 0
  let updated = 0

  for (const row of rows) {
    const existing = await payload.find({
      collection: 'redirects',
      where: { from: { equals: canonical(row.from) } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'redirects',
        id: existing.docs[0].id,
        data: { to: row.to ?? undefined, type: row.type, notes: row.notes, active: true },
        context: { disableRevalidate: true },
      })
      updated++
    } else {
      await payload.create({
        collection: 'redirects',
        data: { ...row, to: row.to ?? undefined, active: true, hits: 0 },
        context: { disableRevalidate: true },
      })
      created++
    }
  }

  // Remove o que saiu do mapa (ex.: entradas antigas sem barra final, ou que
  // apontavam para slugs descartados). Redirects criados à mão no painel, sem a
  // nota padrão do mapa, são preservados.
  const keep = new Set(rows.map((r) => canonical(r.from)))
  const all = await payload.find({ collection: 'redirects', limit: 1000, depth: 0 })
  let removed = 0
  for (const doc of all.docs) {
    const fromMap = /Mapa de migração|URL não-canônica|Removida de propósito/.test(String(doc.notes ?? ''))
    if (fromMap && !keep.has(doc.from as string)) {
      await payload.delete({ collection: 'redirects', id: doc.id, context: { disableRevalidate: true } })
      removed++
    }
  }

  console.log(`Redirects removidos (fora do mapa): ${removed}`)
  console.log(`Redirects criados: ${created}`)
  console.log(`Redirects atualizados: ${updated}`)
  console.log(`Total no mapa: ${rows.length}`)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
