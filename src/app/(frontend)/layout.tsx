import type { Metadata } from 'next'
import { Archivo, Geist, Geist_Mono, Mrs_Saint_Delafield } from 'next/font/google'
import React from 'react'

import { Analytics } from '@/components/analytics/Analytics'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSEOSettings, getSiteSettings } from '@/lib/payload/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import {
  buildGraph,
  generateFounderSchema,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo/schema'

import './globals.css'

/**
 * Archivo nos títulos (encorpada como o "GSR" da logo), Geist no texto, Geist
 * Mono nos rótulos e Mrs Saint Delafield só na assinatura da Sabrina. O
 * next/font serve tudo do próprio domínio, sem requisição a fonts.gstatic.com.
 */
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const signature = Mrs_Saint_Delafield({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sign',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const [site, seo] = await Promise.all([getSiteSettings(), getSEOSettings()])

  const base = buildMetadata({
    title: site?.companyName ?? 'GSR Sistemas',
    description: seo?.defaultDescription ?? site?.description,
    path: '/',
    titleTemplate: seo?.titleTemplate ?? '%s | GSR Sistemas',
  })

  return {
    ...base,
    title: {
      default: seo?.defaultTitle ?? 'GSR Sistemas',
      template: seo?.titleTemplate ?? '%s | GSR Sistemas',
    },
    verification: seo?.googleSiteVerification
      ? { google: seo.googleSiteVerification }
      : undefined,
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings()

  /**
   * Organization sempre. LocalBusiness só quando o endereço for confirmado como
   * local de atendimento — enquanto isso, generateLocalBusinessSchema devolve null
   * e nada de endereço é emitido (technical-seo.md, 7.1).
   */
  const graph = buildGraph([
    generateOrganizationSchema(site as never),
    generateFounderSchema(),
    generateLocalBusinessSchema(site as never),
    generateWebSiteSchema(site as never),
  ])

  return (
    <html lang="pt-BR" className={`${archivo.variable} ${geist.variable} ${geistMono.variable} ${signature.variable}`}>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <JsonLd data={graph} />
        <Header />
        <main id="conteudo" className="flex-1 pt-[4.75rem]">
          {children}
        </main>
        <Footer />
        <Analytics />
        <MotionProvider />
      </body>
    </html>
  )
}
