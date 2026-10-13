import type { CollectionConfig } from 'payload'

import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { postPath } from '@/lib/posts'

/** Categorias como select. Viram collection quando uma delas chegar a 5 posts. */
export const POST_CATEGORIES = [
  { label: 'Criação de sites', value: 'criacao-de-sites' },
  { label: 'Desenvolvimento de sistemas', value: 'desenvolvimento-de-sistemas' },
  { label: 'SEO e performance', value: 'seo-e-performance' },
  { label: 'Negócios digitais', value: 'negocios-digitais' },
]

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Artigo', plural: 'Artigos' },
  admin: {
    useAsTitle: 'title',
    group: 'Conteúdo',
    defaultColumns: ['title', 'category', 'publishedAt', 'needsReview', '_status'],
    livePreview: {
      url: ({ data }) => `/preview?collection=posts&slug=${data?.slug}`,
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
    beforeValidate: [
      ({ data, originalDoc }) => {
        const status = data?._status ?? originalDoc?._status
        const needsReview = data?.needsReview ?? originalDoc?.needsReview
        if (status === 'published' && needsReview) {
          throw new Error(
            'Este artigo está marcado como "precisa de revisão" e não pode ser publicado. Revise o conteúdo, remova afirmações não confirmadas e desmarque a caixa.',
          )
        }
        return data
      },
    ],
    beforeChange: [
      ({ data }) => {
        // Tempo de leitura a partir do texto do Lexical.
        const raw = JSON.stringify(data?.content ?? '')
        const words = (raw.match(/"text":"[^"]*"/g) ?? []).join(' ').split(/\s+/).length
        data.readingTime = Math.max(1, Math.round(words / 200))
        return data
      },
    ],
    afterChange: [
      revalidateAfterChange({
        path: (doc) => (doc?.slug ? postPath(doc) : null),
        listings: ['/blog/', '/', '/author/sabrina/'],
      }),
    ],
    afterDelete: [
      revalidateAfterDelete({
        path: (doc) => (doc?.slug ? postPath(doc) : null),
        listings: ['/blog/', '/author/sabrina/'],
      }),
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Conteúdo',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Título (H1)' },
            { name: 'excerpt', type: 'textarea', required: true, label: 'Resumo' },
            { name: 'featuredImage', type: 'upload', relationTo: 'media' },
            { name: 'content', type: 'richText', required: true },
          ],
        },
        {
          label: 'Relacionamentos',
          fields: [
            { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
            { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true },
            {
              name: 'topics',
              type: 'text',
              hasMany: true,
              label: 'Tópicos internos',
              admin: { description: 'Organização interna. Não gera página pública.' },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    slugField(),
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'select',
      options: POST_CATEGORIES,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publicado em',
      admin: {
        position: 'sidebar',
        description: 'Na migração, preserve a data original do WordPress.',
      },
    },
    {
      name: 'showUpdatedDate',
      type: 'checkbox',
      label: 'Exibir data de atualização',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Só marque quando houve revisão real. Republicar não é atualizar.',
      },
    },
    {
      name: 'tableOfContents',
      type: 'checkbox',
      label: 'Exibir índice',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'needsReview',
      type: 'checkbox',
      label: 'Precisa de revisão',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Marcado, impede a publicação. Usado no conteúdo migrado do WordPress.',
      },
    },
    {
      name: 'legacyUrl',
      type: 'text',
      label: 'URL antiga (WordPress)',
      admin: { position: 'sidebar', description: 'Documenta a migração no próprio conteúdo.' },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
