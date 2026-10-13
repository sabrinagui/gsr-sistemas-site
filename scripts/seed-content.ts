/**
 * Seed da estrutura da FASE 4: serviços, tecnologias e páginas locais.
 *
 * IMPORTANTE — o que este script faz e o que ele NÃO faz.
 *
 * Ele cria a estrutura das páginas com texto de rascunho descrevendo o ofício:
 * o que é o serviço, como o trabalho funciona, o que está incluso. Nada disso
 * afirma fato específico sobre a GSR.
 *
 * Ele NÃO cria, em nenhuma hipótese: número de projetos, quantidade de clientes,
 * tempo de mercado, prazo, preço, nome de cliente, case ou depoimento. Esses
 * dados só entram quando você confirmar (content-plan.md, seção 2).
 *
 * Todo conteúdo entra como RASCUNHO. Nada vai ao ar sem você publicar.
 *
 *   npm run seed:content
 */

export {}

type LexicalNode = Record<string, unknown>

const text = (value: string): LexicalNode => ({
  type: 'text',
  text: value,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})

const paragraph = (value: string): LexicalNode => ({
  type: 'paragraph',
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  textFormat: 0,
})

const heading = (value: string, tag: 'h2' | 'h3' = 'h2'): LexicalNode => ({
  type: 'heading',
  tag,
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const richText = (nodes: LexicalNode[]) => ({
  root: { type: 'root', children: nodes, direction: 'ltr', format: '', indent: 0, version: 1 },
})

const TECHNOLOGIES = [
  { name: 'Next.js', category: 'frontend', order: 1 },
  { name: 'React', category: 'frontend', order: 2 },
  { name: 'TypeScript', category: 'frontend', order: 3 },
  { name: 'Tailwind CSS', category: 'frontend', order: 4 },
  { name: 'Node.js', category: 'backend', order: 5 },
  { name: 'PostgreSQL', category: 'banco', order: 6 },
  { name: 'Payload CMS', category: 'backend', order: 7 },
  { name: 'Vercel', category: 'infra', order: 8 },
  { name: 'Shopify', category: 'ecommerce', order: 9 },
  { name: 'WooCommerce', category: 'ecommerce', order: 10 },
]

const SERVICES = [
  {
    slug: 'criacao-de-sites',
    title: 'Criação de Sites Profissionais',
    shortTitle: 'Criação de Sites',
    order: 1,
    description:
      'Sites institucionais construídos para carregar rápido, aparecer no Google e transformar visita em contato.',
    focusKeyword: 'criação de sites',
    secondaryKeywords: [
      'criação de sites profissionais',
      'empresa de criação de sites',
      'desenvolvimento de sites',
      'sites empresariais',
    ],
    hero: {
      headline: 'Criação de Sites Profissionais',
      subheadline:
        'Um site que apresenta sua empresa com clareza, carrega rápido em qualquer conexão e é encontrado por quem procura o que você faz.',
      secondaryCtaLabel: 'Ver serviços',
      secondaryCtaHref: '/servicos',
    },
    content: [
      paragraph(
        'Um site profissional não é um folder na internet. Ele é, na maioria dos casos, o primeiro contato de alguém com a sua empresa — e o que essa pessoa encontra nos primeiros segundos decide se ela continua ou volta para o resultado de busca seguinte.',
      ),
      heading('O que separa um site que funciona de um que só existe'),
      paragraph(
        'Três coisas, na prática. A primeira é velocidade: página que demora a abrir perde visitante antes de mostrar qualquer conteúdo, e isso é especialmente sério no celular, onde vem a maior parte do tráfego. A segunda é clareza: quem chega precisa entender em poucos segundos o que sua empresa faz e o que fazer em seguida. A terceira é ser encontrável, o que depende de estrutura técnica correta, não de sorte.',
      ),
      heading('Tipos de site que desenvolvemos'),
      paragraph(
        'Site institucional, para empresas que precisam apresentar quem são, o que fazem e como ser contatadas. Site de catálogo, quando há produtos ou serviços a mostrar sem venda online. E sites com área de conteúdo, para quem publica com regularidade e quer usar isso para aparecer em busca.',
      ),
      heading('Site feito sob medida, não montado em template'),
      paragraph(
        'Template pronto resolve rápido e tem seu lugar. O problema aparece depois: você fica preso ao que o modelo permite, carrega código que não usa, e qualquer coisa fora do previsto vira contorno. Construir sob medida significa que a estrutura atende ao que a sua empresa precisa mostrar — e o que precisar mudar depois pode ser mudado.',
      ),
      heading('Desempenho e busca não são etapa final'),
      paragraph(
        'Velocidade, estrutura de títulos, endereços de página, dados estruturados e comportamento em celular são decididos enquanto o site é construído. Tentar acrescentar isso depois de pronto custa mais e funciona pior.',
      ),
    ],
    features: [
      {
        title: 'Estrutura de páginas',
        description:
          'Definida a partir do que sua empresa precisa comunicar e de como as pessoas procuram por isso.',
      },
      {
        title: 'Desenho das telas',
        description: 'Layout próprio, pensado para leitura e para levar ao contato.',
      },
      {
        title: 'Desenvolvimento',
        description: 'Construção com foco em velocidade e em conteúdo visível para buscadores.',
      },
      {
        title: 'Painel para editar',
        description: 'Você publica e altera textos e imagens sem depender de nós.',
      },
      {
        title: 'Formulários',
        description: 'Contato e orçamento com validação e aviso por e-mail.',
      },
      {
        title: 'Publicação',
        description: 'Domínio, certificado de segurança e configuração de busca e medição.',
      },
    ],
    benefits: [
      {
        title: 'Carrega rápido',
        description:
          'Páginas leves, imagens no tamanho certo e o mínimo de código no navegador de quem acessa.',
      },
      {
        title: 'Aparece na busca',
        description:
          'Endereços limpos, títulos corretos, dados estruturados e conteúdo presente já no HTML.',
      },
      {
        title: 'Funciona no celular',
        description: 'Desenhado primeiro para tela pequena, que é de onde vem a maior parte das visitas.',
      },
      {
        title: 'Você tem autonomia',
        description: 'Painel próprio para publicar conteúdo sem abrir chamado.',
      },
    ],
    process: [
      { title: 'Entendimento', description: 'O que o site precisa resolver e para quem.' },
      { title: 'Estrutura', description: 'Páginas, conteúdo necessário e o que fica para depois.' },
      { title: 'Interface', description: 'Desenho das telas, começando pelo celular.' },
      { title: 'Desenvolvimento', description: 'Construção com entregas acompanháveis.' },
      { title: 'Testes', description: 'Navegadores, dispositivos, velocidade e formulários.' },
      { title: 'Publicação', description: 'Site no ar, com busca e medição configuradas.' },
    ],
  },
  {
    slug: 'desenvolvimento-de-sistemas',
    title: 'Desenvolvimento de Sistemas Sob Medida',
    shortTitle: 'Desenvolvimento de Sistemas',
    order: 2,
    description:
      'Sistemas web construídos em torno do processo da sua empresa: painéis, portais, automações e integrações.',
    focusKeyword: 'desenvolvimento de sistemas',
    secondaryKeywords: [
      'desenvolvimento de sistemas sob medida',
      'sistemas personalizados',
      'sistemas personalizados para empresas',
      'desenvolvimento de sistemas web',
      'software personalizado',
      'desenvolvimento de plataformas web',
    ],
    hero: {
      headline: 'Desenvolvimento de Sistemas Sob Medida',
      subheadline:
        'Quando o processo da sua empresa é o diferencial dela, forçá-lo dentro de um software genérico custa caro. Um sistema sob medida acompanha como você já trabalha.',
      secondaryCtaLabel: 'Ver serviços',
      secondaryCtaHref: '/servicos',
    },
    content: [
      paragraph(
        'Existe um ponto em que a planilha para de dar conta. Os dados estão em quatro lugares, alguém precisa consolidar tudo à mão toda semana, e a informação que importa só aparece quando já é tarde para agir. É aí que um sistema deixa de ser luxo e vira infraestrutura.',
      ),
      heading('Sistemas sob medida e sistemas web'),
      paragraph(
        'Um sistema sob medida é construído em torno do processo que a sua empresa já tem, em vez de obrigar a empresa a mudar o processo para caber na ferramenta. Sendo web, ele é acessado pelo navegador, sem instalação em cada máquina, com controle de quem pode ver e fazer o quê.',
      ),
      heading('Painéis e indicadores'),
      paragraph(
        'Um painel bem feito não é uma tela cheia de gráficos. É a resposta rápida a perguntas específicas que alguém precisa fazer todo dia — e o caminho para ir do número ao detalhe quando algo chama atenção.',
      ),
      heading('Portais e áreas de acesso'),
      paragraph(
        'Áreas restritas para clientes, equipes ou parceiros, com cada perfil vendo apenas o que lhe diz respeito. Serve para consulta de dados, envio de documentos e acompanhamento de solicitações.',
      ),
      heading('Integrações e automações'),
      paragraph(
        'Sistemas que já existem na empresa raramente conversam entre si. Integrar significa que o dado cadastrado uma vez aparece onde precisa aparecer, sem alguém redigitando. Detalhamos isso na página de automação e integrações.',
      ),
      heading('MVP: começar menor para arriscar menos'),
      paragraph(
        'Quando a ideia ainda precisa ser validada, construir tudo de uma vez é o caminho mais caro. Um MVP entrega primeiro o que responde à pergunta principal, e o resto vem depois — com base no que o uso real mostrou.',
      ),
      heading('Quando sob medida não é a resposta'),
      paragraph(
        'Se existe uma ferramenta pronta que atende bem ao que você precisa, ela normalmente sai mais barata e entra em operação mais rápido. Dizemos isso quando for o caso. Sob medida faz sentido quando o processo é específico o bastante para que o pronto atrapalhe mais do que ajude.',
      ),
    ],
    features: [
      {
        title: 'Levantamento do processo',
        description: 'Entender como o trabalho é feito hoje, incluindo as exceções.',
      },
      {
        title: 'Modelagem de dados',
        description: 'Estrutura pensada para crescer sem virar remendo.',
      },
      { title: 'Perfis de acesso', description: 'Cada pessoa vê e faz apenas o que lhe cabe.' },
      { title: 'Painéis', description: 'Indicadores que respondem a perguntas reais da operação.' },
      { title: 'Integrações', description: 'Conexão com sistemas e serviços que a empresa já usa.' },
      { title: 'Entrega e acompanhamento', description: 'Publicação, treinamento e suporte combinado.' },
    ],
    benefits: [
      {
        title: 'Acompanha o seu processo',
        description: 'A ferramenta se adapta à empresa, não o contrário.',
      },
      {
        title: 'Menos trabalho manual',
        description: 'O que hoje é planilha e retrabalho vira etapa automática.',
      },
      {
        title: 'Informação no momento certo',
        description: 'Dado disponível quando ainda dá para agir sobre ele.',
      },
      {
        title: 'Cresce junto',
        description: 'O que precisar mudar depois pode ser mudado, porque o código é seu.',
      },
    ],
    process: [
      { title: 'Levantamento', description: 'Como o processo funciona hoje, com as exceções.' },
      { title: 'Escopo', description: 'O que entra na primeira versão e o que fica para depois.' },
      { title: 'Modelagem', description: 'Estrutura de dados e regras de negócio.' },
      { title: 'Desenvolvimento', description: 'Construção em etapas acompanháveis.' },
      { title: 'Homologação', description: 'Uso com dados reais antes de valer para todos.' },
      { title: 'Operação', description: 'Publicação, treinamento e acompanhamento.' },
    ],
  },
  {
    slug: 'landing-pages',
    title: 'Criação de Landing Pages que Convertem',
    shortTitle: 'Landing Pages',
    order: 3,
    description:
      'Páginas de campanha com um objetivo só: transformar quem clicou no anúncio em contato.',
    focusKeyword: 'criação de landing page',
    secondaryKeywords: ['landing page profissional', 'página de captura', 'landing page para anúncios'],
    hero: {
      headline: 'Criação de Landing Pages',
      subheadline:
        'Uma página, um objetivo. Sem menu para distrair, sem caminho alternativo, com o argumento na ordem em que a pessoa precisa ler.',
    },
    content: [
      paragraph(
        'Landing page é diferente de site. O site apresenta a empresa inteira e permite explorar. A landing page existe para uma campanha específica e tem uma única ação desejada — pedir orçamento, se inscrever, baixar algo, agendar.',
      ),
      heading('Por que uma página separada'),
      paragraph(
        'Quem clica em um anúncio chega com uma expectativa criada por aquele anúncio. Se cai na home, precisa procurar. Cada clique a mais entre a chegada e a ação é gente que desiste no caminho — e, em campanha paga, cada desistência tem custo.',
      ),
      heading('Velocidade importa mais aqui do que em qualquer outro lugar'),
      paragraph(
        'Tráfego de anúncio é majoritariamente de celular, muitas vezes em conexão instável. Uma página pesada gasta o dinheiro do anúncio antes de mostrar o conteúdo. Landing page precisa ser leve, e leve de verdade.',
      ),
      heading('Medição desde o primeiro dia'),
      paragraph(
        'Sem medir, não dá para melhorar. As páginas saem com eventos configurados para que você saiba quantas pessoas chegaram, quantas começaram a preencher e quantas concluíram — que é o número que importa.',
      ),
    ],
    features: [
      { title: 'Estrutura do argumento', description: 'A ordem em que a informação precisa aparecer.' },
      { title: 'Desenho da página', description: 'Layout com um caminho só até a ação.' },
      { title: 'Formulário', description: 'Os campos necessários e nada além disso.' },
      { title: 'Medição', description: 'Eventos configurados para acompanhar a conversão real.' },
    ],
    benefits: [
      { title: 'Foco em uma ação', description: 'Sem menu e sem caminho paralelo para distrair.' },
      { title: 'Carrega rápido', description: 'Essencial para não desperdiçar investimento em mídia.' },
      { title: 'Mensurável', description: 'Você sabe o que funcionou e o que não funcionou.' },
    ],
    process: [
      { title: 'Objetivo', description: 'Qual ação a página precisa gerar.' },
      { title: 'Argumento', description: 'O que dizer e em que ordem.' },
      { title: 'Desenho', description: 'Layout a partir do celular.' },
      { title: 'Publicação', description: 'Página no ar com medição configurada.' },
    ],
  },
  {
    slug: 'lojas-virtuais',
    title: 'Criação de Lojas Virtuais',
    shortTitle: 'Lojas Virtuais',
    order: 4,
    description:
      'Loja online em Shopify ou WooCommerce, escolhida pelo que faz sentido para a sua operação.',
    focusKeyword: 'criação de loja virtual',
    secondaryKeywords: ['desenvolvimento de e-commerce', 'criar loja virtual', 'loja online para empresa'],
    hero: {
      headline: 'Criação de Lojas Virtuais',
      subheadline:
        'Trabalhamos com Shopify e WooCommerce. A escolha entre as duas não é preferência nossa — depende de como sua operação funciona.',
    },
    content: [
      paragraph(
        'Vender online envolve muito mais do que colocar produtos numa página. Envolve estoque, frete, pagamento, emissão fiscal e o que acontece depois da compra. A plataforma certa é a que resolve isso com menos atrito para o seu caso.',
      ),
      heading('Loja virtual em Shopify'),
      paragraph(
        'Faz sentido quando o objetivo é entrar em operação rápido, sem servidor para administrar. A plataforma cuida da infraestrutura, da segurança e das atualizações; o custo é mensal e previsível, e há um ecossistema grande de aplicativos para necessidades específicas. Em troca, você trabalha dentro do que a plataforma permite e há taxas por transação a considerar.',
      ),
      heading('Loja virtual em WooCommerce'),
      paragraph(
        'Faz sentido quando você precisa de controle total, integração com sistemas próprios ou regras de negócio que fogem do padrão. Não há taxa da plataforma por venda e os dados são seus. Em troca, a hospedagem, as atualizações e a segurança passam a ser responsabilidade de alguém — normalmente por meio de um contrato de manutenção.',
      ),
      heading('Como escolher entre as duas'),
      paragraph(
        'Operação simples, catálogo previsível e pressa para vender apontam para Shopify. Necessidade de integração com o que a empresa já usa, regras próprias de preço ou frete e volume que torne a taxa por transação significativa apontam para WooCommerce. Na prática, decidimos isso na conversa inicial, olhando a sua operação.',
      ),
    ],
    features: [
      { title: 'Escolha da plataforma', description: 'Decidida a partir da sua operação, não por padrão.' },
      { title: 'Cadastro e catálogo', description: 'Estrutura de categorias, produtos e variações.' },
      { title: 'Pagamento e frete', description: 'Configuração dos meios e das regras de envio.' },
      { title: 'Layout', description: 'Identidade da loja aplicada às telas de compra.' },
      { title: 'Treinamento', description: 'Para sua equipe operar a loja no dia a dia.' },
    ],
    benefits: [
      { title: 'Plataforma adequada', description: 'Escolhida pelo caso, não por hábito de quem desenvolve.' },
      { title: 'Pronta para buscar', description: 'Estrutura de categorias e produtos pensada para busca.' },
      { title: 'Você opera sozinho', description: 'Cadastro e pedidos ficam com a sua equipe.' },
    ],
    process: [
      { title: 'Operação', description: 'Como você vende, entrega e cobra hoje.' },
      { title: 'Plataforma', description: 'Shopify ou WooCommerce, com o motivo explicado.' },
      { title: 'Montagem', description: 'Catálogo, pagamento, frete e layout.' },
      { title: 'Testes', description: 'Compra de ponta a ponta antes de abrir.' },
      { title: 'Abertura', description: 'Loja no ar com medição configurada.' },
    ],
  },
  {
    slug: 'automacao-e-integracoes',
    title: 'Automação de Processos e Integração de Sistemas',
    shortTitle: 'Automação e Integrações',
    order: 5,
    description:
      'Conectar o que já existe na empresa e eliminar a etapa manual que só transporta informação de um lugar para outro.',
    focusKeyword: 'automação de processos',
    secondaryKeywords: [
      'integração de sistemas',
      'automação de processos empresariais',
      'integração de APIs',
      'integração entre sistemas',
    ],
    hero: {
      headline: 'Automação de Processos e Integração de Sistemas',
      subheadline:
        'Quando alguém passa parte do dia copiando dado de um sistema para outro, esse tempo não está sendo pago por trabalho — está sendo pago por transporte de informação.',
    },
    content: [
      paragraph(
        'Quase toda empresa tem uma etapa que existe só porque dois sistemas não se falam. Alguém exporta uma planilha, ajusta, importa em outro lugar. Funciona, até o dia em que alguém erra uma linha ou está de férias.',
      ),
      heading('Automação de processos'),
      paragraph(
        'Automatizar é fazer o computador executar a sequência de passos que hoje alguém faz à mão. Vale para envio de e-mail a partir de uma condição, geração de relatório recorrente, atualização de status e conferência de dados. O ganho não é só de tempo: é de consistência, porque o processo passa a acontecer sempre do mesmo jeito.',
      ),
      heading('Integração de sistemas'),
      paragraph(
        'Integrar é fazer com que o dado cadastrado uma vez apareça em todos os lugares onde precisa aparecer. Isso normalmente é feito por meio das APIs que os sistemas oferecem — e, quando não há API, por outros caminhos, avaliados caso a caso.',
      ),
      heading('O que costuma valer a pena automatizar primeiro'),
      paragraph(
        'Tarefas repetitivas, frequentes e com regra clara. Se a tarefa acontece toda semana, segue sempre os mesmos passos e um erro nela causa problema, ela é boa candidata. O que depende de julgamento a cada caso normalmente não é — e forçar automação aí costuma criar mais exceção do que resolve.',
      ),
    ],
    features: [
      { title: 'Mapeamento', description: 'Quais etapas existem hoje e quais podem sair.' },
      { title: 'Integração via API', description: 'Conexão entre os sistemas que a empresa já usa.' },
      { title: 'Rotinas automáticas', description: 'Tarefas recorrentes executadas sem intervenção.' },
      { title: 'Registro e alerta', description: 'Histórico do que rodou e aviso quando algo falha.' },
    ],
    benefits: [
      { title: 'Menos retrabalho', description: 'O dado é cadastrado uma vez só.' },
      { title: 'Menos erro', description: 'O processo acontece sempre do mesmo jeito.' },
      { title: 'Tempo devolvido', description: 'A equipe volta a fazer o que exige julgamento humano.' },
    ],
    process: [
      { title: 'Mapeamento', description: 'O processo atual, passo a passo.' },
      { title: 'Prioridade', description: 'O que dá mais retorno automatizar primeiro.' },
      { title: 'Construção', description: 'Integração ou rotina, conforme o caso.' },
      { title: 'Acompanhamento', description: 'Monitoramento e ajuste depois de rodando.' },
    ],
  },
]

const run = async () => {
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })
  const ctx = { disableRevalidate: true }

  // ── Tecnologias ───────────────────────────────────────────────────────────
  const techIds: Record<string, number | string> = {}
  for (const tech of TECHNOLOGIES) {
    const slug = tech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existing = await payload.find({
      collection: 'technologies',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      techIds[tech.name] = existing.docs[0].id
    } else {
      const created = await payload.create({
        collection: 'technologies',
        context: ctx,
        data: { ...tech, slug } as never,
      })
      techIds[tech.name] = created.id
    }
  }
  console.log(`Tecnologias: ${Object.keys(techIds).length}`)

  // ── Serviços ──────────────────────────────────────────────────────────────
  const serviceIds: Record<string, number | string> = {}
  for (const service of SERVICES) {
    const { content, focusKeyword, secondaryKeywords, ...rest } = service

    const data = {
      ...rest,
      content: richText(content),
      showInNav: true,
      technologies: Object.values(techIds),
      seo: { focusKeyword, secondaryKeywords, index: true, follow: true },
      _status: 'draft',
    }

    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      const updated = await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        context: ctx,
        data: data as never,
        draft: true,
      })
      serviceIds[service.slug] = updated.id
      console.log(`  atualizado: /${service.slug}`)
    } else {
      const created = await payload.create({
        collection: 'services',
        context: ctx,
        data: data as never,
        draft: true,
      })
      serviceIds[service.slug] = created.id
      console.log(`  criado: /${service.slug}`)
    }
  }

  // Relacionamentos entre serviços, para que nenhuma página dependa só do menu.
  const relations: Record<string, string[]> = {
    'criacao-de-sites': ['landing-pages', 'lojas-virtuais', 'desenvolvimento-de-sistemas'],
    'desenvolvimento-de-sistemas': ['automacao-e-integracoes', 'criacao-de-sites'],
    'landing-pages': ['criacao-de-sites', 'lojas-virtuais'],
    'lojas-virtuais': ['criacao-de-sites', 'automacao-e-integracoes'],
    'automacao-e-integracoes': ['desenvolvimento-de-sistemas', 'lojas-virtuais'],
  }

  for (const [slug, related] of Object.entries(relations)) {
    await payload.update({
      collection: 'services',
      id: serviceIds[slug],
      context: ctx,
      draft: true,
      data: { relatedServices: related.map((r) => serviceIds[r]).filter(Boolean) } as never,
    })
  }
  console.log(`Serviços: ${Object.keys(serviceIds).length} (todos como RASCUNHO)`)

  // ── Localização ───────────────────────────────────────────────────────────
  const locations = [
    {
      slug: 'sao-luis-ma',
      locationSlug: 'sao-luis-ma',
      isHub: true,
      title: 'Desenvolvimento de Sites e Sistemas em São Luís, MA',
      description:
        'A GSR Sistemas fica em São Luís, no Maranhão, e desenvolve sites, sistemas e soluções digitais para empresas da cidade e de todo o Brasil.',
      hero: {
        headline: 'Desenvolvimento de Sites e Sistemas em São Luís, MA',
        subheadline:
          'Somos uma empresa de São Luís. Atendemos empresas daqui de perto e clientes de todo o Brasil a distância.',
      },
      localContent: [
        paragraph(
          'A GSR Sistemas é uma empresa de desenvolvimento de sites, sistemas e soluções digitais sob medida com sede em São Luís, no Maranhão.',
        ),
        heading('Trabalhar com uma empresa daqui'),
        paragraph(
          'Estar na mesma cidade muda coisas práticas: mesmo fuso, mesma noção de calendário local, possibilidade de conversar pessoalmente quando o projeto pede, e entendimento de como o mercado daqui funciona. Não é o fator mais importante na escolha de um fornecedor, mas ajuda.',
        ),
        heading('E atendimento para o resto do Brasil'),
        paragraph(
          'Boa parte do trabalho é conduzida a distância, com o mesmo acompanhamento e as mesmas entregas. Estar em São Luís nunca foi limitação de alcance.',
        ),
      ],
      serviceAreas: [
        'São Luís', 'São José de Ribamar', 'Paço do Lumiar', 'Raposa', 'Imperatriz',
        'Timon', 'Caxias', 'Bacabal', 'Santa Inês', 'Todo o Maranhão',
      ],
      relatedServices: ['criacao-de-sites', 'desenvolvimento-de-sistemas'],
    },
    {
      slug: 'criacao-de-sites',
      locationSlug: 'sao-luis-ma',
      isHub: false,
      service: 'criacao-de-sites',
      title: 'Criação de Sites em São Luís, MA',
      description:
        'Criação de sites profissionais para empresas de São Luís e do Maranhão, com foco em desempenho e em aparecer na busca local.',
      hero: {
        headline: 'Criação de Sites em São Luís, MA',
        subheadline:
          'Sites para empresas de São Luís que precisam ser encontradas por quem procura na cidade — e convencer quem chega.',
      },
      localContent: [
        paragraph(
          'Quem procura fornecedor em São Luís normalmente pesquisa com a cidade junto: "criação de sites em São Luís", "empresa de sites São Luís". A empresa que aparece nessas buscas recebe contato de quem já decidiu comprar e só está escolhendo de quem.',
        ),
        heading('Aparecer na busca local não é o mesmo que ter um site'),
        paragraph(
          'Aparecer para buscas com nome de cidade depende de coisas específicas: informações de contato consistentes entre o site e o perfil no Google, conteúdo que fale do mercado local de verdade, e estrutura técnica que permita ao buscador entender onde a empresa atua. Ter um site bonito não produz isso sozinho.',
        ),
        heading('Empresas de São Luís que costumam procurar um site'),
        paragraph(
          'Prestadores de serviço que hoje dependem só de indicação e de rede social, comércios que precisam ser encontrados por quem pesquisa no celular, e empresas que já têm um site antigo — lento, difícil de atualizar, ou que simplesmente não aparece.',
        ),
        heading('Presencial quando ajuda, remoto quando é mais prático'),
        paragraph(
          'Estar na mesma cidade permite conversar pessoalmente nas etapas em que isso rende mais, como o entendimento inicial. O restante costuma andar melhor a distância, sem deslocamento para ninguém.',
        ),
      ],
      serviceAreas: ['São Luís', 'São José de Ribamar', 'Paço do Lumiar', 'Raposa'],
      relatedServices: ['criacao-de-sites', 'landing-pages'],
    },
    {
      slug: 'desenvolvimento-de-sistemas',
      locationSlug: 'sao-luis-ma',
      isHub: false,
      service: 'desenvolvimento-de-sistemas',
      title: 'Desenvolvimento de Sistemas em São Luís, MA',
      description:
        'Sistemas sob medida para empresas de São Luís e do Maranhão: painéis, portais, automações e integrações.',
      hero: {
        headline: 'Desenvolvimento de Sistemas em São Luís, MA',
        subheadline:
          'Sistemas construídos em torno do processo da sua empresa, feitos por quem está na mesma cidade que você.',
      },
      localContent: [
        paragraph(
          'Empresa que cresce em São Luís chega ao mesmo ponto que empresa que cresce em qualquer lugar: a planilha para de dar conta, a informação se espalha e alguém passa a semana consolidando dado à mão.',
        ),
        heading('Contratar desenvolvimento de sistemas localmente'),
        paragraph(
          'Sistema sob medida exige entender o processo da empresa a fundo, e isso normalmente envolve conversar com quem executa esse processo todo dia. Estar na mesma cidade torna essas conversas mais fáceis de marcar — especialmente na fase de levantamento, que é onde o projeto é ganho ou perdido.',
        ),
        heading('O que costuma ser pedido por aqui'),
        paragraph(
          'Controle de operação interna, painéis para acompanhar números sem depender de planilha, áreas de acesso para clientes ou equipe, e integração entre sistemas que a empresa já usa e que hoje não se falam.',
        ),
        heading('Manutenção depois da entrega'),
        paragraph(
          'Sistema não termina quando é publicado. Ter quem construiu por perto facilita ajuste, correção e evolução — que sempre aparecem quando o uso real começa.',
        ),
      ],
      serviceAreas: ['São Luís', 'São José de Ribamar', 'Paço do Lumiar', 'Todo o Maranhão'],
      relatedServices: ['desenvolvimento-de-sistemas', 'automacao-e-integracoes'],
    },
  ]

  for (const loc of locations) {
    const { localContent, relatedServices, service, serviceAreas, ...rest } = loc

    const data = {
      ...rest,
      city: 'São Luís',
      state: 'Maranhão',
      stateCode: 'MA',
      localContent: richText(localContent),
      serviceAreas: serviceAreas.map((name) => ({ name })),
      relatedServices: relatedServices.map((s) => serviceIds[s]).filter(Boolean),
      ...(service ? { service: serviceIds[service] } : {}),
      seo: { index: true, follow: true },
      _status: 'draft',
    }

    const existing = await payload.find({
      collection: 'locations',
      where: {
        and: [{ locationSlug: { equals: loc.locationSlug } }, { slug: { equals: loc.slug } }],
      },
      limit: 1,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'locations',
        id: existing.docs[0].id,
        context: ctx,
        data: data as never,
        draft: true,
      })
      console.log(`  atualizado: /${loc.locationSlug}${loc.isHub ? '' : '/' + loc.slug}`)
    } else {
      await payload.create({
        collection: 'locations',
        context: ctx,
        data: data as never,
        draft: true,
      })
      console.log(`  criado: /${loc.locationSlug}${loc.isHub ? '' : '/' + loc.slug}`)
    }
  }
  console.log(`Localizações: ${locations.length} (todas como RASCUNHO)`)

  console.log('\nTudo entrou como RASCUNHO. Revise no painel e publique o que aprovar.')
  console.log('Nenhum número, prazo, preço, cliente ou depoimento foi criado.')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
