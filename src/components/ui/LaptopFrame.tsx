import Image from 'next/image'

/**
 * Moldura de laptop.
 *
 * Construída em CSS, não como imagem de mockup. Motivos: nitidez em qualquer
 * densidade de tela, alguns KB em vez de centenas, e possibilidade de colocar
 * conteúdo real dentro da tela — com imagem de mockup, o print do projeto
 * ficaria achatado dentro de um PNG.
 *
 * Quando o case ainda não tem captura de tela, a tela mostra uma interface
 * abstrata coerente com o tipo do projeto. Formas, não números inventados.
 */

type ScreenKind = 'sistema' | 'site' | 'loja-virtual' | 'landing-page' | 'automacao' | 'app'

const BARS = [42, 68, 34, 78, 52, 90, 61]

/** Interface abstrata para quando não há captura de tela do projeto. */
const AbstractScreen = ({ kind }: { kind: ScreenKind }) => {
  if (kind === 'sistema' || kind === 'automacao') {
    return (
      <div className="flex h-full">
        <div className="hidden w-[22%] shrink-0 border-r border-ink-800 p-3 sm:block">
          <div className="h-1.5 w-10 rounded-full bg-ink-700" />
          <div className="mt-4 space-y-2">
            <div className="h-1.5 w-full rounded-full bg-accent-600/70" />
            <div className="h-1.5 w-4/5 rounded-full bg-ink-800" />
            <div className="h-1.5 w-3/4 rounded-full bg-ink-800" />
            <div className="h-1.5 w-5/6 rounded-full bg-ink-800" />
          </div>
        </div>
        <div className="flex-1 p-3 sm:p-4">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded border border-ink-800 bg-ink-950 p-2">
                <div className="h-1 w-6 rounded-full bg-ink-700" />
                <div
                  className={`mt-2 h-2 rounded-full ${i === 0 ? 'w-8 bg-accent-500' : 'w-7 bg-ink-600'}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2.5 rounded border border-ink-800 bg-ink-950 p-3">
            <div className="flex h-16 items-end gap-1.5">
              {BARS.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`flex-1 rounded-sm ${i === 5 ? 'bg-accent-500' : 'bg-ink-700'}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-2.5 space-y-1.5">
            {[100, 78, 88].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-sm bg-ink-800" />
                <div style={{ width: `${w * 0.5}%` }} className="h-1.5 rounded-full bg-ink-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'loja-virtual') {
    return (
      <div className="h-full p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="h-2 w-12 rounded-full bg-ink-600" />
          <div className="flex gap-1.5">
            <div className="h-1.5 w-6 rounded-full bg-ink-800" />
            <div className="h-1.5 w-6 rounded-full bg-ink-800" />
            <div className="h-1.5 w-4 rounded-full bg-accent-600" />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="rounded border border-ink-800 bg-ink-950 p-1.5">
              <div className="aspect-square rounded-sm bg-ink-800" />
              <div className="mt-1.5 h-1 w-full rounded-full bg-ink-800" />
              <div
                className={`mt-1 h-1.5 w-2/3 rounded-full ${i === 2 ? 'bg-accent-500' : 'bg-ink-700'}`}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // site, landing-page, app
  return (
    <div className="h-full p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="h-2 w-14 rounded-full bg-ink-600" />
        <div className="flex gap-2">
          <div className="h-1.5 w-7 rounded-full bg-ink-800" />
          <div className="h-1.5 w-7 rounded-full bg-ink-800" />
          <div className="h-3 w-12 rounded bg-accent-600" />
        </div>
      </div>
      <div className="mt-6">
        <div className="h-3 w-3/4 rounded-full bg-ink-600" />
        <div className="mt-2 h-3 w-1/2 rounded-full bg-ink-700" />
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-3/5 rounded-full bg-ink-800" />
          <div className="h-1.5 w-2/5 rounded-full bg-ink-800" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-5 w-20 rounded bg-accent-600" />
          <div className="h-5 w-16 rounded border border-ink-700" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded border border-ink-800 bg-ink-950 p-2">
            <div className="h-1 w-5 rounded-full bg-accent-600/70" />
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-ink-800" />
            <div className="mt-1 h-1.5 w-3/4 rounded-full bg-ink-800" />
          </div>
        ))}
      </div>
    </div>
  )
}

export const LaptopFrame = ({
  kind = 'site',
  image,
  alt = '',
  priority = false,
}: {
  kind?: ScreenKind
  image?: string | null
  alt?: string
  priority?: boolean
}) => (
  <div className="w-full">
    {/* Tampa e tela */}
    <div className="rounded-t-xl border border-b-0 border-ink-700 bg-ink-900 p-2 sm:p-2.5">
      <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-ink-800 bg-ink-950">
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 85vw, 640px"
            className="object-cover object-top"
          />
        ) : (
          <AbstractScreen kind={kind} />
        )}
      </div>
    </div>

    {/* Base e dobradiça. O trapézio dá o volume do laptop sem imagem. */}
    <div className="relative">
      <div
        className="mx-auto h-3 w-[108%] border-x border-ink-800 bg-ink-800"
        style={{ clipPath: 'polygon(3% 0, 97% 0, 100% 100%, 0 100%)' }}
      />
      <div
        aria-hidden="true"
        className="mx-auto h-1 w-[108%] rounded-b-lg bg-ink-900"
        style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}
      />
      {/* Entalhe do apoio para abrir a tampa. */}
      <div className="absolute inset-x-0 top-0 mx-auto h-1 w-16 rounded-b-full bg-ink-950/60" />
    </div>
  </div>
)
