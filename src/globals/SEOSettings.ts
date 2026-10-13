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
            {
              name: 'ga4MeasurementId',
              type: 'text',
              label: 'GA4',
              defaultValue: 'G-FVHZ0NLLXC',
              admin: { description: 'Propriedade do GA4 usada no site antigo (carregada direto, não pelo Tag Manager).' },
            },
            {
              name: 'googleTagId',
              type: 'text',
              label: 'Tag do Google (Site Kit)',
              defaultValue: 'GT-TNPWVZW4',
              admin: { description: 'Tag criada pelo Site Kit no WordPress. Envia dados para a propriedade G-1G7G5PVN22.' },
            },
            {
              name: 'googleAdsId',
              type: 'text',
              label: 'Google Ads',
              defaultValue: 'AW-16761105005',
              admin: { description: 'Conta do Google Ads. Sem isto, as conversões dos anúncios param de ser medidas.' },
            },
            {
              name: 'gtmContainerId',
              type: 'text',
              label: 'Google Tag Manager',
              defaultValue: 'GTM-539GQMP8',
              admin: { description: 'Contêiner com a conversão do Google Ads e o vinculador de conversões.' },
            },
            { name: 'clarityProjectId', type: 'text', label: 'Microsoft Clarity' },
          ],
        },
      ],
    },
  ],
}
