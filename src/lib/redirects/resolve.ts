import { permanentRedirect, redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload/client'
import { normalizePath } from '@/lib/seo/url'

import { getCachedRedirect, setCachedRedirect, type RedirectEntry } from './cache'

/**
 * Resolve um redirect criado no CMS.
 *
 * Chamado só quando a rota não correspondeu a nenhuma página — o caminho feliz
 * nunca chega aqui. O cache guarda também o resultado NEGATIVO: sem isso, toda
 * URL inexistente iria ao banco, que é justamente onde os bots batem mais.
 */
export const lookupRedirect = async (path: string): Promise<RedirectEntry> => {
  const key = normalizePath(path)

  const cached = getCachedRedirect(key)
  if (cached !== undefined) return cached

  let entry: RedirectEntry = null

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'redirects',
      where: {
        and: [{ from: { equals: key } }, { active: { equals: true } }],
      },
      limit: 1,
      depth: 0,
      pagination: false,
    })

    const doc = result.docs[0]
    if (doc) {
      entry = { to: doc.to ?? null, type: doc.type as '301' | '302' | '410' }

      // Contador de uso: mostra, depois de um ano, quais redirects ainda importam.
      void payload
        .update({
          collection: 'redirects',
          id: doc.id,
          data: { hits: (doc.hits ?? 0) + 1, lastHitAt: new Date().toISOString() },
          context: { disableRevalidate: true },
        })
        .catch(() => {
          // Contador é telemetria. Falhar aqui não pode afetar a resposta.
        })
    }
  } catch {
    // Banco indisponível não deve virar erro 500 numa URL que provavelmente é 404.
    return null
  }

  setCachedRedirect(key, entry)
  return entry
}

/**
 * Aplica o redirect encontrado. Não retorna — permanentRedirect e redirect
 * lançam internamente, como o Next espera.
 */
export const applyRedirect = (entry: NonNullable<RedirectEntry>): never => {
  if (entry.type === '410' || !entry.to) {
    // 410 é emitido pelo proxy a partir de goneUrls. Um 410 criado no CMS
    // depois do lançamento cai aqui e vira 404 — a diferença prática é pequena,
    // e é preferível a redirecionar para algo que não corresponde.
    throw new Error('GONE')
  }
  if (entry.type === '302') redirect(entry.to)
  permanentRedirect(entry.to)
}
