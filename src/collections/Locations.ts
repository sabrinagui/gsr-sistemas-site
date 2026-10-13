import type { CollectionConfig } from 'payload'

import { ctaField } from '@/fields/cta'
import { heroField } from '@/fields/hero'
import { seoField } from '@/fields/seo'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/** Referência para o aviso de conteúdo curto. Não bloqueia nada. */
const SHORT_CONTENT_HINT = 600

const localPath = (doc: any): string | null => {
  if (!doc?.locationSlug) return null
  const service = typeof doc.service === 'object' ? doc.service?.slug : null
  return service ? `/${doc.locationSlug}/${service}` : `/${doc.locationSlug}`
}

/**
 * Páginas locais.
 *
 * Decisão da FASE 2 (revisada): não há trava de tamanho mínimo. O controle é
 * editorial — aviso de conteúdo curto, checklist de publicação e ausência de
 * qualquer mecanismo de criação em massa. Uma trava numérica seria contornável
 * escrevendo texto ruim mais longo, o que é pior do que texto curto e honesto.
 */
export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'Localização', plural: 'Localizações' },
  admin: {
    useAsTitle: 'title',
    group: 'Conteúdo',
    defaultColumns: ['title', 'city', 'service', '_status'],
    livePreview: {
      url: ({ data }) => `/preview?collection=locations&slug=${data?.slug}`,
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
    afterChange: [revalidateAfterChange({ path: localPath, listings: ['/'] })],
    afterDelete: [revalidateAfterDelete({ path: localPath })],
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
              type: 'row',
              fields: [
                { name: 'city', type: 'text', required: true, defaultValue: 'São Luís', admin: { width: '40%' } },
                { name: 'state', type: 'text', required: true, defaultValue: 'Maranhão', admin: { width: '40%' } },
                { name: 'stateCode', type: 'text', required: true, defaultValue: 'MA', admin: { width: '20%' } },
              ],
            },
            { name: 'description', type: 'textarea', required: true },
            heroField,
            {
              name: 'localContent',
              type: 'richText',
              required: true,
              label: 'Conteúdo local',
              admin: {
                description:
                  'Escrito para este mercado. Não é a página nacional com a cidade trocada — se for, uma das duas não deveria existir.',
              },
            },
            {
              name: 'serviceAreas',
              type: 'array',
              label: 'Áreas atendidas',
              fields: [{ name: 'name', type: 'text', required: true }],
            },
            ctaField,
          ],
        },
        {
          label: 'Relacionamentos',
          fields: [
            { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
            { name: 'relatedCases', type: 'relationship', relationTo: 'case-studies', hasMany: true },
            { name: 'testimonials', type: 'relationship', relationTo: 'testimonials', hasMany: true },
            { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true },
            { name: 'emitFaqSchema', type: 'checkbox', label: 'Emitir FAQPage em JSON-LD', defaultValue: false },
          ],
        },
        {
          label: 'Checklist de publicação',
          description:
            'Confirmações editoriais. Não bloqueiam a publicação — existem para que a decisão seja consciente.',
          fields: [
            {
              name: 'checklist',
              type: 'group',
              label: ' ',
              fields: [
                { name: 'writtenForThisMarket', type: 'checkbox', label: 'O conteúdo foi escrito para este mercado' },
                { name: 'notRewriteOfNational', type: 'checkbox', label: 'Não é reescrita da página nacional' },
                { name: 'hasRealLocalInfo', type: 'checkbox', label: 'Traz informação local real' },
                { name: 'reviewed', type: 'checkbox', label: 'Foi revisado' },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug do serviço',
      admin: {
        position: 'sidebar',
        description: 'No hub, repita o slug da localização. Ex.: "criacao-de-sites".',
      },
    },
    {
      name: 'locationSlug',
      type: 'text',
      required: true,
      defaultValue: 'sao-luis-ma',
      label: 'Slug da localização',
      admin: { position: 'sidebar', description: 'Primeiro segmento da URL. Ex.: "sao-luis-ma".' },
    },
    {
      name: 'isHub',
      type: 'checkbox',
      label: 'É a página hub da cidade',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Marcado, renderiza /sao-luis-ma.' },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Serviço',
      admin: {
        position: 'sidebar',
        condition: (data) => !data?.isHub,
        description: 'Serviço nacional correspondente a esta página local.',
      },
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}

export { SHORT_CONTENT_HINT }
