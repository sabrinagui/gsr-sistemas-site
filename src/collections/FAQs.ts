import type { CollectionConfig } from 'payload'

/** Uma pergunta, um registro, reutilizável em várias páginas. */
export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Pergunta frequente', plural: 'Perguntas frequentes' },
  admin: {
    useAsTitle: 'question',
    group: 'Conteúdo',
    defaultColumns: ['question', 'relatedService', 'relatedLocation', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    {
      type: 'row',
      fields: [
        { name: 'relatedService', type: 'relationship', relationTo: 'services', admin: { width: '50%' } },
        { name: 'relatedLocation', type: 'relationship', relationTo: 'locations', admin: { width: '50%' } },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
