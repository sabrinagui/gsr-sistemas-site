import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { pt } from '@payloadcms/translations/languages/pt'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { CaseStudies } from '@/collections/CaseStudies'
import { FAQs } from '@/collections/FAQs'
import { Leads } from '@/collections/Leads'
import { Locations } from '@/collections/Locations'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Posts } from '@/collections/Posts'
import { Redirects } from '@/collections/Redirects'
import { Services } from '@/collections/Services'
import { Technologies } from '@/collections/Technologies'
import { Testimonials } from '@/collections/Testimonials'
import { Users } from '@/collections/Users'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { SEOSettings } from '@/globals/SEOSettings'
import { SiteSettings } from '@/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const hasR2 = Boolean(process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID)
const hasResend = Boolean(process.env.RESEND_API_KEY)

export default buildConfig({
  // Painel em português.
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt',
  },

  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · GSR Sistemas',
      icons: [{ rel: 'icon', type: 'image/png', url: '/brand/gsr-icone.png' }],
    },
    // Marca da GSR no login, na navegação e na tela inicial (src/components/admin).
    components: {
      graphics: {
        Logo: '/components/admin/Branding#AdminLogo',
        Icon: '/components/admin/Branding#AdminIcon',
      },
      beforeLogin: ['/components/admin/Branding#LoginIntro'],
      afterNavLinks: ['/components/admin/Branding#NavSiteLink'],
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
    },
  },

  collections: [
    Pages,
    Services,
    Locations,
    CaseStudies,
    Posts,
    Testimonials,
    FAQs,
    Technologies,
    Media,
    Redirects,
    Leads,
    Users,
  ],

  globals: [SiteSettings, Header, Footer, SEOSettings],

  editor: lexicalEditor(),

  /**
   * Fila de jobs — hoje só a publicação agendada de artigos.
   *
   * Local e em Docker o processo fica de pé, e o autoRun confere a fila a cada
   * minuto. Em serverless (Vercel) isso não existe: lá um cron precisa chamar
   * GET /api/payload-jobs/run com "Authorization: Bearer $CRON_SECRET".
   */
  jobs: {
    access: {
      run: ({ req }) => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`
      },
    },
    autoRun: process.env.VERCEL ? undefined : [{ cron: '* * * * *', queue: 'default' }],
  },

  // Neon. A string precisa ser a de pooling — ver payload-schema.md, 8.1.
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? '' },
  }),

  /**
   * Cloudflare R2. O sistema de arquivos da Vercel é efêmero, então upload
   * precisa ir para armazenamento externo de qualquer forma.
   *
   * Sem credenciais configuradas, o plugin não é carregado e o Payload usa o
   * disco local — o que permite rodar o projeto localmente antes de o bucket existir.
   */
  plugins: hasR2
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.R2_BUCKET as string,
          config: {
            endpoint: process.env.R2_ENDPOINT,
            region: 'auto',
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            },
          },
        }),
      ]
    : [],

  email: hasResend
    ? resendAdapter({
        defaultFromAddress: process.env.RESEND_FROM_ADDRESS ?? 'nao-responda@gsrsistemas.com',
        defaultFromName: 'GSR Sistemas',
        apiKey: process.env.RESEND_API_KEY as string,
      })
    : undefined,

  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,

  // O admin nunca deve aparecer em busca; o robots.txt e o header X-Robots-Tag
  // cuidam disso. Aqui limitamos a superfície da API pública.
  graphQL: { disable: process.env.NODE_ENV === 'production' },
})
