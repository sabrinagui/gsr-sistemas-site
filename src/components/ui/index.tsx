import Link from 'next/link'
import React from 'react'

/**
 * Primitivas de layout e ação.
 *
 * Deliberadamente poucas. Um sistema com cinco peças bem definidas produz
 * páginas mais coerentes do que um com trinta variantes.
 */

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

export const ArrowIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14m-6-6 6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const WhatsAppIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.03.8.81-2.95-.2-.31a8.2 8.2 0 1 1 6.92 3.79Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43l-.76-1.83c-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.75 2.75 0 0 0-.86 2.04 4.8 4.8 0 0 0 1 2.53 11 11 0 0 0 4.2 3.7c1.57.68 2.18.74 2.96.62.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.29Z" />
  </svg>
)

export const GoogleIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 31.9 15l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z" />
  </svg>
)

/* ── Seção ──────────────────────────────────────────────────────────────────
 * Ritmo vertical vem daqui, não de cada página. Alterna papel e palco escuro.
 */
export const Section = ({
  children,
  className,
  bordered = false,
  tone = 'paper',
  id,
}: {
  children: React.ReactNode
  className?: string
  bordered?: boolean
  tone?: 'paper' | 'muted' | 'ink' | 'white'
  id?: string
}) => {
  const tones = {
    paper: 'bg-paper',
    white: 'bg-white',
    muted: 'bg-ink-50',
    ink: 'bg-ink-950 text-ink-300',
  }

  return (
    <section
      id={id}
      className={cx(
        'py-24 md:py-32 lg:py-40',
        bordered && tone !== 'ink' && 'border-t border-ink-100',
        tones[tone],
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}

/* ── Cabeçalho de seção ─────────────────────────────────────────────────────
 * Rótulo "/ nome" em pílula, título revelado linha a linha e, opcionalmente,
 * uma descrição alinhada à direita em telas largas.
 */
export const SectionHeader = ({
  eyebrow,
  title,
  description,
  as: Heading = 'h2',
  dark = false,
  aside,
}: {
  eyebrow?: string
  title: string
  description?: string | null
  as?: 'h1' | 'h2' | 'h3'
  dark?: boolean
  aside?: React.ReactNode
}) => (
  <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
    <div>
      {eyebrow ? (
        <p className={cx('eyebrow', dark && 'eyebrow-dark')} data-reveal>
          {eyebrow}
        </p>
      ) : null}
      <Heading
        data-split
        className={cx(
          'text-[2.1rem] leading-[1.08] md:text-[2.75rem] xl:text-[3.4rem]',
          eyebrow && 'mt-6',
          dark && 'text-white',
        )}
      >
        {title}
      </Heading>
    </div>
    {description || aside ? (
      <div className="lg:justify-self-end" data-reveal>
        {description ? (
          <p className={cx('max-w-[46ch] text-lg', dark ? 'text-ink-400' : 'text-ink-500')}>
            {description}
          </p>
        ) : null}
        {aside}
      </div>
    ) : null}
  </div>
)

/* ── Botão ──────────────────────────────────────────────────────────────────
 * Pílula. O primário tem preenchimento que sobe por baixo no hover.
 */
type ButtonProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Em fundo claro, o hover do primário escurece em vez de clarear. */
  onLight?: boolean
  arrow?: boolean
  className?: string
  external?: boolean
}

export const Button = ({
  href,
  children,
  variant = 'primary',
  onLight = false,
  arrow = false,
  className,
  external = false,
}: ButtonProps) => {
  const classes =
    variant === 'ghost'
      ? cx('inline-flex items-center gap-1.5 font-semibold text-accent-600 no-underline hover:underline', className)
      : cx(
          'btn',
          variant === 'primary' ? 'btn-primary' : 'btn-outline',
          onLight && 'btn-on-light',
          className,
        )

  const content = (
    <>
      {children}
      {arrow ? <ArrowIcon className="btn-arrow h-[18px] w-[18px]" /> : null}
    </>
  )

  if (external) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer" target="_blank">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}

/* ── Link com seta ──────────────────────────────────────────────────────────
 * A seta é aria-hidden: o texto do link já diz tudo para o leitor de tela.
 */
export const ArrowLink = ({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) => (
  <Link
    href={href}
    className={cx(
      'group inline-flex items-center gap-1.5 font-semibold text-accent-600 no-underline',
      className,
    )}
  >
    <span className="underline-grow">{children}</span>
    <ArrowIcon className="arrow-slide h-4 w-4" />
  </Link>
)

/* ── Lista numerada ─────────────────────────────────────────────────────────
 * Para conteúdo que é de fato uma sequência (processo, etapas).
 */
export const NumberedList = ({
  items,
  columns = 3,
  dark = false,
}: {
  items: { title: string; description?: string | null; href?: string | null }[]
  columns?: 2 | 3
  dark?: boolean
}) => (
  <ol
    data-reveal-stagger
    className={cx('mt-16 grid gap-x-10 gap-y-0 sm:grid-cols-2', columns === 3 && 'lg:grid-cols-3')}
  >
    {items.map((item, index) => (
      <li key={item.title} className={cx('border-t py-9', dark ? 'border-white/10' : 'border-ink-200')}>
        <p className="font-mono text-[0.82rem] text-accent-600">{String(index + 1).padStart(2, '0')}</p>
        <h3 className={cx('mt-4 text-[1.4rem] tracking-tight', dark && 'text-white')}>
          {item.href ? (
            <Link href={item.href} className="no-underline hover:text-accent-600">
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </h3>
        {item.description ? (
          <p className={cx('mt-3', dark ? 'text-ink-400' : 'text-ink-500')}>{item.description}</p>
        ) : null}
      </li>
    ))}
  </ol>
)

/* ── Breadcrumbs ────────────────────────────────────────────────────────────
 * A versão visual. O JSON-LD correspondente é gerado em lib/seo/schema.
 */
export const Breadcrumbs = ({
  items,
  dark = false,
}: {
  items: { name: string; path: string }[]
  dark?: boolean
}) => (
  <nav aria-label="Trilha de navegação" className="text-sm">
    <ol className={cx('flex flex-wrap items-center gap-x-2 gap-y-1', dark ? 'text-ink-500' : 'text-ink-500')}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <li key={item.path} className="flex items-center gap-2">
            {isLast ? (
              <span aria-current="page" className={dark ? 'text-ink-300' : 'text-ink-700'}>
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="no-underline hover:text-accent-500">
                {item.name}
              </Link>
            )}
            {!isLast ? (
              <span aria-hidden="true" className="text-accent-600">
                /
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  </nav>
)

/* ── FAQ ────────────────────────────────────────────────────────────────────
 * <details> nativo: funciona sem JavaScript, é acessível por teclado e o
 * conteúdo está no HTML inicial, o que também importa para o buscador.
 */
export const FaqList = ({ items }: { items: { question: string; answer: React.ReactNode }[] }) => (
  <div className="border-t border-ink-200">
    {items.map((item) => (
      <details key={item.question} className="group border-b border-ink-200">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 text-[1.15rem] font-medium tracking-tight text-ink-950 md:text-[1.3rem] [&::-webkit-details-marker]:hidden">
          {item.question}
          <span
            aria-hidden="true"
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-200 transition-colors duration-300 group-open:border-ink-950 group-open:bg-ink-950 group-open:text-white"
          >
            <span className="absolute h-[1.5px] w-3 bg-current" />
            <span className="absolute h-3 w-[1.5px] bg-current transition-transform duration-500 group-open:rotate-90" />
          </span>
        </summary>
        <div className="prose-gsr pb-8 pr-14 text-ink-500">{item.answer}</div>
      </details>
    ))}
  </div>
)

/* ── Faixa de conversão ─────────────────────────────────────────────────── */
export const CtaBand = ({
  title,
  description,
  buttonLabel = 'Pedir orçamento',
  buttonHref = '/orcamento/',
  whatsappHref,
}: {
  title: string
  description?: string | null
  buttonLabel?: string
  buttonHref?: string
  whatsappHref?: string | null
}) => (
  <Section tone="ink">
    <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <p className="eyebrow eyebrow-dark" data-reveal>
          orçamento
        </p>
        <h2 data-split className="mt-6 text-[2.3rem] leading-[1.05] text-white md:text-[3.2rem] xl:text-[4rem]">
          {title}
        </h2>
      </div>
      <div data-reveal>
        {description ? <p className="max-w-[44ch] text-lg text-ink-400">{description}</p> : null}
        <div className="mt-8 flex flex-wrap gap-3">
          {whatsappHref ? (
            <a href={whatsappHref} rel="noopener noreferrer" target="_blank" className="btn btn-primary">
              <WhatsAppIcon />
              Orçamento pelo WhatsApp
            </a>
          ) : null}
          <Link href={buttonHref} className="btn btn-outline text-white">
            {buttonLabel}
            <ArrowIcon className="btn-arrow h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </div>
  </Section>
)
