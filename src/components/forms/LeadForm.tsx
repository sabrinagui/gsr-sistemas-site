'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'

import { trackEvent } from '@/lib/analytics/events'
import { submitLead, type LeadState } from '@/lib/leads/actions'

const PROJECTS = [
  { value: 'site', label: 'Site' },
  { value: 'loja-virtual', label: 'Loja virtual' },
  { value: 'sistema', label: 'Sistema' },
  { value: 'landing-page', label: 'Landing page' },
  { value: 'automacao', label: 'Automação' },
  { value: 'outro', label: 'Outro' },
]

const BUDGETS = [
  { value: 'indefinido', label: 'Ainda não sei' },
  { value: 'ate-5k', label: 'Até R$ 5 mil' },
  { value: '5k-15k', label: 'R$ 5 a 15 mil' },
  { value: '15k-40k', label: 'R$ 15 a 40 mil' },
  { value: 'acima-40k', label: 'Acima de R$ 40 mil' },
]

const initial: LeadState = { status: 'idle' }

/**
 * Formulário de orçamento e de contato. Grava no CMS (Server Action) e só
 * dispara o evento de conversão depois da resposta de sucesso.
 */
export const LeadForm = ({ formId, withBudget = true }: { formId: 'orcamento' | 'contato'; withBudget?: boolean }) => {
  const [state, action, pending] = useActionState(submitLead, initial)
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const started = useRef(false)

  useEffect(() => {
    if (state.status !== 'ok') return
    trackEvent(formId === 'orcamento' ? 'budget_form_submit' : 'contact_form_submit', { form_id: formId })
    router.push('/obrigado/')
  }, [state.status, formId, router])

  const onFocus = () => {
    if (started.current) return
    started.current = true
    trackEvent(formId === 'orcamento' ? 'budget_form_start' : 'contact_form_start', { form_id: formId })
  }

  const v = state.fields ?? {}
  const field =
    'w-full rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-ink-950 placeholder:text-ink-400 transition-colors focus:border-accent-600 focus:outline-none'
  const label = 'text-[0.9rem] font-medium text-ink-700'

  return (
    <form action={action} onFocus={onFocus} className="grid gap-6 rounded-3xl border border-ink-200 bg-white p-6 md:p-10">
      <input type="hidden" name="sourcePage" value={pathname} />
      {['utm_source', 'utm_medium', 'utm_campaign'].map((k) => (
        <input key={k} type="hidden" name={k} value={params.get(k) ?? ''} />
      ))}
      {/* Isca para robôs: fora da tela e fora da ordem de tabulação. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Site <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={`${formId}-name`} className={label}>Seu nome *</label>
          <input id={`${formId}-name`} name="name" required autoComplete="name" defaultValue={v.name} className={field} />
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${formId}-company`} className={label}>Empresa</label>
          <input id={`${formId}-company`} name="company" autoComplete="organization" defaultValue={v.company} className={field} />
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${formId}-email`} className={label}>E-mail *</label>
          <input id={`${formId}-email`} name="email" type="email" required autoComplete="email" defaultValue={v.email} className={field} />
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${formId}-phone`} className={label}>WhatsApp</label>
          <input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" defaultValue={v.phone} className={field} />
        </div>
      </div>

      <fieldset className="grid gap-3">
        <legend className={`${label} mb-3`}>O que você precisa?</legend>
        <div className="flex flex-wrap gap-2">
          {PROJECTS.map((p, i) => (
            <label key={p.value} className="cursor-pointer">
              <input
                type="radio"
                name="projectType"
                value={p.value}
                defaultChecked={v.projectType ? v.projectType === p.value : i === 0}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-ink-200 px-4 py-2.5 text-[0.92rem] text-ink-700 transition-colors peer-checked:border-ink-950 peer-checked:bg-ink-950 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-accent-600">
                {p.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {withBudget ? (
        <div className="grid gap-2">
          <label htmlFor={`${formId}-budget`} className={label}>Investimento aproximado</label>
          <select id={`${formId}-budget`} name="budget" defaultValue={v.budget ?? 'indefinido'} className={field}>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="grid gap-2">
        <label htmlFor={`${formId}-message`} className={label}>Conte sobre o projeto</label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          defaultValue={v.message}
          placeholder="O que a sua empresa faz, o que o site ou sistema precisa resolver e se há prazo."
          className={`${field} resize-y`}
        />
      </div>

      {state.status === 'error' ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[0.95rem] text-red-700">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[40ch] text-[0.85rem] text-ink-500">
          Seus dados servem só para responder este pedido. Nada de lista de e-mail.
        </p>
        <button type="submit" disabled={pending} className="btn btn-primary btn-on-light disabled:opacity-60">
          {pending ? 'Enviando…' : formId === 'orcamento' ? 'Pedir minha proposta' : 'Enviar mensagem'}
        </button>
      </div>
    </form>
  )
}
