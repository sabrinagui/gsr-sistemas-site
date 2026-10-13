import type { EmailAdapter } from 'payload'

// Payload's development fallback prints entire emails, including reset links.
// Production must fail without revealing their contents when no provider is set.
export const disabledEmailAdapter: EmailAdapter = () => ({
  name: 'disabled-production-email',
  defaultFromAddress: 'nao-responda@gsrsistemas.com',
  defaultFromName: 'GSR Sistemas',
  sendEmail: async () => {
    throw new Error('Envio de email indisponível: configure RESEND_API_KEY no servidor.')
  },
})
