import type { CollectionConfig } from 'payload'

import { pageBlocks } from '@/blocks'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

const pagePath = (doc: any): string | null => {
  if (!doc?.slug) return null
  return doc.slug === 'home' ? '/' : `/${doc.slug}`
}

/**
 * Páginas institucionais de layout livre: /, /sobre, /contato, /orcamento,
 * /servicos, /obrigado. É a única collection composta por blocos.
 *
 * Sem campo `status` (o _status nativo já existe) e sem campo `breadcrumbs`
 * (derivado da URL e de `parent` — armazenar permitiria divergir da estrutura real).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Página', plural: 'Páginas' },
  admin: {
    useAsTitle: 'title',
    group: 'Conteúdo',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => `/preview?collection=pages&slug=${data?.slug}`,
    },
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateAfterChange({ path: pagePath })],
    afterDelete: [revalidateAfterDelete({ path: pagePath })],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Conteúdo',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'excerpt', type: 'textarea', label: 'Resumo' },
            { name: 'featuredImage', type: 'upload', relationTo: 'media' },
            { name: 'layout', type: 'blocks', blocks: pageBlocks, label: 'Seções' },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    slugField(),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Página mãe',
      admin: { position: 'sidebar', description: 'Alimenta o breadcrumb.' },
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}
