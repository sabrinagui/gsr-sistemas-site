import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Revalida a própria página, a listagem correspondente, as consultas em cache e
 * o sitemap.
 *
 * O sitemap precisa entrar aqui: publicar um documento novo sem revalidá-lo
 * deixaria a URL fora do sitemap até o próximo build.
 *
 * No Next 16 revalidateTag exige um perfil de cache — 'max' é o adequado para
 * invalidação sob demanda vinda do CMS.
 */
type Options = {
  /** Devolve o path público do documento. */
  path: (doc: any) => string | null
  /** Listagens revalidadas junto (ex.: '/blog'). */
  listings?: string[]
  /** Tags de unstable_cache usadas por src/lib/payload/queries.ts. */
  tags?: string[]
}

const revalidate = (paths: Iterable<string>, tags: string[]) => {
  for (const path of paths) {
    try {
      revalidatePath(path, 'page')
    } catch {
      // Fora do contexto de request (seed, script) revalidatePath não existe.
    }
  }

  for (const tag of ['sitemap', ...tags]) {
    try {
      revalidateTag(tag, 'max')
    } catch {
      /* idem */
    }
  }
}

export const revalidateAfterChange =
  ({ path, listings = [], tags = [] }: Options): CollectionAfterChangeHook =>
  ({ doc, previousDoc, req }) => {
    if (req.context?.disableRevalidate) return doc

    const targets = new Set<string>()

    const current = path(doc)
    if (current) targets.add(current)

    // Se o slug mudou, a URL antiga também precisa ser invalidada.
    const previous = previousDoc ? path(previousDoc) : null
    if (previous && previous !== current) targets.add(previous)

    listings.forEach((listing) => targets.add(listing))
    revalidate(targets, tags)

    return doc
  }

export const revalidateAfterDelete =
  ({ path, listings = [], tags = [] }: Options): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    if (req.context?.disableRevalidate) return doc

    const target = path(doc)
    revalidate(new Set([...(target ? [target] : []), ...listings]), tags)

    return doc
  }
