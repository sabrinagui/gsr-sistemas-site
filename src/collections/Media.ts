import type { CollectionConfig } from 'payload'
import path from 'node:path'

/**
 * As 62 mídias do site atual estão sem alt — todas. Aqui o alt é obrigatório,
 * com uma única exceção: imagem marcada como decorativa, que renderiza alt=""
 * por decisão explícita e nunca por esquecimento.
 *
 * Nada de alt gerado a partir de filename ou keyword (content-plan.md, seção 7).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Mídia', plural: 'Mídia' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Biblioteca',
    defaultColumns: ['filename', 'alt', 'isDecorative', 'updatedAt'],
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, withoutEnlargement: true },
      { name: 'card', width: 800, withoutEnlargement: true },
      { name: 'hero', width: 1600, withoutEnlargement: true },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
  },
  fields: [
    {
      name: 'isDecorative',
      type: 'checkbox',
      label: 'Imagem decorativa',
      defaultValue: false,
      admin: {
        description:
          'Marque quando a imagem não acrescenta informação. Ela será renderizada com alt="" — que é o correto para leitores de tela.',
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      admin: {
        condition: (_, siblingData) => !siblingData?.isDecorative,
        description:
          'Descreva o que a imagem mostra e o que importa nela. Não é lugar de keyword.',
      },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: any }) => {
        if (siblingData?.isDecorative) return true
        if (!value || value.trim().length === 0) {
          return 'Descreva a imagem, ou marque "Imagem decorativa".'
        }
        return true
      },
    },
    { name: 'caption', type: 'text', label: 'Legenda' },
    { name: 'credit', type: 'text', label: 'Crédito' },
  ],
}
