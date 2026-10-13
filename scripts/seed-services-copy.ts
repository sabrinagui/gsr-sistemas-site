/**
 * Copy de venda das páginas de serviço.
 *
 *   npm run seed:services
 *
 * Reescreve os textos dos 5 serviços no tom da home: começa pela dor do
 * cliente, sem travessão, com as palavras-chave no início do título. O campo
 * `title` (usado no <title> e no schema) não muda; muda o título visível
 * (hero.headline), a abertura, o texto, o escopo, os benefícios e o processo.
 */

export {}

type LexNode = Record<string, unknown>

const text = (value: string): LexNode => ({ type: 'text', text: value, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })
const paragraph = (value: string): LexNode => ({ type: 'paragraph', children: [text(value)], direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0 })
const heading = (value: string): LexNode => ({ type: 'heading', tag: 'h2', children: [text(value)], direction: 'ltr', format: '', indent: 0, version: 1 })

/** Primeiro item é o parágrafo de abertura; depois, pares [subtítulo, parágrafo]. */
const richText = (lead: string, sections: [string, string][]) => ({
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [paragraph(lead), ...sections.flatMap(([h, p]) => [heading(h), paragraph(p)])],
  },
})

type Item = { title: string; description: string }
type Copy = {
  description: string
  headline: string
  subheadline: string
  lead: string
  sections: [string, string][]
  features: Item[]
  benefits: Item[]
  process: Item[]
  cta: { title: string; description: string }
}

const COPY: Record<string, Copy> = {
  'criacao-de-sites': {
    description: 'Sites profissionais feitos sob medida para carregar rápido, aparecer no Google e transformar visita em contato.',
    headline: 'Criação de sites profissionais que trazem cliente, não só visita.',
    subheadline:
      'Seu site é o primeiro contato de muita gente com a sua empresa. Fazemos ele abrir rápido, passar confiança em segundos e levar a pessoa direto para o WhatsApp.',
    lead: 'Ninguém lê um site inteiro antes de decidir. Nos primeiros segundos a pessoa já sabe se confia na sua empresa ou se volta para o Google e clica no concorrente. É nesses segundos que o seu site precisa trabalhar.',
    sections: [
      [
        'O que separa um site que vende de um que só existe',
        'Três coisas. Velocidade: página lenta perde o visitante antes de mostrar qualquer coisa, principalmente no celular, de onde vem a maior parte das visitas. Clareza: em poucos segundos a pessoa precisa entender o que você faz e qual é o próximo passo. E ser encontrado: aparecer no Google depende de estrutura técnica bem feita, não de sorte.',
      ],
      [
        'Sob medida, não montado em template',
        'Template pronto parece economia até o dia em que você precisa de algo que ele não prevê. Aí vem o contorno, o plugin a mais e o site cada vez mais lento. Aqui o site é desenhado para o que a sua empresa precisa mostrar e cresce junto com ela.',
      ],
      [
        'Feito para o Google desde a primeira linha',
        'Velocidade, títulos, endereços de página, dados estruturados e versão de celular são decididos durante a construção. Deixar isso para depois custa mais caro e funciona pior.',
      ],
      [
        'Para quem é',
        'Empresas e profissionais que precisam apresentar o que fazem com credibilidade: escritórios, clínicas, prestadores de serviço, indústrias e negócios que vendem por catálogo ou por orçamento.',
      ],
    ],
    features: [
      { title: 'Estrutura pensada para vender', description: 'Páginas e seções definidas a partir do que o seu cliente procura e precisa ver para decidir.' },
      { title: 'Design exclusivo', description: 'Layout criado para a sua marca, sem cara de modelo pronto.' },
      { title: 'Código rápido e leve', description: 'Imagens otimizadas e conteúdo que o Google consegue ler.' },
      { title: 'Painel para editar', description: 'Você troca textos, fotos e publica novidades sem depender de ninguém.' },
      { title: 'Formulários e WhatsApp', description: 'Pedidos de contato e orçamento chegando direto para você.' },
      { title: 'Publicação completa', description: 'Domínio, certificado de segurança, Google Search Console e medição de acessos configurados.' },
    ],
    benefits: [
      { title: 'Abre rápido', description: 'Visitante não espera. Página leve segura quem chegou pelo Google ou por um anúncio.' },
      { title: 'Aparece no Google', description: 'Estrutura técnica correta para ser encontrado por quem procura o que você faz.' },
      { title: 'Perfeito no celular', description: 'Desenhado primeiro para a tela pequena, de onde vem a maior parte das visitas.' },
      { title: 'Você no controle', description: 'Domínio no seu nome e painel próprio para atualizar quando quiser.' },
    ],
    process: [
      { title: 'Conversa', description: 'Entendemos o seu negócio, o seu cliente e o que o site precisa resolver.' },
      { title: 'Estrutura', description: 'Definimos as páginas e o conteúdo de cada uma.' },
      { title: 'Design', description: 'Você vê e aprova o visual antes de qualquer programação.' },
      { title: 'Desenvolvimento', description: 'Construção com entregas que você acompanha.' },
      { title: 'Testes', description: 'Celular, computador, velocidade e formulários conferidos um a um.' },
      { title: 'Lançamento', description: 'Site no ar, configurado no Google e com suporte depois.' },
    ],
    cta: {
      title: 'Seu concorrente já está no Google. Vamos colocar você na frente?',
      description: 'Conte o que sua empresa faz e receba uma proposta com escopo, prazo e valor fechados.',
    },
  },

  'lojas-virtuais': {
    description: 'Lojas virtuais em Shopify ou WooCommerce, com pagamento, frete e catálogo prontos para vender.',
    headline: 'Criação de lojas virtuais prontas para vender todos os dias.',
    subheadline:
      'Catálogo bonito é só o começo. Montamos a loja com pagamento, frete e estoque funcionando, na plataforma certa para a sua operação: Shopify ou WooCommerce.',
    lead: 'Vender online vai muito além de colocar produtos numa página. Envolve estoque, frete, pagamento, nota fiscal e o atendimento depois da compra. Uma loja bem feita resolve tudo isso sem dor de cabeça para você e sem atrito para quem compra.',
    sections: [
      [
        'Shopify: para vender rápido, sem se preocupar com servidor',
        'A plataforma cuida da infraestrutura, da segurança e das atualizações. O custo é mensal e previsível, e existe um aplicativo para quase toda necessidade. Ideal para quem quer abrir as portas logo e focar em vender.',
      ],
      [
        'WooCommerce: para quem precisa de controle total',
        'Sem taxa da plataforma por venda, com os dados sob seu controle e liberdade para integrar com sistemas próprios ou criar regras de preço e frete fora do padrão. Pede hospedagem e manutenção, que a GSR pode cuidar para você.',
      ],
      [
        'Como escolhemos a plataforma certa',
        'Operação simples e pressa para vender apontam para Shopify. Integrações, regras próprias e volume alto de vendas apontam para WooCommerce. A decisão é feita na primeira conversa, olhando a sua operação, e você recebe o motivo por escrito.',
      ],
    ],
    features: [
      { title: 'Plataforma certa para você', description: 'Shopify ou WooCommerce, escolhida pela sua operação e não por hábito.' },
      { title: 'Catálogo organizado', description: 'Categorias, produtos e variações estruturados para facilitar a compra e a busca.' },
      { title: 'Pagamento e frete', description: 'Pix, cartão, boleto e regras de envio configurados e testados.' },
      { title: 'Design da marca', description: 'Loja com a cara da sua empresa, da vitrine ao checkout.' },
      { title: 'Treinamento', description: 'Sua equipe aprende a cadastrar produtos e acompanhar pedidos.' },
    ],
    benefits: [
      { title: 'Pronta para vender', description: 'Compra testada de ponta a ponta antes da inauguração.' },
      { title: 'Encontrada no Google', description: 'Produtos e categorias estruturados para aparecer nas buscas.' },
      { title: 'Autonomia no dia a dia', description: 'Cadastro, preço e pedidos ficam com a sua equipe.' },
    ],
    process: [
      { title: 'Diagnóstico', description: 'Como você vende, entrega e cobra hoje.' },
      { title: 'Plataforma', description: 'Shopify ou WooCommerce, com o motivo explicado.' },
      { title: 'Montagem', description: 'Catálogo, pagamento, frete e design.' },
      { title: 'Testes', description: 'Compra de ponta a ponta antes de abrir.' },
      { title: 'Inauguração', description: 'Loja no ar, com medição de vendas configurada.' },
    ],
    cta: {
      title: 'Pronto para vender online de verdade?',
      description: 'Conte sobre seus produtos e receba uma proposta com escopo, prazo e valor fechados.',
    },
  },

  'landing-pages': {
    description: 'Landing pages para campanhas, com um objetivo só: transformar quem clicou no anúncio em contato.',
    headline: 'Landing pages que transformam clique em cliente.',
    subheadline:
      'Uma página, um objetivo. Sem distração, com o argumento na ordem certa e carregando rápido, para cada real investido em anúncio voltar em contato.',
    lead: 'Quem clica no seu anúncio chega com uma expectativa. Se cai numa página genérica, precisa procurar o que veio buscar, e cada segundo de procura é gente desistindo. Em campanha paga, cada desistência é dinheiro jogado fora.',
    sections: [
      [
        'Landing page não é site',
        'O site apresenta a empresa inteira. A landing page existe para uma campanha e uma única ação: pedir orçamento, se inscrever, agendar ou comprar. Sem menu e sem caminho paralelo.',
      ],
      [
        'Velocidade é dinheiro',
        'A maior parte do tráfego de anúncio vem do celular, muitas vezes com internet instável. Página pesada consome o investimento antes de mostrar a oferta. Por isso as nossas são leves de verdade.',
      ],
      [
        'Medição desde o primeiro dia',
        'Você sabe quantas pessoas chegaram, quantas começaram a preencher e quantas concluíram. Com esses números dá para otimizar a campanha em vez de adivinhar.',
      ],
    ],
    features: [
      { title: 'Argumento na ordem certa', description: 'O que a pessoa precisa ler, na sequência que leva à decisão.' },
      { title: 'Design focado em conversão', description: 'Um caminho só, do topo até o botão.' },
      { title: 'Formulário enxuto', description: 'Só os campos necessários, para ninguém desistir no meio.' },
      { title: 'Medição completa', description: 'Eventos configurados para acompanhar cada conversão.' },
    ],
    benefits: [
      { title: 'Mais conversão', description: 'Sem menu e sem distração, a atenção fica na oferta.' },
      { title: 'Anúncio que rende mais', description: 'Página rápida e relevante melhora o desempenho da campanha.' },
      { title: 'Decisão com dados', description: 'Você vê o que funciona e onde ajustar.' },
    ],
    process: [
      { title: 'Objetivo', description: 'Qual ação a página precisa gerar e para quem.' },
      { title: 'Argumento', description: 'O que dizer e em que ordem.' },
      { title: 'Design', description: 'Layout desenhado a partir do celular.' },
      { title: 'Publicação', description: 'Página no ar com medição configurada.' },
    ],
    cta: {
      title: 'Sua próxima campanha merece uma página à altura.',
      description: 'Conte o objetivo da campanha e receba uma proposta com prazo e valor fechados.',
    },
  },

  'desenvolvimento-de-sistemas': {
    description: 'Sistemas web sob medida: painéis, portais, automações e integrações construídos em torno do processo da sua empresa.',
    headline: 'Desenvolvimento de sistemas sob medida para a sua empresa crescer sem planilha.',
    subheadline:
      'Quando o processo da sua empresa é o diferencial dela, software genérico atrapalha. Construímos sistemas web que seguem o jeito que você já trabalha, com a informação certa na hora certa.',
    lead: 'Existe um momento em que a planilha para de dar conta. Os dados ficam espalhados, alguém passa horas consolidando tudo à mão e a informação importante só aparece quando já é tarde para agir. É nesse ponto que um sistema deixa de ser luxo e vira ferramenta de crescimento.',
    sections: [
      [
        'Feito em torno do seu processo',
        'Em vez de mudar a forma como a sua empresa trabalha para caber numa ferramenta pronta, o sistema é construído para o seu processo. Acesso pelo navegador, sem instalação, com cada pessoa vendo e fazendo só o que lhe cabe.',
      ],
      [
        'Painéis que respondem perguntas',
        'Um bom painel não é uma tela cheia de gráficos. É a resposta rápida para as perguntas que você faz todo dia, com o caminho do número até o detalhe quando algo chama atenção.',
      ],
      [
        'Portais e áreas de acesso',
        'Áreas para clientes, equipes ou parceiros consultarem dados, enviarem documentos e acompanharem solicitações, cada um com o seu nível de acesso.',
      ],
      [
        'Comece pequeno, cresça com segurança',
        'Quando a ideia ainda precisa ser validada, construir tudo de uma vez é o caminho mais caro. Começamos pelo que responde à pergunta principal (o MVP) e evoluímos com base no uso real.',
      ],
      [
        'Quando sob medida não é a resposta',
        'Se uma ferramenta pronta resolve bem o seu caso, ela sai mais barata e começa a funcionar mais rápido. Nós dizemos isso com franqueza. Sob medida vale quando o seu processo é específico o bastante para o pronto atrapalhar.',
      ],
    ],
    features: [
      { title: 'Levantamento do processo', description: 'Entendemos como o trabalho é feito hoje, incluindo as exceções.' },
      { title: 'Banco de dados bem pensado', description: 'Estrutura feita para crescer sem virar remendo.' },
      { title: 'Perfis de acesso', description: 'Cada pessoa vê e faz apenas o que lhe cabe.' },
      { title: 'Painéis e indicadores', description: 'Números que respondem às perguntas reais da operação.' },
      { title: 'Integrações', description: 'Conexão com os sistemas e serviços que a empresa já usa.' },
      { title: 'Treinamento e suporte', description: 'Publicação, treinamento da equipe e acompanhamento depois.' },
    ],
    benefits: [
      { title: 'Segue o seu processo', description: 'A ferramenta se adapta à empresa, não o contrário.' },
      { title: 'Menos trabalho manual', description: 'O que hoje é planilha e retrabalho vira etapa automática.' },
      { title: 'Informação na hora certa', description: 'O dado aparece quando ainda dá para agir sobre ele.' },
      { title: 'Cresce junto', description: 'O código é seu: o que precisar mudar depois, pode ser mudado.' },
    ],
    process: [
      { title: 'Levantamento', description: 'Como o processo funciona hoje, com as exceções.' },
      { title: 'Escopo', description: 'O que entra na primeira versão e o que fica para depois.' },
      { title: 'Modelagem', description: 'Estrutura de dados e regras de negócio.' },
      { title: 'Desenvolvimento', description: 'Construção em etapas que você acompanha.' },
      { title: 'Homologação', description: 'Uso com dados reais antes de valer para todos.' },
      { title: 'Operação', description: 'Publicação, treinamento e acompanhamento.' },
    ],
    cta: {
      title: 'Sua operação merece mais do que planilha.',
      description: 'Conte como funciona o seu processo e receba uma proposta com escopo, prazo e valor fechados.',
    },
  },

  'automacao-e-integracoes': {
    description: 'Automação de processos e integração de sistemas para eliminar retrabalho e erro de digitação.',
    headline: 'Automação de processos e integração de sistemas: menos retrabalho, mais resultado.',
    subheadline:
      'Se alguém da sua equipe passa o dia copiando informação de um sistema para outro, esse tempo está sendo desperdiçado. Conectamos o que você já usa e automatizamos o que é repetitivo.',
    lead: 'Quase toda empresa tem uma etapa que só existe porque dois sistemas não conversam. Alguém exporta uma planilha, ajusta e importa em outro lugar. Funciona, até o dia em que alguém erra uma linha ou sai de férias.',
    sections: [
      [
        'Automação de processos',
        'Automatizar é fazer o computador executar a sequência de passos que hoje alguém faz à mão: enviar e-mails quando algo acontece, gerar relatórios, atualizar status e conferir dados. Além de tempo, você ganha consistência, porque o processo passa a acontecer sempre do mesmo jeito.',
      ],
      [
        'Integração de sistemas',
        'Integrar é fazer o dado cadastrado uma vez aparecer em todos os lugares onde ele é necessário. Normalmente isso é feito pelas APIs que os sistemas já oferecem. Quando não existe API, avaliamos outros caminhos caso a caso.',
      ],
      [
        'O que automatizar primeiro',
        'Tarefas frequentes, repetitivas e com regra clara. Se acontece toda semana, segue sempre os mesmos passos e um erro nela causa prejuízo, é uma ótima candidata. O que depende de julgamento humano a cada caso continua com a sua equipe.',
      ],
    ],
    features: [
      { title: 'Mapeamento', description: 'Quais etapas existem hoje e quais podem sair das mãos da equipe.' },
      { title: 'Integração via API', description: 'Conexão entre os sistemas que a empresa já usa.' },
      { title: 'Rotinas automáticas', description: 'Tarefas recorrentes executadas sem intervenção.' },
      { title: 'Registro e alerta', description: 'Histórico do que rodou e aviso imediato quando algo falha.' },
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
    cta: {
      title: 'Quanto tempo a sua equipe perde com tarefa repetitiva?',
      description: 'Conte qual processo mais incomoda hoje e receba uma proposta para automatizá-lo.',
    },
  },
}

const run = async () => {
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  for (const [slug, copy] of Object.entries(COPY)) {
    const found = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const doc = found.docs[0]
    if (!doc) {
      console.log(`· ${slug}: não encontrado, pulado`)
      continue
    }
    await payload.update({
      collection: 'services',
      id: doc.id,
      data: {
        description: copy.description,
        hero: {
          ...(doc.hero ?? {}),
          headline: copy.headline,
          subheadline: copy.subheadline,
          primaryCtaLabel: 'Pedir proposta detalhada',
          primaryCtaHref: '/orcamento/',
          secondaryCtaLabel: null,
          secondaryCtaHref: null,
        },
        content: richText(copy.lead, copy.sections),
        features: copy.features,
        benefits: copy.benefits,
        process: copy.process,
        cta: { title: copy.cta.title, description: copy.cta.description, buttonLabel: 'Pedir proposta detalhada', buttonHref: '/orcamento/' },
        _status: 'published',
      } as never,
      context: { disableRevalidate: true },
    })
    console.log(`✓ ${slug}`)
  }
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
