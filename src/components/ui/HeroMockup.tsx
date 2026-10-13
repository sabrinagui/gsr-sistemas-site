import Image from 'next/image'

/**
 * Mockup do hero.
 *
 * Aceita uma imagem vinda do CMS (SiteSettings › Home › Imagem do hero). Quando
 * ela existe, é o que aparece. Enquanto não existe, entra o mockup construído
 * em HTML/CSS abaixo — assim o hero nunca fica vazio nem com um "placeholder"
 * visível esperando arte.
 *
 * O mockup em CSS é abstrato de propósito: um mockup com números legíveis
 * estaria inventando métrica de cliente. Barras e linhas sugerem um painel sem
 * afirmar nada.
 *
 * Todo o bloco é decorativo: aria-hidden, fora da ordem de leitura. Quando a
 * imagem real entrar, ela recebe o alt cadastrado na mídia.
 */

const BAR_HEIGHTS = [38, 56, 30, 72, 48, 88, 62, 96, 70, 84]

export const HeroMockup = ({
  image,
  alt,
}: {
  image?: string | null
  alt?: string | null
} = {}) => {
  if (image) {
    return (
      <div className="relative">
        <Image
          src={image}
          alt={alt ?? ''}
          width={1400}
          height={980}
          priority
          sizes="(max-width: 1024px) 92vw, 50vw"
          className="h-auto w-full rounded-xl"
        />
      </div>
    )
  }

  return <CssMockup />
}

const CssMockup = () => (
  <div aria-hidden="true" className="pointer-events-none select-none">
    <div className="relative">
      {/* ── Janela do navegador ───────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-ink-800 bg-ink-900 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.7)]">
        {/* Barra do navegador */}
        <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-950 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
          <div className="ml-3 h-5 flex-1 rounded bg-ink-900" />
        </div>

        {/* Corpo do painel */}
        <div className="flex">
          {/* Menu lateral */}
          <div className="hidden w-40 shrink-0 border-r border-ink-800 p-4 sm:block">
            <div className="h-2.5 w-20 rounded-full bg-ink-700" />
            <div className="mt-6 space-y-3">
              <div className="h-2 w-full rounded-full bg-accent-600/70" />
              <div className="h-2 w-4/5 rounded-full bg-ink-800" />
              <div className="h-2 w-3/4 rounded-full bg-ink-800" />
              <div className="h-2 w-5/6 rounded-full bg-ink-800" />
              <div className="h-2 w-2/3 rounded-full bg-ink-800" />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 p-5 sm:p-6">
            {/* Blocos de indicador */}
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-ink-800 bg-ink-950 p-3">
                  <div className="h-1.5 w-10 rounded-full bg-ink-700" />
                  <div
                    className={`mt-3 h-3 rounded-full ${i === 0 ? 'w-14 bg-accent-500' : 'w-12 bg-ink-600'}`}
                  />
                </div>
              ))}
            </div>

            {/* Gráfico de barras */}
            <div className="mt-4 rounded-lg border border-ink-800 bg-ink-950 p-4">
              <div className="h-1.5 w-16 rounded-full bg-ink-700" />
              <div className="mt-4 flex h-28 items-end gap-1.5 sm:gap-2">
                {BAR_HEIGHTS.map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`flex-1 rounded-sm ${
                      i === BAR_HEIGHTS.length - 3 ? 'bg-accent-500' : 'bg-ink-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Linhas de tabela */}
            <div className="mt-4 space-y-2.5">
              {[100, 82, 91, 68].map((width, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 shrink-0 rounded bg-ink-800" />
                  <div
                    style={{ width: `${width * 0.6}%` }}
                    className="h-2 rounded-full bg-ink-800"
                  />
                  <div className="ml-auto h-2 w-8 shrink-0 rounded-full bg-ink-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Celular sobreposto ────────────────────────────────────────────── */}
      <div className="absolute -bottom-10 -left-6 hidden w-40 overflow-hidden rounded-[1.25rem] border border-ink-700 bg-ink-950 p-2 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)] md:block lg:-left-12 lg:w-44">
        <div className="rounded-[0.9rem] border border-ink-800 bg-ink-900 p-3">
          <div className="mx-auto h-1 w-8 rounded-full bg-ink-700" />
          <div className="mt-4 h-2 w-16 rounded-full bg-ink-700" />
          <div className="mt-2 h-2 w-12 rounded-full bg-ink-800" />
          <div className="mt-4 rounded-md border border-ink-800 bg-ink-950 p-2.5">
            <div className="h-1.5 w-10 rounded-full bg-ink-700" />
            <div className="mt-2 h-2.5 w-14 rounded-full bg-accent-500" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-1.5 w-full rounded-full bg-ink-800" />
            <div className="h-1.5 w-4/5 rounded-full bg-ink-800" />
            <div className="h-1.5 w-3/5 rounded-full bg-ink-800" />
          </div>
          <div className="mt-4 h-6 rounded-md bg-accent-600" />
        </div>
      </div>
    </div>
  </div>
)
