import type { CollectionConfig } from 'payload'

import { ctaField } from '@/fields/cta'
import { heroField } from '@/fields/hero'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/**
 * Estrutura fixa, de propósito. O editor preenche conteúdo, não monta layout —
 * é o que mantém as páginas de serviço consistentes entre si.
 *
 * O campo `parent` permite os subserviços diferidos (/desenvolvimento-de-sistemas/mvp)
 * sem alterar o schema depois.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Serviço', plural: 'Serviços' },
  admin: {
    useAsTitle: 'title',
    group: 'Conteúdo',
    defaultColumns: ['title', 'slug', 'parent', 'showInNav', '_status'],
    livePreview: {
      url: ({ data }) => `/preview?collection=services&slug=${data?.slug}`,
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
    afterChange: [
      revalidateAfterChange({
        path: (doc) => (doc?.slug ? `/${doc.slug}` : null),
        listings: ['/servicos', '/'],
        tags: ['services'],
      }),
    ],
    afterDelete: [
      revalidateAfterDelete({
        path: (doc) => (doc?.slug ? `/${doc.slug}` : null),
        listings: ['/servicos'],
        tags: ['services'],
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
            {
              name: 'shortTitle',
              type: 'text',
              required: true,
              label: 'Título curto',
              admin: { description: 'Usado em menu, cards e breadcrumb. Ex.: "Criação de Sites".' },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: { description: 'Resumo curto. Vira o texto do card e o fallback da meta description.' },
            },
            heroField,
            {
              name: 'content',
              type: 'richText',
              label: 'Conteúdo principal',
              admin: { description: 'Onde mora a substância da página. H2 e H3 seguem o argumento, não o tamanho da fonte.' },
            },
            {
              name: 'benefits',
              type: 'array',
              label: 'Benefícios',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'features',
              type: 'array',
              label: 'O que está incluso',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'process',
              type: 'array',
              label: 'Processo',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
            ctaField,
          ],
        },
        {
          label: 'Relacionamentos',
          description: 'Nenhuma página deve depender só do menu para receber link.',
          fields: [
            { name: 'technologies', type: 'relationship', relationTo: 'technologies', hasMany: true },
            { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true },
            { name: 'relatedCases', type: 'relationship', relationTo: 'case-studies', hasMany: true },
            { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true },
            { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
            {
              name: 'emitFaqSchema',
              type: 'checkbox',
              label: 'Emitir FAQPage em JSON-LD',
              defaultValue: false,
              admin: {
                description:
                  'Opcional. O FAQ aparece na página de qualquer forma. O rich result de FAQ hoje está restrito a governo e saúde — marque só se houver motivo.',
              },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    slugField(),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'services',
      label: 'Serviço pai',
      admin: {
        position: 'sidebar',
        description: 'Só em subserviço. Define a URL /pai/filho.',
      },
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    {
      name: 'showInNav',
      type: 'checkbox',
      label: 'Exibir no menu',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}
