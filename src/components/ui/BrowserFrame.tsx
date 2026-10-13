import Image from 'next/image'

import { cx } from '.'

/**
 * Janela de navegador minimalista em volta da captura de um projeto.
 * Barra clara com os três pontos e o endereço, tela em 16:10.
 */
export const BrowserFrame = ({
  image,
  alt,
  url,
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 60vw',
  dark = false,
  className,
}: {
  image?: string | null
  alt: string
  url?: string | null
  priority?: boolean
  sizes?: string
  dark?: boolean
  className?: string
}) => (
  <div
    className={cx(
      'overflow-hidden rounded-[18px] border shadow-[0_40px_80px_-40px_rgba(7,16,18,0.45)]',
      dark ? 'border-white/10 bg-ink-900' : 'border-ink-200 bg-white',
      className,
    )}
  >
    <div className={cx('flex h-10 items-center gap-2 px-4', dark ? 'border-b border-white/[0.06]' : 'border-b border-ink-100')}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={cx('h-2.5 w-2.5 rounded-full', dark ? 'bg-white/15' : 'bg-ink-200')} />
      ))}
      {url ? (
        <span
          className={cx(
            'ml-3 truncate rounded-md px-3 py-1 font-mono text-[0.72rem]',
            dark ? 'bg-white/5 text-ink-400' : 'bg-ink-50 text-ink-500',
          )}
        >
          {url}
        </span>
      ) : null}
    </div>
    <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
        />
      ) : null}
    </div>
  </div>
)
