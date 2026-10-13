import type { CollectionConfig } from 'payload'

/**
 * Depoimentos reais. Exibidos com nome, texto, fonte e data.
 *
 * Decisão da FASE 2: `rating` fica armazenado e NÃO gera AggregateRating nem
 * Review no schema (technical-seo.md, 7.3). É prova social visível, não markup.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Depoimento', plural: 'Depoimentos' },
  admin: {
    useAsTitle: 'name',
    group: 'Conteúdo',
    defaultColumns: ['name', 'company', 'source', 'approvedForWebsite'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'company', type: 'text', admin: { width: '50%' } },
        { name: 'role', type: 'text', label: 'Cargo', admin: { width: '50%' } },
      ],
    },
    { name: 'testimonial', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'rating', type: 'number', min: 1, max: 5, admin: { width: '33%' } },
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'Google', value: 'google' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'E-mail', value: 'email' },
            { label: 'Presencial', value: 'presencial' },
          ],
          admin: { width: '33%' },
        },
        { name: 'date', type: 'date', admin: { width: '33%' } },
      ],
    },
    { name: 'sourceUrl', type: 'text', label: 'Link para a avaliação original' },
    { name: 'project', type: 'relationship', relationTo: 'case-studies' },
    {
      name: 'approvedForWebsite',
      type: 'checkbox',
      label: 'Autorizado para o site',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Sem esta marcação, o depoimento não é exibido em lugar nenhum.',
      },
    },
    { name: 'featured', type: 'checkbox', label: 'Destaque na home', admin: { position: 'sidebar' } },
  ],
}
