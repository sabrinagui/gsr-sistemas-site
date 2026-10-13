import React from 'react'

import { Breadcrumbs, cx } from '.'

/**
 * Abertura escura das páginas internas. Continua o cabeçalho (também escuro),
 * então a página começa como uma peça só, igual à home.
 */
export const PageHero = ({
  breadcrumbs,
  eyebrow,
  title,
  description,
  children,
  aside,
  compact = false,
}: {
  breadcrumbs?: { name: string; path: string }[]
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  aside?: React.ReactNode
  compact?: boolean
}) => (
  <section data-hero className="bg-ink-950 text-ink-300">
    <div
      className={cx(
        'container-page grid items-end gap-12',
        compact ? 'pb-16 pt-12 md:pb-20 md:pt-16' : 'pb-20 pt-14 md:pb-28 md:pt-20',
        Boolean(aside) && 'lg:grid-cols-[1.15fr_0.85fr] lg:gap-20',
      )}
    >
      <div className="min-w-0">
        {breadcrumbs ? (
          <div data-reveal="0">
            <Breadcrumbs items={breadcrumbs} dark />
          </div>
        ) : null}
        {eyebrow ? (
          <p className={cx('eyebrow eyebrow-dark', breadcrumbs && 'mt-10')} data-reveal="0">
            {eyebrow}
          </p>
        ) : null}
        <h1
          data-split
          className={cx(
            'max-w-[20ch] text-[2.3rem] font-bold leading-[1.06] text-white md:text-[3.1rem] xl:text-[3.9rem]',
            (eyebrow || breadcrumbs) && 'mt-6',
          )}
        >
          {title}
        </h1>
        {description ? (
          <div data-reveal="0.1" className="mt-7 max-w-[58ch] text-lg text-ink-400 md:text-[1.15rem]">
            {description}
          </div>
        ) : null}
        {children ? (
          <div data-reveal="0.2" className="mt-10">
            {children}
          </div>
        ) : null}
      </div>
      {aside ? <div className="min-w-0" data-reveal="0.2">{aside}</div> : null}
    </div>
  </section>
)
