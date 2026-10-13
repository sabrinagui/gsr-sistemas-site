/**
 * Cases de EXEMPLO, para você ver como a página de portfólio se comporta.
 *
 * ============================================================================
 * ATENÇÃO — ESTES PROJETOS NÃO SÃO REAIS.
 *
 * Nenhum cliente, número ou resultado aqui existe. São placeholders explícitos,
 * previstos no item 69 do briefing ("crie placeholders claramente
 * identificados"), com três marcas que impedem que virem conteúdo real por
 * descuido:
 *
 *   1. o campo `client` começa com "[EXEMPLO]";
 *   2. `clientApproved` é false, então o Payload BLOQUEIA a publicação;
 *   3. o slug começa com "exemplo-".
 *
 * Nenhum deles tem a seção de resultados preenchida — justamente para você ver
 * que um case sem métrica publica normalmente.
 *
 * Antes do lançamento, apague todos:
 *   npm run seed:examples -- --limpar
 * ============================================================================
 */

export {}

type LexicalNode = Record<string, unknown>

const text = (value: string): LexicalNode => ({
  type: 'text', text: value, format: 0, style: '', mode: 'normal', detail: 0, version: 1,
})

const paragraph = (value: string): LexicalNode => ({
  type: 'paragraph', children: [text(value)], direction: 'ltr', format: '', indent: 0,
  version: 1, textFormat: 0,
})

const richText = (values: string[]) => ({
  root: {
    type: 'root', children: values.map(paragraph), direction: 'ltr', format: '',
    indent: 0, version: 1,
  },
})

const EXAMPLES = [
  {
    slug: 'exemplo-sistema-de-gestao-de-entregas',
    title: 'Sistema de gestão de entregas',
    client: '[EXEMPLO] Substituir por cliente real',
    industry: 'Logística',
    projectType: 'sistema',
    year: 2025,
    featured: true,
    summary:
      'Substituição de um controle em planilhas por um sistema web com acompanhamento de entregas e fechamento diário.',
    challenge: [
      'A operação era controlada em planilhas compartilhadas. Cada entregador anotava as entregas do dia e alguém consolidava tudo à mão no fim do expediente.',
      'O fechamento levava horas, divergências só apareciam no dia seguinte e não havia como saber, no meio da tarde, como o dia estava indo.',
    ],
    solution: [
      'Um sistema web com registro de entrega no momento em que acontece, acessível pelo celular do entregador.',
      'O fechamento passou a ser automático, e a coordenação ganhou uma tela com o andamento do dia em tempo real.',
    ],
    features: [
      { title: 'Registro pelo celular', description: 'Entregador confirma a entrega na hora, sem papel.' },
      { title: 'Fechamento automático', description: 'O consolidado do dia é gerado sozinho.' },
      { title: 'Painel da operação', description: 'Andamento do dia, com detalhe por entregador.' },
      { title: 'Perfis de acesso', description: 'Cada função vê apenas o que lhe cabe.' },
    ],
  },
  {
    slug: 'exemplo-site-institucional-escritorio',
    title: 'Site institucional para escritório de serviços',
    client: '[EXEMPLO] Substituir por cliente real',
    industry: 'Serviços profissionais',
    projectType: 'site',
    year: 2025,
    featured: true,
    summary:
      'Site institucional novo, com estrutura pensada para busca e painel para a equipe publicar sem depender de terceiros.',
    challenge: [
      'O site anterior era lento, difícil de atualizar e não aparecia nas buscas pelo nome do serviço somado à cidade.',
      'Qualquer alteração de texto dependia de abrir chamado com quem havia feito o site.',
    ],
    solution: [
      'Um site novo, construído com foco em velocidade e em conteúdo visível para buscadores desde o HTML inicial.',
      'A equipe passou a publicar e alterar conteúdo pelo painel, sem intermediário.',
    ],
    features: [
      { title: 'Estrutura por serviço', description: 'Uma página para cada serviço realmente prestado.' },
      { title: 'Painel de conteúdo', description: 'Textos e imagens editáveis pela equipe.' },
      { title: 'Formulário de contato', description: 'Com validação e aviso por e-mail.' },
      { title: 'Página local', description: 'Conteúdo escrito para o mercado da cidade.' },
    ],
  },
  {
    slug: 'exemplo-integracao-entre-sistemas',
    title: 'Integração entre e-commerce e sistema interno',
    client: '[EXEMPLO] Substituir por cliente real',
    industry: 'Varejo',
    projectType: 'automacao',
    year: 2024,
    featured: false,
    summary:
      'Conexão entre a loja virtual e o sistema de gestão, eliminando o cadastro manual de pedidos.',
    challenge: [
      'Todo pedido da loja era redigitado no sistema de gestão. Além do tempo gasto, erros de digitação geravam problema de estoque e de entrega.',
    ],
    solution: [
      'Uma integração que leva o pedido da loja ao sistema de gestão assim que a compra é confirmada, com registro do que rodou e alerta quando algo falha.',
    ],
    features: [
      { title: 'Pedido automático', description: 'Da loja para a gestão, sem redigitação.' },
      { title: 'Estoque sincronizado', description: 'A loja reflete o estoque real.' },
      { title: 'Registro e alerta', description: 'Histórico do que rodou e aviso em caso de falha.' },
    ],
  },
]

const run = async () => {
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })
  const ctx = { disableRevalidate: true }

  const limpar = process.argv.includes('--limpar')

  if (limpar) {
    const found = await payload.find({
      collection: 'case-studies',
      where: { slug: { like: 'exemplo-' } },
      limit: 100,
    })
    for (const doc of found.docs) {
      await payload.delete({ collection: 'case-studies', id: doc.id, context: ctx })
      console.log(`removido: ${doc.slug}`)
    }
    console.log(`\n${found.docs.length} case(s) de exemplo removido(s).`)
    process.exit(0)
  }

  const services = await payload.find({ collection: 'services', limit: 20, depth: 0 })
  const byServiceSlug = Object.fromEntries(services.docs.map((s) => [s.slug, s.id]))

  const technologies = await payload.find({ collection: 'technologies', limit: 40, depth: 0 })
  const techIds = technologies.docs.map((t) => t.id)

  const serviceFor: Record<string, string[]> = {
    sistema: ['desenvolvimento-de-sistemas'],
    site: ['criacao-de-sites'],
    automacao: ['automacao-e-integracoes'],
  }

  for (const example of EXAMPLES) {
    const { challenge, solution, projectType, ...rest } = example

    const data = {
      ...rest,
      projectType,
      challenge: richText(challenge),
      solution: richText(solution),
      technologies: techIds.slice(0, 6),
      relatedServices: (serviceFor[projectType] ?? [])
        .map((s) => byServiceSlug[s])
        .filter(Boolean),
      // Falso de propósito: o Payload bloqueia a publicação sem autorização.
      clientApproved: false,
      _status: 'draft',
      seo: { index: true, follow: true },
    }

    const existing = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: example.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'case-studies',
        id: existing.docs[0].id,
        context: ctx,
        data: data as never,
        draft: true,
      })
      console.log(`atualizado: /portfolio/${example.slug}`)
    } else {
      await payload.create({
        collection: 'case-studies',
        context: ctx,
        data: data as never,
        draft: true,
      })
      console.log(`criado: /portfolio/${example.slug}`)
    }
  }

  console.log('\nTodos como RASCUNHO e SEM autorização do cliente.')
  console.log('Nenhum tem resultados preenchidos — case sem métrica publica normalmente.')
  console.log('Para remover antes do lançamento: npm run seed:examples -- --limpar')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
