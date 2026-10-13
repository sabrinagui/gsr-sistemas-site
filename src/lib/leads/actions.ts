'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload/client'

/**
 * Grava o lead vindo de /orcamento/ ou /contato/.
 *
 * A collection Leads não aceita escrita pela API pública; o único caminho é
 * este Server Action, que valida, descarta robôs (campo isca) e limita envios
 * por IP. Depois de gravar, avisa por e-mail quando houver adaptador (Resend).
 */

export type LeadState = { status: 'idle' | 'ok' | 'error'; message?: string; fields?: Record<string, string> }

const PROJECT_TYPES = ['site', 'sistema', 'landing-page', 'loja-virtual', 'automacao', 'outro']
const BUDGETS = ['indefinido', 'ate-5k', '5k-15k', '15k-40k', 'acima-40k']

// Limite simples em memória: 5 envios por IP a cada 10 minutos.
const WINDOW_MS = 10 * 60 * 1000
const hits = new Map<string, number[]>()
const rateLimited = (ip: string) => {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

const str = (data: FormData, key: string, max = 200) => String(data.get(key) ?? '').trim().slice(0, max)

export async function submitLead(_prev: LeadState, data: FormData): Promise<LeadState> {
  const fields = {
    name: str(data, 'name', 120),
    email: str(data, 'email', 160),
    phone: str(data, 'phone', 40),
    company: str(data, 'company', 120),
    projectType: str(data, 'projectType', 40),
    budget: str(data, 'budget', 40),
    message: str(data, 'message', 4000),
  }

  // Campo isca: invisível para pessoas, preenchido por robôs.
  if (str(data, 'website')) return { status: 'ok' }

  if (fields.name.length < 2) return { status: 'error', message: 'Informe seu nome.', fields }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    return { status: 'error', message: 'Informe um e-mail válido para receber a proposta.', fields }
  if (fields.phone && fields.phone.replace(/\D/g, '').length < 10)
    return { status: 'error', message: 'Confira o WhatsApp: use DDD e número.', fields }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local'
  if (rateLimited(ip))
    return { status: 'error', message: 'Muitos envios seguidos. Tente de novo em alguns minutos ou fale no WhatsApp.', fields }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        name: fields.name,
        email: fields.email,
        phone: fields.phone || undefined,
        company: fields.company || undefined,
        projectType: (PROJECT_TYPES.includes(fields.projectType) ? fields.projectType : 'outro') as never,
        budget: (BUDGETS.includes(fields.budget) ? fields.budget : undefined) as never,
        message: fields.message || undefined,
        sourcePage: str(data, 'sourcePage', 200) || undefined,
        utmSource: str(data, 'utm_source', 100) || undefined,
        utmMedium: str(data, 'utm_medium', 100) || undefined,
        utmCampaign: str(data, 'utm_campaign', 100) || undefined,
      },
    })

    const to = process.env.LEAD_NOTIFICATION_EMAIL
    if (to && process.env.RESEND_API_KEY) {
      await payload
        .sendEmail({
          to,
          subject: `Novo pedido de orçamento: ${fields.name}`,
          text: [
            `Nome: ${fields.name}`,
            `E-mail: ${fields.email}`,
            `WhatsApp: ${fields.phone || '-'}`,
            `Empresa: ${fields.company || '-'}`,
            `Projeto: ${fields.projectType || '-'}`,
            `Orçamento: ${fields.budget || '-'}`,
            '',
            fields.message,
          ].join('\n'),
        })
        .catch(() => undefined) // o lead já está salvo; e-mail é aviso, não requisito
    }

    return { status: 'ok' }
  } catch {
    return {
      status: 'error',
      message: 'Não conseguimos enviar agora. Fale com a gente pelo WhatsApp, respondemos rápido.',
      fields,
    }
  }
}
