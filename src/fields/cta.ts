import type { Field } from 'payload'

export const ctaField: Field = {
  name: 'cta',
  type: 'group',
  label: 'Chamada final',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Solicitar orçamento' },
    { name: 'buttonHref', type: 'text', defaultValue: '/orcamento' },
  ],
}
