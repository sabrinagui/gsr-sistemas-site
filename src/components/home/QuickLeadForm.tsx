'use client'

import { useState } from 'react'

import { trackEvent } from '@/lib/analytics/events'
import { WhatsAppIcon } from '@/components/ui'

const TYPES = ['Site', 'Loja virtual', 'Sistema', 'Landing page', 'Manutenção']

/**
 * Formulário curto da home: três perguntas e a mensagem vai pronta para o
 * WhatsApp. Cartão claro sobre o fundo escuro da seção, para ser o ponto mais
 * visível dela. O formulário completo, que grava o lead no CMS, fica em /orcamento/.
 */
export const QuickLeadForm = ({ whatsapp }: { whatsapp: string }) => {
  const [type, setType] = useState(TYPES[0])
  const digits = whatsapp.replace(/\D/g, '')

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const text = [
      `Olá, GSR! Sou ${data.get('nome')}.`,
      `Preciso de: ${type}`,
      String(data.get('mensagem') ?? '').trim(),
    ]
      .filter(Boolean)
      .join('\n')
    trackEvent('whatsapp_click', { form_id: 'home-rapido', project_type: type })
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  const field =
    'w-full rounded-xl border border-ink-200 bg-paper px-4 py-4 text-[1.02rem] text-ink-950 placeholder:text-ink-400 transition-colors focus:border-accent-600 focus:bg-white focus:outline-none'

  return (
    <form
      onSubmit={submit}
      className="grid gap-6 rounded-[28px] bg-white p-7 text-ink-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] md:p-10"
      data-reveal
    >
      <div>
        <p className="font-display text-[1.6rem] font-bold leading-tight tracking-tight">Peça seu orçamento</p>
        <p className="mt-1.5 text-ink-500">Leva menos de um minuto. A resposta sai no mesmo dia útil.</p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="lead-nome" className="text-[0.9rem] font-medium text-ink-700">
          Seu nome
        </label>
        <input id="lead-nome" name="nome" required autoComplete="name" placeholder="Como podemos te chamar?" className={field} />
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-[0.9rem] font-medium text-ink-700">O que você precisa?</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={`rounded-full border px-4 py-2.5 text-[0.93rem] font-medium transition-colors ${
                type === t
                  ? 'border-ink-950 bg-ink-950 text-white'
                  : 'border-ink-200 text-ink-700 hover:border-ink-950'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="lead-msg" className="text-[0.9rem] font-medium text-ink-700">
          Conte um pouco sobre o seu negócio
        </label>
        <textarea
          id="lead-msg"
          name="mensagem"
          rows={4}
          placeholder="Ex.: tenho uma clínica e quero um site com agendamento."
          className={`${field} resize-y`}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-on-light h-[3.75rem] w-full text-[1.05rem]">
        <WhatsAppIcon />
        Enviar pelo WhatsApp
      </button>
      <p className="-mt-2 text-center text-[0.85rem] text-ink-500">
        Abre o WhatsApp com a mensagem pronta. Nada é enviado sem você confirmar.
      </p>
    </form>
  )
}
