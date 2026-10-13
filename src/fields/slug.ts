import type { Field } from 'payload'

/** Normaliza acento, cedilha, espaço e caixa. Slugs do projeto são ASCII, minúsculos, com hífen. */
export const slugify = (input: string): string =>
  input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  label: 'Slug (URL)',
  admin: {
    position: 'sidebar',
    description: 'Gerado a partir do título. Uma vez publicado, mudar exige registrar um redirect.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const source = data?.[sourceField]
        if (typeof source === 'string' && source.length > 0) return slugify(source)
        return value
      },
    ],
  },
})
