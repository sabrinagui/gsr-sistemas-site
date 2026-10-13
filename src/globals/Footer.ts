import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Rodapé',
  admin: { group: 'Configurações' },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Criação de sites e desenvolvimento de sistemas sob medida. São Luís, Maranhão — atendimento em todo o Brasil.',
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Colunas',
      maxRows: 4,
      admin: { description: 'Rodapé útil, não uma lista de 100 keywords.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'showCnpj', type: 'checkbox', label: 'Exibir CNPJ', defaultValue: true },
    { name: 'copyrightText', type: 'text', defaultValue: 'GSR Sistemas. Todos os direitos reservados.' },
  ],
}
