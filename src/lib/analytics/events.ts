/**
 * Eventos de conversão.
 *
 * Duas regras que valem para todo este arquivo:
 *
 *  1. Os eventos de submit disparam APÓS a resposta de sucesso do servidor,
 *     nunca no clique. Clique em botão é intenção, não conversão.
 *  2. Nenhum dado pessoal vai para o GA4 — nome, e-mail, telefone, empresa e
 *     texto da mensagem ficam só na collection Leads, no banco.
 */

export type AnalyticsEvent =
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'budget_form_start'
  | 'budget_form_submit'
  | 'case_study_view'
  | 'service_cta_click'

/** Só estes parâmetros são permitidos. Qualquer outro é descartado. */
type AllowedParams = {
  page_path?: string
  service?: string
  location?: string
  project_type?: string
  source_page?: string
  form_id?: string
}

const ALLOWED_KEYS: (keyof AllowedParams)[] = [
  'page_path',
  'service',
  'location',
  'project_type',
  'source_page',
  'form_id',
]

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * O filtro por allow-list não é excesso de zelo: é o que impede que um refactor
 * futuro passe o objeto inteiro do formulário e vaze dado pessoal para o GA4.
 */
export const trackEvent = (event: AnalyticsEvent, params: AllowedParams = {}): void => {
  if (typeof window === 'undefined') return

  const safeParams: Record<string, string> = {}
  for (const key of ALLOWED_KEYS) {
    const value = params[key]
    if (typeof value === 'string' && value.length > 0) safeParams[key] = value
  }

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...safeParams })
}
