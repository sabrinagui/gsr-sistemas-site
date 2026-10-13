import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Menu',
  admin: { group: 'Configurações' },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Itens do menu',
      maxRows: 7,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true, admin: { description: 'Caminho interno, sem barra final. Ex.: /sobre' } },
        {
          name: 'subItems',
          type: 'array',
          label: 'Subitens',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
            { name: 'description', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', type: 'text', defaultValue: 'Solicitar orçamento', admin: { width: '50%' } },
        { name: 'ctaHref', type: 'text', defaultValue: '/orcamento', admin: { width: '50%' } },
      ],
    },
  ],
}
