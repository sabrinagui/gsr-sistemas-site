import type { Field } from 'payload'

/**
 * Grupo de SEO reutilizado por toda collection com página pública.
 *
 * Nenhum campo é obrigatório. A cadeia de fallback em src/lib/seo/metadata.ts
 * resolve o que estiver vazio; estes campos existem para o override manual.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description:
      'Tudo aqui é opcional. Campo vazio é preenchido automaticamente a partir do conteúdo da página.',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Busca',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Título (meta title)',
          admin: {
            components: {
              Field: '@/components/admin/CharCountField#MetaTitleField',
            },
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Descrição (meta description)',
          admin: {
            components: {
              Field: '@/components/admin/CharCountField#MetaDescriptionField',
            },
          },
        },
        {
          name: 'canonicalUrl',
          type: 'text',
          label: 'URL canônica',
          admin: {
            description:
              'Deixe vazio. Só preencha quando esta página for uma cópia deliberada de outra.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'index',
              type: 'checkbox',
              label: 'Permitir indexação',
              defaultValue: true,
              admin: { width: '50%' },
            },
            {
              name: 'follow',
              type: 'checkbox',
              label: 'Seguir links',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Compartilhamento (Open Graph e Twitter)',
      admin: { initCollapsed: true },
      fields: [
        { name: 'ogTitle', type: 'text', label: 'Título' },
        { name: 'ogDescription', type: 'textarea', label: 'Descrição' },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagem (1200x630)',
        },
        { name: 'twitterTitle', type: 'text', label: 'Título no Twitter/X' },
        { name: 'twitterDescription', type: 'textarea', label: 'Descrição no Twitter/X' },
        { name: 'twitterImage', type: 'upload', relationTo: 'media', label: 'Imagem no Twitter/X' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Referência editorial',
      admin: {
        initCollapsed: true,
        description: 'Só para orientar quem escreve. Nada daqui vai para o HTML.',
      },
      fields: [
        {
          name: 'focusKeyword',
          type: 'text',
          label: 'Keyword principal',
          admin: {
            description:
              'Uma página, uma intenção. Antes de preencher, confira se outra página já tem esta keyword.',
          },
        },
        {
          name: 'secondaryKeywords',
          type: 'text',
          hasMany: true,
          label: 'Keywords secundárias',
          admin: { description: 'Variações da mesma intenção, não intenções diferentes.' },
        },
      ],
    },
  ],
}
