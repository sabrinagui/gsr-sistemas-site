import { normalizePath } from '@/lib/seo/url'

/**
 * Cache em memória da camada 3 (redirects criados no CMS).
 *
 * O detalhe que faz este cache funcionar são as CHAVES NEGATIVAS: sem elas,
 * toda URL inexistente iria ao banco — e é exatamente aí que os bots batem mais.
 */

export type RedirectEntry = {
  to: string | null
  type: '301' | '302' | '410'
} | null

const TTL_MS = 5 * 60 * 1000

type CacheRecord = { value: RedirectEntry; expiresAt: number }

const cache = new Map<string, CacheRecord>()

export const getCachedRedirect = (path: string): RedirectEntry | undefined => {
  const key = normalizePath(path)
  const record = cache.get(key)
  if (!record) return undefined
  if (Date.now() > record.expiresAt) {
    cache.delete(key)
    return undefined
  }
  return record.value
}

export const setCachedRedirect = (path: string, value: RedirectEntry): void => {
  cache.set(normalizePath(path), { value, expiresAt: Date.now() + TTL_MS })
}

/** Chamado pelos hooks da collection Redirects ao salvar ou apagar. */
export const invalidateRedirectCache = (): void => {
  cache.clear()
}

export const redirectCacheSize = (): number => cache.size
