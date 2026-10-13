import type { Block } from 'payload'

/**
 * Blocos usados APENAS em Pages.
 *
 * Serviços, locais, cases e posts têm estrutura fixa. É o que impede layout
 * caótico sem tirar flexibilidade de quem escreve.
 */

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Topo', plural: 'Topos' },
  fields: [
    { name: 'headline', type: 'text', required: true, label: 'H1' },
    { name: 'subheadline', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'primaryCtaLabel', type: 'text', admin: { width: '50%' } },
        { name: 'primaryCtaHref', type: 'text', admin: { width: '50%' } },
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

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Texto', plural: 'Textos' },
  fields: [{ name: 'content', type: 'richText', required: true }],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: 'Imagem e texto', plural: 'Imagem e texto' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'content', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Direita', value: 'right' },
      ],
    },
  ],
}

export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  labels: { singular: 'Grade de serviços', plural: 'Grades de serviços' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Vazio, usa todos os serviços marcados para o menu.' },
    },
  ],
}

export const CaseStudiesBlock: Block = {
  slug: 'caseStudies',
  labels: { singular: 'Cases', plural: 'Cases' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'cases', type: 'relationship', relationTo: 'case-studies', hasMany: true },
    { name: 'limit', type: 'number', defaultValue: 3 },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Depoimentos', plural: 'Depoimentos' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { description: 'Só depoimentos autorizados são exibidos, mesmo que outros sejam selecionados.' },
    },
  ],
}

/**
 * Sem valor padrão e sem placeholder. Bloco sem entradas não renderiza —
 * não existe caminho no painel que produza métrica inventada por inércia.
 */
export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Números', plural: 'Números' },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Números',
      admin: {
        description:
          'Só números reais e confirmados. Enquanto estiver vazio, a seção não aparece no site.',
      },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const BenefitsBlock: Block = {
  slug: 'benefits',
  labels: { singular: 'Benefícios', plural: 'Benefícios' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export const ProcessBlock: Block = {
  slug: 'process',
  labels: { singular: 'Processo', plural: 'Processos' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export const TechnologyGridBlock: Block = {
  slug: 'technologyGrid',
  labels: { singular: 'Tecnologias', plural: 'Tecnologias' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'technologies', type: 'relationship', relationTo: 'technologies', hasMany: true },
  ],
}

export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Perguntas frequentes' },
    { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true },
    { name: 'emitSchema', type: 'checkbox', label: 'Emitir FAQPage em JSON-LD', defaultValue: false },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'Chamada', plural: 'Chamadas' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Solicitar orçamento' },
    { name: 'buttonHref', type: 'text', defaultValue: '/orcamento' },
    { name: 'showWhatsapp', type: 'checkbox', defaultValue: true },
  ],
}

export const RelatedPostsBlock: Block = {
  slug: 'relatedPosts',
  labels: { singular: 'Artigos', plural: 'Artigos' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Conteúdo recente' },
    { name: 'posts', type: 'relationship', relationTo: 'posts', hasMany: true },
    { name: 'limit', type: 'number', defaultValue: 3 },
  ],
}

export const LocalSEOBlock: Block = {
  slug: 'localSeo',
  labels: { singular: 'Bloco local', plural: 'Blocos locais' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Desenvolvimento web em São Luís, Maranhão' },
    { name: 'content', type: 'richText' },
    { name: 'location', type: 'relationship', relationTo: 'locations' },
    { name: 'linkLabel', type: 'text', defaultValue: 'Conheça nosso atendimento em São Luís' },
  ],
}

export const LogoCloudBlock: Block = {
  slug: 'logoCloud',
  labels: { singular: 'Logos', plural: 'Logos' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'logos',
      type: 'array',
      admin: { description: 'Logo de cliente só entra com autorização.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'approved', type: 'checkbox', label: 'Autorizado pelo cliente', defaultValue: false },
      ],
    },
  ],
}

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: { singular: 'Formulário', plural: 'Formulários' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'formType',
      type: 'select',
      defaultValue: 'budget',
      options: [
        { label: 'Orçamento', value: 'budget' },
        { label: 'Contato', value: 'contact' },
      ],
    },
  ],
}

export const pageBlocks = [
  HeroBlock,
  RichTextBlock,
  ImageTextBlock,
  ServicesGridBlock,
  CaseStudiesBlock,
  TestimonialsBlock,
  StatsBlock,
  BenefitsBlock,
  ProcessBlock,
  TechnologyGridBlock,
  FAQBlock,
  CTABlock,
  RelatedPostsBlock,
  LocalSEOBlock,
  LogoCloudBlock,
  ContactFormBlock,
]
