import type { CollectionConfig } from 'payload'

import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/**
 * Cases.
 *
 * Duas garantias contra conteúdo inventado:
 *  - `clientApproved` bloqueia a publicação sem autorização do cliente;
 *  - `results` é array vazio e o painel não sugere nada. Case sem número publica
 *    normalmente — melhor sem métrica do que com métrica inventada.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case', plural: 'Cases' },
  admin: {
    useAsTitle: 'title',
    group: 'Conteúdo',
    defaultColumns: ['title', 'client', 'projectType', 'clientApproved', '_status'],
    livePreview: {
      url: ({ data }) => `/preview?collection=case-studies&slug=${data?.slug}`,
    },
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        const status = data?._status ?? originalDoc?._status
        const approved = data?.clientApproved ?? originalDoc?.clientApproved
        if (status === 'published' && !approved) {
          throw new Error(
            'Este case não pode ser publicado sem a autorização do cliente. Marque "Autorizado pelo cliente" na barra lateral.',
          )
        }
        return data
      },
    ],
    afterChange: [
      revalidateAfterChange({
        path: (doc) => (doc?.slug ? `/portfolio/${doc.slug}` : null),
        listings: ['/portfolio', '/'],
        tags: ['cases'],
      }),
    ],
    afterDelete: [
      revalidateAfterDelete({
        path: (doc) => (doc?.slug ? `/portfolio/${doc.slug}` : null),
        listings: ['/portfolio'],
        tags: ['cases'],
      }),
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Projeto',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Nome do projeto (H1)' },
            {
              type: 'row',
              fields: [
                { name: 'client', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'industry', type: 'text', label: 'Segmento', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'projectType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Site', value: 'site' },
                    { label: 'Sistema', value: 'sistema' },
                    { label: 'Landing page', value: 'landing-page' },
                    { label: 'Loja virtual', value: 'loja-virtual' },
                    { label: 'Automação', value: 'automacao' },
                    { label: 'Aplicativo', value: 'app' },
                  ],
                  admin: { width: '50%' },
                },
                { name: 'year', type: 'number', admin: { width: '25%' } },
                { name: 'websiteUrl', type: 'text', label: 'Site', admin: { width: '25%' } },
              ],
            },
            { name: 'summary', type: 'textarea', required: true, label: 'Resumo' },
            { name: 'challenge', type: 'richText', label: 'Desafio' },
            { name: 'solution', type: 'richText', label: 'Solução' },
            {
              name: 'features',
              type: 'array',
              label: 'O que foi construído',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'results',
              type: 'array',
              label: 'Resultados',
              admin: {
                description:
                  'Opcional e sem sugestão. Só entre com número que o cliente confirmou. Case sem métrica publica normalmente.',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Imagens',
          fields: [
            { name: 'featuredImage', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Relacionamentos',
          fields: [
            { name: 'technologies', type: 'relationship', relationTo: 'technologies', hasMany: true },
            { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
            { name: 'testimonial', type: 'relationship', relationTo: 'testimonials' },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    slugField(),
    {
      name: 'clientApproved',
      type: 'checkbox',
      label: 'Autorizado pelo cliente',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Obrigatório para publicar. Nome de cliente só vai ao ar com autorização.',
      },
    },
    { name: 'featured', type: 'checkbox', label: 'Destaque', admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}
