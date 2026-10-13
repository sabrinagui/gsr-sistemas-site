/**
 * Projetos do portfólio.
 *
 *   npm run seed:projects
 *
 * Substitui os projetos antigos (MCM, Trilhos de Papel, Júlia Fonseca) pelos
 * atuais. Fonte do conteúdo: os cases em sabrinamesquita.dev e os próprios
 * sites no ar. Imagens em scripts/assets/projetos/.
 *
 * Auma e Sollare são projetos autorais (conceito), sem cliente externo: isso
 * fica explícito no campo "cliente", para o portfólio não sugerir o contrário.
 * Nenhum número foi criado aqui; "resultados" só traz o que o case original
 * informa.
 */
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const asset = (file: string) => resolve(root, 'scripts/assets/projetos', file)
const ctx = { disableRevalidate: true }

type LexNode = Record<string, unknown>
const text = (value: string): LexNode => ({ type: 'text', text: value, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })
const paragraph = (value: string): LexNode => ({ type: 'paragraph', children: [text(value)], direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0 })
const richText = (...paragraphs: string[]) => ({
  root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children: paragraphs.map(paragraph) },
})

const OLD_SLUGS = ['mcm-financiamentos', 'trilhos-de-papel', 'julia-fonseca-advocacia', 'mcm-marketing-digital']

const NEW_TECH = [
  { name: 'Three.js', category: 'frontend' },
  { name: 'Framer Motion', category: 'frontend' },
  { name: 'Mercado Pago', category: 'integracao' },
]

const PROJECTS = [
  {
    slug: 'refugio-nas-dunas',
    title: 'Refúgio nas Dunas',
    client: 'Refúgio nas Dunas',
    industry: 'Turismo e hospedagem',
    projectType: 'site',
    websiteUrl: 'https://refugionasdunas.com.br/',
    order: 1,
    cover: ['refugio-nas-dunas-capa.webp', 'Página inicial do site Refúgio nas Dunas, com busca de hospedagem nos Lençóis Maranhenses'],
    gallery: [
      ['refugio-busca.webp', 'Busca por datas e hóspedes e as casas para temporada', 'Busca por datas e hóspedes, com temporada, aluguel e venda separados.'],
      ['refugio-diferenciais.webp', 'Seção com os diferenciais da Refúgio nas Dunas', 'Os diferenciais da empresa, incluindo pagamento seguro e atendimento pelo WhatsApp.'],
    ],
    summary:
      'Site de hospedagem por temporada em Barreirinhas, nos Lençóis Maranhenses, com busca por datas, reserva online e pagamento pelo Mercado Pago.',
    challenge: richText(
      'A Refúgio nas Dunas trabalha com quatro frentes ao mesmo tempo: casas por temporada, aluguel mensal, imóveis à venda e passeios pelos Lençóis Maranhenses. Tudo isso acontecia em conversas longas pelo WhatsApp.',
      'O desafio era reunir as quatro frentes em um só lugar, sem confundir quem chega, e permitir que o hóspede reserve e pague sem depender de uma troca de mensagens.',
    ),
    solution: richText(
      'Um site com busca por local, datas e número de hóspedes logo na abertura, e vitrines separadas para temporada, aluguel, venda e passeios, cada uma com o seu próprio caminho.',
      'A reserva é feita online, com pagamento por Pix, cartão em até 12 vezes ou boleto pelo Mercado Pago e confirmação automática. Para quem prefere conversar, o WhatsApp está sempre à mão.',
    ),
    features: [
      { title: 'Busca de hospedagem', description: 'Local, check-in, check-out e hóspedes logo na primeira tela.' },
      { title: 'Reserva online', description: 'Disponibilidade e reserva sem precisar trocar mensagens.' },
      { title: 'Pagamento pelo Mercado Pago', description: 'Pix, cartão em até 12 vezes ou boleto, com confirmação automática.' },
      { title: 'Temporada, aluguel e venda', description: 'Cada tipo de imóvel no seu próprio fluxo, sem misturar.' },
      { title: 'Passeios e experiências', description: 'Passeios pelos Lençóis e aluguel de lancha, com preço por dia.' },
      { title: 'Área do cliente e WhatsApp', description: 'Cadastro e login para reservas, e WhatsApp em todas as páginas.' },
    ],
    results: [],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Mercado Pago'],
  },
  {
    slug: 'auma-arquitetura-3d',
    title: 'Auma Arquitetura',
    client: 'Auma (projeto autoral)',
    industry: 'Arquitetura e interiores',
    projectType: 'site',
    websiteUrl: 'https://auma3d.sabrinalabs.dev/',
    videoUrl: 'https://vimeo.com/1228946120',
    order: 2,
    cover: ['auma-capa.webp', 'Abertura do site Auma, com o interior da casa em 3D'],
    gallery: [
      ['auma-primeira-pessoa.webp', 'Tela "Architecture in the first person" do site Auma', 'Arquitetura em primeira pessoa: o visitante entra no projeto.'],
      ['auma-duas-luzes.webp', 'Comparação entre luz do dia e entardecer no mesmo ambiente', 'Duas luzes, um espaço: dia e entardecer no mesmo ambiente.'],
      ['auma-explorar.webp', 'Modo de exploração do ambiente 3D', 'Modo de exploração, com navegação pelos cômodos.'],
      ['auma-mobile.webp', 'Telas do site Auma no celular', 'A mesma experiência no celular.'],
    ],
    summary:
      'Site de arquitetura com experiência 3D interativa: o visitante entra no ambiente, troca acabamentos e alterna entre a luz do dia e o entardecer.',
    challenge: richText(
      'Unir uma direção visual minimalista a uma experiência 3D interativa, sem deixar a navegação confusa ou pesada, e ainda funcionar como site de um escritório de arquitetura.',
    ),
    solution: richText(
      'O visitante explora o espaço em primeira pessoa, troca o acabamento da mesa, alterna entre luz do dia e entardecer e navega em português ou inglês.',
      'O trabalho cobriu estrutura, identidade visual, hierarquia da informação, navegação, transições e a integração da experiência 3D com a interface.',
    ),
    features: [
      { title: 'Exploração em 3D', description: 'O visitante percorre o ambiente em primeira pessoa.' },
      { title: 'Troca de acabamentos', description: 'Três acabamentos de mesa, trocados em tempo real.' },
      { title: 'Dia e entardecer', description: 'A iluminação do ambiente muda com um toque.' },
      { title: 'Navegação entre áreas', description: 'Pontos de interesse levam a cada parte da casa.' },
      { title: 'Transições de página', description: 'Passagem suave entre a interface e a experiência 3D.' },
      { title: 'Bilíngue', description: 'Conteúdo completo em português e inglês.' },
    ],
    results: [
      { label: 'Experiência interativa', value: '3D' },
      { label: 'Acabamentos disponíveis', value: '3' },
      { label: 'Idiomas', value: '2' },
    ],
    tech: ['Next.js', 'React', 'Three.js', 'Tailwind CSS'],
  },
  {
    slug: 'sollare-energia-solar',
    title: 'Sollare',
    client: 'Sollare (projeto conceito)',
    industry: 'Energia solar',
    projectType: 'landing-page',
    websiteUrl: 'https://sollare.vercel.app/',
    order: 3,
    cover: ['sollare-capa.webp', 'Abertura da landing page Sollare, com o título "Turn sunlight into power"'],
    gallery: [
      ['sollare-hero.webp', 'Hero da Sollare com a chamada principal e os números de credibilidade', 'Abertura com a promessa, a chamada e os números de credibilidade.'],
      ['sollare-projetos.webp', 'Vitrine de projetos da Sollare', 'Vitrine de projetos por categoria: residencial, comercial e rural.'],
    ],
    summary:
      'Landing page para uma empresa de energia solar, com animações que guiam a leitura e um caminho direto até o pedido de orçamento.',
    challenge: richText(
      'Explicar um serviço técnico, que envolve dimensionamento, equipamento e financiamento, de um jeito simples, e levar o visitante até o pedido de orçamento sem que ele se perca no meio do caminho.',
    ),
    solution: richText(
      'Uma página única organizada em quem somos, serviços, como funciona e projetos, com a chamada para orçamento repetida ao longo do caminho e os números de credibilidade logo abaixo da abertura.',
      'As animações entram conforme a rolagem e conduzem o olho de uma seção para a outra, sem atrapalhar a leitura.',
    ),
    features: [
      { title: 'Abertura com chamada clara', description: 'Promessa, subtítulo e botão de orçamento na primeira tela.' },
      { title: 'Serviços em cartões', description: 'Residencial, comercial e rural, cada um com o seu argumento.' },
      { title: 'Como funciona', description: 'O passo a passo da instalação, da visita técnica ao suporte.' },
      { title: 'Vitrine de projetos', description: 'Projetos por categoria, com foto em destaque.' },
      { title: 'Animações na rolagem', description: 'Entradas suaves feitas com Framer Motion.' },
    ],
    results: [],
    tech: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
]

const run = async () => {
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  // Tecnologias que faltavam
  for (const tech of NEW_TECH) {
    const found = await payload.find({ collection: 'technologies', where: { name: { equals: tech.name } }, limit: 1 })
    if (!found.docs[0]) await payload.create({ collection: 'technologies', data: tech as never, context: ctx })
  }
  const techs = await payload.find({ collection: 'technologies', limit: 100, depth: 0 })
  const techId = (name: string) => techs.docs.find((t) => t.name === name)?.id

  // Projetos antigos saem
  const old = await payload.find({ collection: 'case-studies', where: { slug: { in: OLD_SLUGS } }, limit: 20, draft: true })
  for (const doc of old.docs) await payload.delete({ collection: 'case-studies', id: doc.id, context: ctx })
  console.log(`✓ ${old.docs.length} projetos antigos removidos`)

  // Capturas antigas saem da biblioteca de mídia, para não confundir no painel.
  const oldMedia = await payload.find({
    collection: 'media',
    where: { filename: { in: ['mcm-financiamentos.webp', 'mcm-marketing.webp', 'trilhos-de-papel.webp', 'julia-fonseca.webp'] } },
    limit: 20,
  })
  for (const doc of oldMedia.docs) await payload.delete({ collection: 'media', id: doc.id, context: ctx })
  if (oldMedia.docs.length) console.log(`✓ ${oldMedia.docs.length} imagens antigas removidas`)

  const upload = async (file: string, alt: string) => {
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1 })
    if (existing.docs[0]) return existing.docs[0].id
    const created = await payload.create({ collection: 'media', data: { alt } as never, filePath: asset(file), context: ctx })
    return created.id
  }

  for (const p of PROJECTS) {
    const featuredImage = await upload(p.cover[0], p.cover[1])
    const gallery = []
    for (const [file, alt, caption] of p.gallery) gallery.push({ image: await upload(file, alt), caption })

    const data = {
      slug: p.slug,
      title: p.title,
      client: p.client,
      industry: p.industry,
      projectType: p.projectType,
      websiteUrl: p.websiteUrl,
      videoUrl: (p as { videoUrl?: string }).videoUrl,
      summary: p.summary,
      challenge: p.challenge,
      solution: p.solution,
      features: p.features,
      results: p.results,
      featuredImage,
      gallery,
      technologies: p.tech.map(techId).filter(Boolean),
      clientApproved: true,
      featured: true,
      order: p.order,
      _status: 'published',
    }

    const existing = await payload.find({ collection: 'case-studies', where: { slug: { equals: p.slug } }, limit: 1, draft: true })
    if (existing.docs[0]) {
      await payload.update({ collection: 'case-studies', id: existing.docs[0].id, data: data as never, context: ctx })
    } else {
      await payload.create({ collection: 'case-studies', data: data as never, context: ctx })
    }
    console.log(`✓ ${p.title}`)
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
