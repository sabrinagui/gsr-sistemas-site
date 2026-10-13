import type { GlobalConfig } from 'payload'

export const SEOSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: 'SEO e Analytics',
  admin: { group: 'Configurações' },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Padrões',
          fields: [
            {
              name: 'defaultTitle',
              type: 'text',
              defaultValue: 'GSR Sistemas — Sites e Sistemas Sob Medida em São Luís, MA',
            },
            {
              name: 'titleTemplate',
              type: 'text',
              defaultValue: '%s | GSR Sistemas',
              admin: { description: 'O %s é substituído pelo título da página.' },
            },
            {
              name: 'defaultDescription',
              type: 'textarea',
              defaultValue:
                'Desenvolvimento de sites, sistemas e soluções digitais sob medida em São Luís, Maranhão, com atendimento para todo o Brasil.',
            },
            { name: 'defaultOGImage', type: 'upload', relationTo: 'media', label: 'Imagem padrão de compartilhamento' },
          ],
        },
        {
          label: 'Verificação',
          fields: [
            { name: 'googleSiteVerification', type: 'text', label: 'Google Search Console' },
          ],
        },
        {
          label: 'Analytics',
          description: 'IDs existentes preservados — trocar de propriedade perderia o histórico.',
          fields: [
            {
              name: 'enableAnalytics',
              type: 'checkbox',
              label: 'Ativar analytics',
              defaultValue: true,
              admin: { description: 'Desligado automaticamente fora de produção.' },
            },
            { name: 'ga4MeasurementId', type: 'text', label: 'GA4', defaultValue: 'G-FVHZ0NLLXC' },
            { name: 'gtmContainerId', type: 'text', label: 'Google Tag Manager', defaultValue: 'GTM-539GQMP8' },
            { name: 'clarityProjectId', type: 'text', label: 'Microsoft Clarity' },
          ],
        },
      ],
    },
  ],
}
