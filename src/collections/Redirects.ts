import type { CollectionConfig } from 'payload'

import { invalidateRedirectCache } from '@/lib/redirects/cache'

/**
 * Camada 3 do sistema de redirects: o que você cria pelo painel depois do
 * lançamento. O mapa de migração vive na camada 2 (next.config.ts).
 *
 * `hits` responde a uma pergunta prática: depois de um ano, quais redirects
 * ainda importam.
 */
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Redirect', plural: 'Redirects' },
  admin: {
    useAsTitle: 'from',
    group: 'Configurações',
    defaultColumns: ['from', 'to', 'type', 'active', 'hits'],
    description: 'Antes de mudar o slug de uma página publicada, registre o redirect aqui.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [() => { invalidateRedirectCache() }],
    afterDelete: [() => { invalidateRedirectCache() }],
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'De',
      admin: { description: 'Caminho com barra inicial, sem domínio e sem barra final. Ex.: /pagina-antiga' },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value !== 'string') return value
            let path = value.trim()
            if (!path.startsWith('/')) path = `/${path}`
            if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
            return path.toLowerCase()
          },
        ],
      },
    },
    {
      name: 'to',
      type: 'text',
      label: 'Para',
      admin: {
        condition: (data) => data?.type !== '410',
        description: 'Destino final, que responde 200. Nunca aponte para outro redirect.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: '301',
      options: [
        { label: '301 — permanente', value: '301' },
        { label: '302 — temporário', value: '302' },
        { label: '410 — removido de propósito', value: '410' },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'notes', type: 'textarea', label: 'Observações' },
    { name: 'hits', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    { name: 'lastHitAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
  ],
}
