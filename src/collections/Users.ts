import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  auth: true,
  admin: {
    useAsTitle: 'name',
    group: 'Configurações',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req, id }) => req.user?.role === 'admin' || req.user?.id === id,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
    {
      type: 'collapsible',
      label: 'Bloco de autor',
      admin: {
        initCollapsed: true,
        description: 'Aparece no rodapé dos artigos. Só informação real — nada de especialista inventado.',
      },
      fields: [
        { name: 'jobTitle', type: 'text', label: 'Função' },
        { name: 'bio', type: 'textarea', label: 'Biografia' },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
        {
          type: 'row',
          fields: [
            { name: 'linkedin', type: 'text', admin: { width: '50%' } },
            { name: 'github', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
}
