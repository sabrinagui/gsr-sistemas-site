import type { Metadata } from 'next'
import { Suspense } from 'react'

import { LeadForm } from '@/components/forms/LeadForm'
import { GoogleIcon, WhatsAppIcon } from '@/components/ui'
import { PageHero } from '@/components/ui/PageHero'
import { GOOGLE_REVIEWS, whatsappLink } from '@/lib/contact'
import { getFeaturedTestimonials, getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Peça seu orçamento',
    description:
      'Conte o que sua empresa precisa e receba uma proposta com escopo, prazo e valor fechados para seu site, loja virtual ou sistema.',
    path: '/orcamento/',
  })
}

const NEXT_STEPS = [
  { title: 'Lemos o seu pedido', text: 'No mesmo dia útil, com atenção ao que você escreveu.' },
  { title: 'Conversa rápida', text: 'Pelo WhatsApp ou por vídeo, para entender o negócio e tirar dúvidas.' },
  { title: 'Proposta por escrito', text: 'Escopo, prazo e valor fechados. Sem letra miúda.' },
]

export default async function OrcamentoPage() {
  const [site, testimonials] = await Promise.all([getSiteSettings(), getFeaturedTestimonials(1)])
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, site.whatsappMessage) : null
  const review = testimonials[0]

  return (
    <>
      <PageHero
        compact
        breadcrumbs={[
          { name: 'Início', path: '/' },
          { name: 'Orçamento', path: '/orcamento/' },
        ]}
        eyebrow="orçamento"
        title="Conte o que você precisa. A proposta vem com escopo, prazo e valor."
        description="Leva dois minutos. Quanto mais você contar sobre o seu negócio, mais certeira fica a proposta."
      />

      <section className="bg-paper py-16 md:py-24">
        <div className="container-page grid items-start gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div className="relative min-w-0" data-reveal>
            <Suspense>
              <LeadForm formId="orcamento" />
            </Suspense>
          </div>

          <aside className="grid gap-10 lg:sticky lg:top-28">
            <div>
              <p className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-ink-500">Depois que você envia</p>
              <ol className="mt-5 grid gap-5">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="grid grid-cols-[32px_1fr] gap-3">
                    <span className="font-mono text-[0.82rem] leading-7 text-accent-600">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="block font-semibold text-ink-950">{step.title}</span>
                      <span className="text-[0.95rem] text-ink-500">{step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {review ? (
              <figure className="rounded-3xl bg-ink-950 p-7 text-ink-300">
                <div className="flex items-center gap-2.5">
                  <GoogleIcon className="h-5 w-5" />
                  <span className="text-[0.85rem] tracking-[2px] text-star">★★★★★</span>
                  <span className="ml-auto font-display text-xl font-bold text-white">{GOOGLE_REVIEWS.rating}</span>
                </div>
                <blockquote className="mt-4 line-clamp-5 text-[1.02rem] leading-relaxed text-white">
                  “{review.testimonial}”
                </blockquote>
                <figcaption className="mt-4 text-[0.88rem] text-ink-400">{review.name}, no Google</figcaption>
              </figure>
            ) : null}

            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-5 no-underline transition-colors hover:border-ink-950"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#25d366] text-white">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-semibold text-ink-950">Prefere conversar?</span>
                  <span className="text-[0.92rem] text-ink-500">Chame no WhatsApp e responda no seu tempo.</span>
                </span>
              </a>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  )
}
