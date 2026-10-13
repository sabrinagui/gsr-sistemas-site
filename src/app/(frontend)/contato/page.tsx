import type { Metadata } from 'next'
import { Suspense } from 'react'

import { LeadForm } from '@/components/forms/LeadForm'
import { ArrowIcon, WhatsAppIcon } from '@/components/ui'
import { PageHero } from '@/components/ui/PageHero'
import { formatBrazilianPhone, whatsappLink } from '@/lib/contact'
import { getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Contato',
    description: 'Fale com a GSR Sistemas pelo WhatsApp, e-mail ou formulário. Atendimento para empresas de todo o Brasil.',
    path: '/contato/',
  })
}

export default async function ContatoPage() {
  const site = await getSiteSettings()
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null
  const instagram = (site?.socialProfiles ?? []).find((p) => p.platform === 'instagram')

  const channels = [
    whatsapp && site?.whatsapp
      ? { label: 'WhatsApp', value: formatBrazilianPhone(site.whatsapp), href: whatsapp, hint: 'O jeito mais rápido' }
      : null,
    site?.email ? { label: 'E-mail', value: site.email, href: `mailto:${site.email}`, hint: 'Para enviar arquivos e briefings' } : null,
    instagram ? { label: 'Instagram', value: '@gsrsistemas', href: instagram.url, hint: 'Bastidores e projetos' } : null,
  ].filter(Boolean) as { label: string; value: string; href: string; hint: string }[]

  return (
    <>
      <PageHero
        compact
        breadcrumbs={[
          { name: 'Início', path: '/' },
          { name: 'Contato', path: '/contato/' },
        ]}
        eyebrow="contato"
        title="Fale com quem vai fazer o seu projeto."
        description="Sem central de atendimento: a mensagem chega direto para a equipe que desenha e desenvolve. Atendemos empresas de todo o Brasil."
      >
        {whatsapp ? (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsAppIcon />
            Chamar no WhatsApp
          </a>
        ) : null}
      </PageHero>

      <section className="bg-paper py-16 md:py-24">
        <div className="container-page grid items-start gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <ul className="grid gap-3" data-reveal-stagger>
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-ink-200 bg-white p-6 no-underline transition-colors hover:border-ink-950"
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">{c.label}</span>
                    <span className="mt-1 block break-words text-[1.15rem] font-semibold text-ink-950">{c.value}</span>
                    <span className="text-[0.9rem] text-ink-500">{c.hint}</span>
                  </span>
                  <span className="go-circle h-11 w-11">
                    <ArrowIcon className="h-[18px] w-[18px]" />
                  </span>
                </a>
              </li>
            ))}
            <li className="rounded-2xl border border-ink-200 bg-white p-6">
              <span className="block font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">Atendimento</span>
              <span className="mt-1 block text-[1.15rem] font-semibold text-ink-950">Todo o Brasil, 100% online</span>
              <span className="text-[0.9rem] text-ink-500">Horário comercial e também aos fins de semana</span>
            </li>
          </ul>

          <div className="relative min-w-0" data-reveal>
            <Suspense>
              <LeadForm formId="contato" withBudget={false} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
