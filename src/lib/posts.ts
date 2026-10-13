/**
 * URL pública de um artigo.
 *
 * Os artigos mantêm o formato do WordPress (/2024/12/23/criacao-de-sites-em-sao-luis/)
 * para preservar as URLs que já estão indexadas no Google. A data vem de
 * publishedAt, lida no fuso de São Luís: um artigo publicado às 22h de um dia
 * não pode virar o dia seguinte por causa do UTC.
 */

type PostLike = { slug?: string | null; publishedAt?: string | null; createdAt?: string | null }

const parts = (iso: string) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Fortaleza',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const [year, month, day] = formatter.format(new Date(iso)).split('-')
  return { year, month, day }
}

export const postPath = (post: PostLike): string => {
  const date = post.publishedAt ?? post.createdAt ?? new Date().toISOString()
  const { year, month, day } = parts(date)
  return `/${year}/${month}/${day}/${post.slug}/`
}

export const formatPostDate = (iso?: string | null): string =>
  iso
    ? new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Fortaleza',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(iso))
    : ''
