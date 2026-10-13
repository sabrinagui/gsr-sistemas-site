import type { CollectionConfig } from 'payload'

/**
 * Leads.
 *
 * `create` fica fechado na API pública do Payload — o formulário grava por um
 * Server Action próprio, com validação, honeypot e rate limiting. Isso evita
 * que a collection vire endpoint aberto de escrita.
 *
 * Nenhum campo daqui é enviado ao GA4 (technical-seo.md, seção 12).
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  admin: {
    useAsTitle: 'name',
    group: 'Comercial',
    defaultColumns: ['name', 'email', 'projectType', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'company', type: 'text', label: 'Empresa', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
        { name: 'phone', type: 'text', label: 'WhatsApp', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'projectType',
          type: 'select',
          label: 'Tipo de projeto',
          options: [
            { label: 'Site', value: 'site' },
            { label: 'Sistema sob medida', value: 'sistema' },
            { label: 'Landing page', value: 'landing-page' },
            { label: 'Loja virtual', value: 'loja-virtual' },
            { label: 'Automação ou integração', value: 'automacao' },
            { label: 'Outro', value: 'outro' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'budget',
          type: 'select',
          label: 'Orçamento aproximado',
          options: [
            { label: 'Ainda não sei', value: 'indefinido' },
            { label: 'Até R$ 5.000', value: 'ate-5k' },
            { label: 'R$ 5.000 a R$ 15.000', value: '5k-15k' },
            { label: 'R$ 15.000 a R$ 40.000', value: '15k-40k' },
            { label: 'Acima de R$ 40.000', value: 'acima-40k' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'message', type: 'textarea', label: 'Descrição do projeto' },
    {
      type: 'collapsible',
      label: 'Origem',
      admin: { initCollapsed: true },
      fields: [
        { name: 'sourcePage', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'utmSource', type: 'text', admin: { width: '33%' } },
            { name: 'utmMedium', type: 'text', admin: { width: '33%' } },
            { name: 'utmCampaign', type: 'text', admin: { width: '33%' } },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'novo',
      options: [
        { label: 'Novo', value: 'novo' },
        { label: 'Contatado', value: 'contatado' },
        { label: 'Qualificado', value: 'qualificado' },
        { label: 'Convertido', value: 'convertido' },
        { label: 'Descartado', value: 'descartado' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
