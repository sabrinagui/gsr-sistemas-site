import type { GlobalConfig } from 'payload'

/**
 * Fonte única dos dados institucionais.
 *
 * Dois pontos que vêm direto da FASE 2:
 *  - `whatsapp` é a única origem de número no site. O site atual tem três,
 *    um deles inválido; aqui isso não pode acontecer por construção.
 *  - o grupo `address` fica desligado por padrão. Enquanto `isPhysicalLocation`
 *    for false, o site emite só Organization e não exibe endereço em lugar nenhum.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Dados da empresa',
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
          label: 'Empresa',
          fields: [
            { name: 'companyName', type: 'text', required: true, defaultValue: 'GSR Sistemas' },
            {
              name: 'legalName',
              type: 'text',
              label: 'Razão social',
              admin: { description: 'Pendente de confirmação. Deixe vazio até ter o dado real.' },
            },
            { name: 'cnpj', type: 'text', defaultValue: '45.971.007/0001-99' },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              defaultValue:
                'GSR Sistemas é uma empresa de desenvolvimento de sites, sistemas e soluções digitais sob medida em São Luís, Maranhão, com atendimento para todo o Brasil.',
            },
            {
              name: 'foundingYear',
              type: 'number',
              label: 'Ano de fundação',
              admin: {
                description:
                  'Pendente. Enquanto estiver vazio, o site não faz nenhuma afirmação sobre tempo de mercado.',
              },
            },
            { name: 'domain', type: 'text', defaultValue: 'https://gsrsistemas.com' },
          ],
        },
        {
          label: 'Contato',
          fields: [
            { name: 'email', type: 'email', required: true, defaultValue: 'contato@gsrsistemas.com' },
            {
              name: 'phone',
              type: 'text',
              label: 'Telefone exibido',
              defaultValue: '(98) 98891-5251',
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: 'WhatsApp (E.164)',
              required: true,
              defaultValue: '+5598988915251',
              admin: {
                description:
                  'Fonte única. Todo botão de WhatsApp do site lê daqui. Formato internacional, só dígitos e o +.',
              },
            },
            {
              name: 'whatsappMessage',
              type: 'text',
              defaultValue: 'Olá! Vim pelo site e gostaria de falar sobre um projeto.',
            },
            {
              name: 'socialProfiles',
              type: 'array',
              label: 'Perfis oficiais',
              admin: { description: 'Vão para o sameAs do Organization. Só perfis que existem.' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Localização',
          description:
            'Enquanto "É local de atendimento presencial" estiver desmarcado, nenhum endereço é exibido no site nem emitido em schema. O LocalBusiness fica pronto e inativo.',
          fields: [
            {
              name: 'address',
              type: 'group',
              label: ' ',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', defaultValue: 'São Luís', admin: { width: '50%' } },
                    { name: 'state', type: 'text', defaultValue: 'MA', admin: { width: '25%' } },
                    { name: 'country', type: 'text', defaultValue: 'BR', admin: { width: '25%' } },
                  ],
                },
                {
                  name: 'isPhysicalLocation',
                  type: 'checkbox',
                  label: 'É local de atendimento presencial',
                  defaultValue: false,
                  admin: {
                    description:
                      'Só marque se clientes são realmente atendidos no endereço. Endereço administrativo não deve ser publicado só por SEO.',
                  },
                },
                {
                  name: 'showAddressOnSite',
                  type: 'checkbox',
                  label: 'Exibir endereço no site',
                  defaultValue: false,
                  admin: { condition: (_, sibling) => Boolean(sibling?.isPhysicalLocation) },
                },
                {
                  type: 'row',
                  admin: { condition: (_, sibling) => Boolean(sibling?.isPhysicalLocation) },
                  fields: [
                    { name: 'street', type: 'text', admin: { width: '50%' } },
                    { name: 'number', type: 'text', admin: { width: '20%' } },
                    { name: 'neighborhood', type: 'text', admin: { width: '30%' } },
                  ],
                },
                {
                  type: 'row',
                  admin: { condition: (_, sibling) => Boolean(sibling?.isPhysicalLocation) },
                  fields: [
                    { name: 'postalCode', type: 'text', label: 'CEP', admin: { width: '34%' } },
                    { name: 'latitude', type: 'number', admin: { width: '33%' } },
                    { name: 'longitude', type: 'number', admin: { width: '33%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Marca',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'logoLight', type: 'upload', relationTo: 'media', label: 'Logo para fundo escuro' },
          ],
        },
        {
          label: 'Home',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem do hero',
              admin: {
                description:
                  'Mockup do topo da home. Enquanto estiver vazio, o site usa o mockup desenhado em CSS — o hero nunca fica vazio esperando arte. Proporção recomendada 10:7, fundo escuro ou transparente.',
              },
            },
          ],
        },
        {
          label: 'Exibição',
          fields: [
            {
              name: 'display',
              type: 'group',
              label: ' ',
              fields: [
                {
                  name: 'showPortfolioInNav',
                  type: 'checkbox',
                  label: 'Exibir Portfólio no menu',
                  defaultValue: false,
                  admin: {
                    description:
                      'Decisão editorial sua. A partir de 2 cases bons já faz sentido; 3 ou mais é o ideal. Cada case publicado já tem página própria de qualquer forma.',
                  },
                },
                { name: 'showTestimonials', type: 'checkbox', label: 'Exibir depoimentos', defaultValue: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
