import type { ServerProps } from 'payload'
import React from 'react'

/**
 * Topo da tela inicial do painel (admin.components.beforeDashboard).
 *
 * Saudação, números do site, atalhos para as tarefas mais comuns e os últimos
 * leads. Abaixo dele o Payload continua mostrando os cards das collections.
 * O visual vem de app/(payload)/custom.scss (classes gsr-dash*).
 */

const STATUS_LABEL: Record<string, string> = {
  novo: 'Novo',
  contatado: 'Contatado',
  qualificado: 'Qualificado',
  convertido: 'Convertido',
  descartado: 'Descartado',
}

const PROJECT_LABEL: Record<string, string> = {
  site: 'Site',
  sistema: 'Sistema',
  'landing-page': 'Landing page',
  'loja-virtual': 'Loja virtual',
  automacao: 'Automação',
  outro: 'Outro',
}

const greeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', hour12: false, timeZone: 'America/Fortaleza' }).format(
      new Date(),
    ),
  )
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Fortaleza',
  }).format(new Date(value))

const ACTIONS = [
  { href: '/admin/collections/posts/create', label: 'Escrever artigo', hint: 'Blog' },
  { href: '/admin/collections/case-studies/create', label: 'Novo projeto', hint: 'Portfólio' },
  { href: '/admin/collections/testimonials/create', label: 'Novo depoimento', hint: 'Prova social' },
  { href: '/admin/collections/media', label: 'Biblioteca de mídia', hint: 'Imagens' },
  { href: '/admin/globals/site-settings', label: 'Dados da empresa', hint: 'Contato e redes' },
  { href: '/admin/globals/seo-settings', label: 'SEO global', hint: 'Google' },
]

export const Dashboard = async ({ payload, user }: ServerProps) => {
  const [newLeads, leads, posts, cases, services, testimonials, recentLeads] = await Promise.all([
    payload.count({ collection: 'leads', where: { status: { equals: 'novo' } } }),
    payload.count({ collection: 'leads' }),
    payload.count({ collection: 'posts', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'case-studies', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'services', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'testimonials' }),
    payload.find({ collection: 'leads', sort: '-createdAt', limit: 5, depth: 0 }),
  ])

  const firstName = String((user as { name?: string } | undefined)?.name ?? '').split(' ')[0]

  const stats = [
    { label: 'Leads novos', value: newLeads.totalDocs, href: '/admin/collections/leads?where[status][equals]=novo', highlight: newLeads.totalDocs > 0 },
    { label: 'Leads no total', value: leads.totalDocs, href: '/admin/collections/leads' },
    { label: 'Artigos publicados', value: posts.totalDocs, href: '/admin/collections/posts' },
    { label: 'Projetos no portfólio', value: cases.totalDocs, href: '/admin/collections/case-studies' },
    { label: 'Serviços', value: services.totalDocs, href: '/admin/collections/services' },
    { label: 'Depoimentos', value: testimonials.totalDocs, href: '/admin/collections/testimonials' },
  ]

  return (
    <div className="gsr-dash">
      <header className="gsr-dash__hero">
        <div>
          <p className="gsr-dash__eyebrow">Painel GSR Sistemas</p>
          <h1 className="gsr-dash__title">
            {greeting()}
            {firstName ? `, ${firstName}` : ''}.
          </h1>
          <p className="gsr-dash__lead">
            {newLeads.totalDocs > 0
              ? `Você tem ${newLeads.totalDocs} ${newLeads.totalDocs === 1 ? 'lead novo esperando' : 'leads novos esperando'} resposta.`
              : 'Nenhum lead novo por enquanto. Bom momento para publicar um artigo.'}
          </p>
        </div>
        <a className="gsr-dash__site" href="/" target="_blank" rel="noopener noreferrer">
          Ver o site <span aria-hidden>↗</span>
        </a>
      </header>

      <section className="gsr-dash__stats" aria-label="Números do site">
        {stats.map((stat, i) => (
          <a key={stat.label} href={stat.href} className={`gsr-dash__stat${stat.highlight ? ' is-highlight' : ''}`}>
            <span className="gsr-dash__index">{String(i + 1).padStart(2, '0')}</span>
            <strong className="gsr-dash__number">{stat.value}</strong>
            <span className="gsr-dash__label">{stat.label}</span>
          </a>
        ))}
      </section>

      <div className="gsr-dash__grid">
        <section className="gsr-dash__panel">
          <h2 className="gsr-dash__heading">Atalhos</h2>
          <ul className="gsr-dash__actions">
            {ACTIONS.map((action) => (
              <li key={action.href}>
                <a href={action.href}>
                  <span>{action.label}</span>
                  <small>{action.hint}</small>
                  <span className="gsr-dash__arrow" aria-hidden>
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="gsr-dash__panel">
          <div className="gsr-dash__panel-head">
            <h2 className="gsr-dash__heading">Últimos leads</h2>
            <a href="/admin/collections/leads">Ver todos</a>
          </div>
          {recentLeads.docs.length === 0 ? (
            <p className="gsr-dash__empty">Os contatos do formulário do site aparecem aqui.</p>
          ) : (
            <ul className="gsr-dash__leads">
              {recentLeads.docs.map((lead) => (
                <li key={lead.id}>
                  <a href={`/admin/collections/leads/${lead.id}`}>
                    <span className="gsr-dash__lead-name">
                      {lead.name}
                      {lead.company ? <small> · {lead.company}</small> : null}
                    </span>
                    <span className="gsr-dash__lead-meta">
                      {lead.projectType ? PROJECT_LABEL[lead.projectType] ?? lead.projectType : '—'} ·{' '}
                      {formatDate(lead.createdAt)}
                    </span>
                    <span className={`gsr-dash__badge gsr-dash__badge--${lead.status ?? 'novo'}`}>
                      {STATUS_LABEL[lead.status ?? 'novo']}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <h2 className="gsr-dash__heading gsr-dash__heading--section">Todo o conteúdo</h2>
    </div>
  )
}
