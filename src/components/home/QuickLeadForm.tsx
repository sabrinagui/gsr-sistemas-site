'use client'

import { useState } from 'react'

import { WhatsAppIcon } from '@/components/ui'

const TYPES = ['Site', 'Loja virtual', 'Sistema', 'Manutenção']

/**
 * Formulário curto da home: três perguntas e a mensagem vai pronta para o
 * WhatsApp. O formulário completo, que grava o lead no CMS, fica em /orcamento/.
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
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  const field =
    'w-full rounded-xl border border-white/10 bg-ink-950 px-4 py-3.5 text-white placeholder:text-ink-600 transition-colors focus:border-accent-500 focus:outline-none'

  return (
    <form
      onSubmit={submit}
      className="grid gap-5 rounded-3xl border border-white/[0.08] bg-ink-900 p-6 md:p-9"
      data-reveal
    >
      <div className="grid gap-2">
        <label htmlFor="lead-nome" className="text-[0.88rem] text-ink-400">
          Seu nome
        </label>
        <input id="lead-nome" name="nome" required autoComplete="name" placeholder="Como podemos te chamar?" className={field} />
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-[0.88rem] text-ink-400">O que você precisa?</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={`rounded-full border px-4 py-2.5 text-[0.92rem] transition-colors ${
                type === t
                  ? 'border-accent-500 bg-accent-500 text-[#04191c]'
                  : 'border-white/10 text-white hover:border-white/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="lead-msg" className="text-[0.88rem] text-ink-400">
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

      <button type="submit" className="btn btn-primary w-full">
        <WhatsAppIcon />
        Enviar pelo WhatsApp
      </button>
    </form>
  )
}
