import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

/**
 * Tecnologias aparecem em serviços, cases e na home. Sem uma collection, seriam
 * redigitadas em cada lugar, com nome e logo divergindo.
 *
 * Só entra o que a GSR efetivamente usa.
 */
export const Technologies: CollectionConfig = {
  slug: 'technologies',
  labels: { singular: 'Tecnologia', plural: 'Tecnologias' },
  admin: {
    useAsTitle: 'name',
    group: 'Biblioteca',
    defaultColumns: ['name', 'category', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Banco de dados', value: 'banco' },
        { label: 'Infraestrutura', value: 'infra' },
        { label: 'Integração', value: 'integracao' },
        { label: 'E-commerce', value: 'ecommerce' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
