import type { Field } from 'payload'

export const heroField: Field = {
  name: 'hero',
  type: 'group',
  label: 'Topo da página',
  fields: [
    {
      name: 'headline',
      type: 'text',
      label: 'H1',
      admin: { description: 'É o H1 da página. Um por página, sempre.' },
    },
    { name: 'subheadline', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Imagem de LCP. Precisa ser leve — ver technical-seo.md, seção 9.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Solicitar orçamento', admin: { width: '50%' } },
        { name: 'primaryCtaHref', type: 'text', defaultValue: '/orcamento', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'secondaryCtaLabel', type: 'text', admin: { width: '50%' } },
        { name: 'secondaryCtaHref', type: 'text', admin: { width: '50%' } },
      ],
    },
  ],
}
