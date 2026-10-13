/**
 * Fonte única do link de WhatsApp.
 *
 * O site atual tem três números diferentes na home, um deles inválido
 * (558998991228060, com dígitos a mais — o link está quebrado hoje). Aqui o
 * número vem sempre do SiteSettings e passa por esta função, então não existe
 * caminho no código que produza um link divergente.
 */
export const whatsappLink = (whatsapp: string, message?: string | null): string => {
  const digits = whatsapp.replace(/\D/g, '')
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${text}`
}

/** Formata E.164 brasileiro para exibição: +5598988915251 -> (98) 98891-5251 */
export const formatBrazilianPhone = (whatsapp: string): string => {
  const digits = whatsapp.replace(/\D/g, '').replace(/^55/, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return whatsapp
}

export const telLink = (phone: string): string => `tel:+${phone.replace(/\D/g, '')}`

/** Perfil da GSR no Google. Atualize quando o número de avaliações mudar. */
export const GOOGLE_REVIEWS = {
  rating: '5,0',
  count: 5,
  url: 'https://www.google.com/search?q=GSR+Sistemas',
}
