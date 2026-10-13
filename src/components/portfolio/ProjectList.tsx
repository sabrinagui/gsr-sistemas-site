'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { ArrowIcon } from '@/components/ui'
import { BrowserFrame } from '@/components/ui/BrowserFrame'

export type ListProject = {
  slug: string
  title: string
  type: string
  typeLabel: string
  industry?: string | null
  summary?: string | null
  image?: string | null
  url?: string | null
}

/**
 * Lista do portfólio: filtro por tipo e um projeto por linha, alternando o
 * lado da imagem. Os links estão todos no HTML inicial (o filtro só esconde).
 */
export const ProjectList = ({ projects }: { projects: ListProject[] }) => {
  const types = useMemo(() => {
    const seen = new Map<string, string>()
    projects.forEach((p) => seen.set(p.type, p.typeLabel))
    return [...seen.entries()]
  }, [projects])
  const [filter, setFilter] = useState<string | null>(null)
  const visible = filter ? projects.filter((p) => p.type === filter) : projects

  return (
    <div>
      {types.length > 1 ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo de projeto">
          {[[null, 'Todos'] as [string | null, string], ...types].map(([value, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-2.5 text-[0.92rem] font-medium transition-colors ${
                filter === value ? 'border-ink-950 bg-ink-950 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-950'
              }`}
            >
              {label}
              {value === null ? <span className="ml-2 font-mono text-[0.75rem] opacity-60">{projects.length}</span> : null}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="mt-16 grid gap-24 md:gap-32">
        {visible.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/portfolio/${p.slug}/`}
              className="group grid items-center gap-10 no-underline lg:grid-cols-[1.35fr_1fr] lg:gap-20"
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <BrowserFrame image={p.image} alt={`Site ${p.title}`} url={p.url} priority={i === 0} />
              </div>
              <div className="min-w-0">
                <span className="font-display text-[4.5rem] font-extrabold leading-none tracking-[-0.05em] text-ink-200 transition-colors duration-500 group-hover:text-accent-500 md:text-[6rem]">
                  {String(projects.indexOf(p) + 1).padStart(2, '0')}
                </span>
                <p className="mt-6 font-mono text-[0.8rem] uppercase tracking-[0.08em] text-accent-700">
                  {p.typeLabel}
                  {p.industry ? ` · ${p.industry}` : ''}
                </p>
                <h2 className="mt-3 text-[2.2rem] leading-[1.05] tracking-tight md:text-[3rem]">{p.title}</h2>
                {p.summary ? <p className="mt-5 max-w-[44ch] text-lg text-ink-500">{p.summary}</p> : null}
                <span className="mt-8 inline-flex items-center gap-4 font-medium text-ink-950">
                  <span className="go-circle">
                    <ArrowIcon className="h-5 w-5" />
                  </span>
                  Ver o projeto
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
