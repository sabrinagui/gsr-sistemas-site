import type { Metadata } from 'next'

import { Button, WhatsAppIcon } from '@/components/ui'
import { whatsappLink } from '@/lib/contact'
import { getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'

/** Confirmação de envio. noindex: não é conteúdo, é passo de conversão. */

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Recebemos seu pedido', path: '/obrigado/', noIndex: true })
}

export default async function ObrigadoPage() {
  const site = await getSiteSettings()
  const whatsapp = site?.whatsapp ? whatsappLink(site.whatsapp, 'Olá! Acabei de enviar um pedido pelo site.') : null

  return (
    <section data-hero className="bg-ink-950 text-ink-300">
      <div className="container-page grid min-h-[calc(100dvh-4.75rem)] content-center py-24">
        <p className="eyebrow eyebrow-dark" data-reveal="0">
          pedido recebido
        </p>
        <h1 data-split className="mt-6 max-w-[18ch] text-[2.4rem] leading-[1.06] text-white md:text-[3.4rem]">
          Obrigado. Seu pedido já está com a gente.
        </h1>
        <p data-reveal="0.1" className="mt-6 max-w-[52ch] text-lg text-ink-400">
          Vamos ler com atenção e responder no mesmo dia útil. Se quiser adiantar a conversa, chame no WhatsApp.
        </p>
        <div data-reveal="0.2" className="mt-10 flex flex-wrap gap-3">
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon />
              Adiantar pelo WhatsApp
            </a>
          ) : null}
          <Button href="/portfolio/" variant="secondary" arrow className="text-white">
            Ver projetos enquanto isso
          </Button>
        </div>
      </div>
    </section>
  )
}
