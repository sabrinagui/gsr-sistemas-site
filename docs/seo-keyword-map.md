# Mapa de keywords — GSR Sistemas

FASE 2. Documento para aprovação.

---

## Aviso sobre dados

**Este documento não contém volume de busca, dificuldade ou CPC.** Não tenho acesso a nenhuma fonte confiável desses números para o mercado brasileiro, e estimá-los seria inventar dado — algo que você pediu explicitamente para não acontecer.

O que existe aqui é o que dá para determinar com rigor sem ferramenta paga: **a intenção por trás de cada termo, a página que deve respondê-la e a fronteira entre elas**. É essa parte que define a arquitetura, e ela não muda quando os volumes chegarem.

Quando você fornecer o export de Consultas do Search Console e, se houver, um export de Ahrefs, Semrush ou Keyword Planner, a coluna de volume entra e a **priorização** é revisada. O mapeamento termo → página tende a permanecer.

Coloque os arquivos em `docs/data/` — ver `docs/data/README.md`.

---

## 1. Uma página, uma intenção

A regra que organiza todo o mapa:

> Cada intenção de busca tem exatamente uma página responsável por ela. Nenhuma página é responsável por duas intenções comerciais distintas.

Termo sem página responsável é trabalhado dentro da página do termo mais próximo, como seção. Termo com duas candidatas é resolvido antes de escrever, não depois de publicar.

Cada página tem **um** termo primário. Os secundários são variações da mesma intenção — aparecem no texto e nos H2, mas não ganham título, meta description nem URL própria.

---

## 2. Grupo comercial nacional

### `/criacao-de-sites`

| | |
|---|---|
| **Termo primário** | criação de sites |
| **Intenção** | Comercial — contratar quem faça |
| **Secundários** | criação de sites profissionais · empresa de criação de sites · desenvolvimento de sites · criação de site para empresa · sites empresariais · desenvolvimento web |
| **H1** | Criação de Sites Profissionais |
| **Title** | Criação de Sites Profissionais \| GSR Sistemas |
| **Concorrência interna** | `/sao-luis-ma/criacao-de-sites` — separadas por qualificador geográfico (seção 5) |
| **Linka para** | `/portfolio`, `/sao-luis-ma/criacao-de-sites`, `/landing-pages`, artigos de custo e prazo |

"Empresa de criação de sites" é a mesma intenção de "criação de sites" — quem busca as duas quer contratar. Não gera página separada; é trabalhada no H2 "Por que a GSR" e no schema `Organization`.

### `/desenvolvimento-de-sistemas`

| | |
|---|---|
| **Termo primário** | desenvolvimento de sistemas |
| **Intenção** | Comercial |
| **Secundários** | desenvolvimento de sistemas sob medida · sistemas personalizados · sistemas personalizados para empresas · desenvolvimento de sistemas web · software personalizado · desenvolvimento de plataformas web · desenvolvimento de software sob medida |
| **H1** | Desenvolvimento de Sistemas Sob Medida |
| **Title** | Desenvolvimento de Sistemas Sob Medida \| GSR Sistemas |
| **Estrutura interna** | H2 dedicados a: sistemas web · sistemas sob medida · dashboards · portais · CRM · integrações · MVP |
| **Linka para** | `/automacao-e-integracoes`, `/sao-luis-ma/desenvolvimento-de-sistemas`, artigos de custo, prazo e "o que é sistema sob medida" |

**Sete termos, uma página — decisão aprovada.** "Desenvolvimento de sistemas", "sistemas sob medida", "sistemas personalizados" e "sistemas web" descrevem a mesma decisão de compra. Separá-los em quatro URLs criaria quatro textos que se distinguem só pelo sinônimo.

`/desenvolvimento-de-sistemas` é a página principal para todos eles. **Não serão criadas páginas separadas por sinônimo** — nem agora, nem depois, salvo se um dos termos revelar intenção genuinamente distinta nos dados do Search Console. Justificativa completa em `information-architecture.md`, seção 4.1.

### `/landing-pages`

| | |
|---|---|
| **Termo primário** | criação de landing page |
| **Intenção** | Comercial |
| **Secundários** | landing page profissional · página de captura · landing page para anúncios · criação de landing pages |
| **H1** | Criação de Landing Pages que Convertem |
| **Fronteira** | Landing page = página única para campanha. Site institucional = presença permanente. O artigo "Site institucional ou landing page" existe justamente para capturar quem ainda não decidiu |

### `/lojas-virtuais`

| | |
|---|---|
| **Termo primário** | criação de loja virtual |
| **Intenção** | Comercial |
| **Secundários** | desenvolvimento de e-commerce · criar loja virtual · loja online para empresa · desenvolvimento de loja virtual |
| **H1** | Criação de Lojas Virtuais |
| **Plataformas** | **Shopify** e **WooCommerce** — definido |

Com as plataformas definidas, a página ganha substância real em vez de falar de e-commerce em abstrato. Estrutura prevista:

- H2 "Loja virtual em Shopify" — quando faz sentido: operação rápida, sem servidor para administrar, ecossistema de apps, custo mensal previsível
- H2 "Loja virtual em WooCommerce" — quando faz sentido: controle total, integração com sistemas próprios, sem taxa por transação da plataforma, domínio sobre os dados
- H2 "Qual escolher para o seu caso" — critérios objetivos, sem empurrar um dos dois

Ambas entram na collection `Technologies` e aparecem no bloco de tecnologias da página.

Essa seção comparativa é também a base natural de um artigo futuro ("Shopify ou WooCommerce"), que fica registrado como pauta candidata em `content-plan.md`.

### `/automacao-e-integracoes`

| | |
|---|---|
| **Termos primários** | automação de processos · integração de sistemas |
| **Intenção** | Comercial |
| **Secundários** | automação de processos empresariais · integração de APIs · integração entre sistemas · automatizar processos da empresa |
| **H1** | Automação de Processos e Integração de Sistemas |
| **Observação** | Única página com dois primários. São dois termos que a mesma empresa busca no mesmo momento e para o mesmo problema — separá-los criaria duas páginas com o mesmo texto. H2 distintos para cada um dentro da página |

### `/servicos`

Hub navegacional, sem termo comercial primário. Existe para o usuário e para distribuir autoridade. Title: `Serviços | GSR Sistemas`. **Não** compete por "criação de sites" nem por "desenvolvimento de sistemas".

### `/`

Termo de marca: `GSR Sistemas`. O papel da home é comunicar posicionamento, distribuir para os serviços e converter.

**A home fala de criação de sites com naturalidade — a keyword principal continua em `/criacao-de-sites`.** Na prática, a diferença está em onde o termo aparece:

| | Home | `/criacao-de-sites` |
|---|---|---|
| H1 | Sites e sistemas sob medida para empresas que querem crescer | Criação de Sites Profissionais |
| Title | GSR Sistemas — Sites e Sistemas Sob Medida em São Luís, MA | Criação de Sites Profissionais \| GSR Sistemas |
| Meta description | posicionamento e abrangência | serviço de criação de sites |
| "criação de sites" | no texto, nos cards de serviço e nos links internos, onde for natural | no title, no H1, na description e ao longo do conteúdo |

Ou seja: o termo aparece na home porque é o que a GSR faz e omiti-lo soaria artificial. O que a home não faz é **disputar** o termo — não coloca "criação de sites" no title nem no H1, e sempre linka para a página de serviço com âncora descritiva.

Otimizar as duas para o mesmo termo no title e no H1 é a canibalização mais comum e mais cara que existe, e é exatamente o que o site atual faz hoje.

---

## 3. Termos comerciais sem página própria — e onde vivem

| Termo | Onde é atendido | Por que não tem página |
|---|---|---|
| desenvolvimento de MVP | H2 em `/desenvolvimento-de-sistemas` | Vira `/desenvolvimento-de-sistemas/mvp` quando houver conteúdo próprio. Intenção genuinamente distinta, público distinto |
| dashboards personalizados | H2 em `/desenvolvimento-de-sistemas` | Vira página junto com o artigo de dashboard e um case |
| desenvolvimento de portais | H2 em `/desenvolvimento-de-sistemas` | Intenção estreita, sem case |
| CRM personalizado | H2 em `/desenvolvimento-de-sistemas` | Só vira página se a GSR posicionar isso como oferta |
| site institucional | H2 em `/criacao-de-sites` | Vira `/criacao-de-sites/sites-institucionais` com conteúdo próprio |
| site corporativo | Mesmo H2 acima | Sinônimo comercial de "site institucional" |
| sites em Next.js | Seção "Tecnologia" em `/criacao-de-sites` + artigo | Intenção informacional, de desenvolvedor. Não é busca de contratação |
| manutenção de sites | Seção em `/servicos` + etapa no processo dos serviços | **Fora do lançamento** por decisão. Vira página quando o escopo vendido for definido |
| UI/UX design | Seção em `/servicos` + etapa no processo dos serviços | **Fora do lançamento** por decisão. Idem |

Quando um desses virar página, ele **sai** da página-mãe como bloco principal e passa a ser um parágrafo com link. Nunca ficam os dois textos completos.

---

## 4. Grupo local

Todos apontam para São Luís/MA.

### `/sao-luis-ma/criacao-de-sites` — prioridade máxima do projeto

| | |
|---|---|
| **Termo primário** | criação de sites em São Luís |
| **Secundários** | empresa de criação de sites em São Luís · desenvolvimento de sites em São Luís · criação de sites São Luís MA · criação de sites Maranhão · criação de site em São Luís |
| **H1** | Criação de Sites em São Luís, MA |
| **Title** | Criação de Sites em São Luís, MA \| GSR Sistemas |
| **Origem** | Recebe 301 de `/2024/12/23/criacao-de-sites-em-sao-luis/` — a única URL do site atual com autoridade construída para intenção comercial local |

É a página que mais importa no lançamento. O conteúdo do post legado é o ponto de partida, ampliado com contexto local real.

**"Criação de sites Maranhão"** é atendido aqui, não em página própria. Estado e capital são a mesma intenção quando a empresa está na capital. Uma `/maranhao/criacao-de-sites` seria doorway page.

### `/sao-luis-ma/desenvolvimento-de-sistemas`

| | |
|---|---|
| **Termo primário** | desenvolvimento de sistemas em São Luís |
| **Secundários** | sistemas personalizados São Luís · desenvolvimento de sistemas Maranhão · software sob medida São Luís · empresa de sistemas São Luís |
| **H1** | Desenvolvimento de Sistemas em São Luís, MA |
| **Alerta** | Não há conteúdo legado. Precisa ser escrito do zero, com contexto local real. Não pode ser a página nacional com "São Luís" inserido |

### `/sao-luis-ma`

| | |
|---|---|
| **Termo primário** | empresa de software em São Luís |
| **Secundários** | desenvolvimento web São Luís · agência de desenvolvimento São Luís · empresa de tecnologia São Luís · empresa de TI São Luís |
| **H1** | Desenvolvimento de Sites e Sistemas em São Luís, MA |
| **Papel** | Hub local. Apresenta a GSR como empresa de São Luís e distribui para as páginas locais de serviço. Deixa explícito o atendimento nacional |

### Diferidas

| URL | Termo | Condição para existir |
|---|---|---|
| `/sao-luis-ma/landing-pages` | landing page São Luís | Case ou demanda local |
| `/sao-luis-ma/lojas-virtuais` | loja virtual São Luís | Case ou demanda local |

Esses dois termos ficam sem página responsável no lançamento — e isso é intencional. São mencionados no hub `/sao-luis-ma`, que passa a ser a página que o Google pode ranquear para eles até que valham página própria.

---

## 5. Como nacional e local convivem sem se canibalizar

O risco é real: `/criacao-de-sites` e `/sao-luis-ma/criacao-de-sites` tratam do mesmo serviço.

O que os separa é o **qualificador geográfico na consulta**, e o conteúdo tem que refletir isso:

| | Nacional | Local |
|---|---|---|
| Consulta | criação de sites | criação de sites **em São Luís** |
| Title | sem cidade | com "São Luís, MA" |
| H1 | sem cidade | com "São Luís, MA" |
| Conteúdo | processo, tipos de site, tecnologia, prazos | mercado local, clientes de São Luís, atendimento presencial ou remoto, cases locais |
| Canonical | própria | própria |
| Schema | `Service` | `Service` + `areaServed` |

Regras de execução:

1. **A página local não repete a nacional.** Nenhum parágrafo é reaproveitado. Se as duas dizem a mesma coisa, uma delas não deveria existir.
2. **A nacional não menciona São Luís no title nem no H1.** Menciona no texto e linka para a local.
3. **A local linka para a nacional** como referência de serviço, com âncora descritiva.
4. **A cidade aparece onde é natural** — H1, primeiro parágrafo, seção local, FAQ. Não em todo H2.

**Monitoramento pós-lançamento:** se as duas páginas aparecerem na mesma consulta no Search Console, ou se a local ranquear para a busca sem cidade, há sobreposição e o conteúdo é ajustado. Verificação em 30, 60 e 90 dias.

---

## 6. Grupo informacional — blog

Os dez artigos do briefing, com o alvo comercial e o link obrigatório de cada um. Nenhum tem termo comercial como alvo primário.

| # | Keyword | Título | URL | Intenção | Serviço linkado |
|---|---|---|---|---|---|
| 1 | quanto custa criar um site | Quanto custa criar um site profissional? | `/blog/quanto-custa-criar-um-site` | Comercial-investigativa | `/criacao-de-sites` |
| 2 | quanto custa desenvolver um sistema | Quanto custa desenvolver um sistema sob medida? | `/blog/quanto-custa-desenvolver-um-sistema` | Comercial-investigativa | `/desenvolvimento-de-sistemas` |
| 3 | site WordPress ou Next.js | WordPress ou Next.js: qual escolher para seu site? | `/blog/wordpress-ou-nextjs` | Comparativa | `/criacao-de-sites` |
| 4 | sistema pronto ou personalizado | Sistema pronto ou sob medida: qual escolher? | `/blog/sistema-pronto-ou-sob-medida` | Comparativa | `/desenvolvimento-de-sistemas` |
| 5 | quanto tempo demora para criar um site | Quanto tempo leva para desenvolver um site? | `/blog/quanto-tempo-para-criar-um-site` | Informacional | `/criacao-de-sites` |
| 6 | quanto tempo leva para desenvolver um sistema | Quanto tempo leva para desenvolver um sistema? | `/blog/quanto-tempo-para-desenvolver-um-sistema` | Informacional | `/desenvolvimento-de-sistemas` |
| 7 | o que é sistema sob medida | O que é um sistema sob medida e quando vale a pena? | `/blog/o-que-e-sistema-sob-medida` | Informacional | `/desenvolvimento-de-sistemas` |
| 8 | como escolher empresa criação de sites | Como escolher uma empresa para criar seu site | `/blog/como-escolher-empresa-para-criar-site` | Comercial-investigativa | `/criacao-de-sites` |
| 9 | site institucional ou landing page | Site institucional ou landing page: qual sua empresa precisa? | `/blog/site-institucional-ou-landing-page` | Comparativa | `/criacao-de-sites` + `/landing-pages` |
| 10 | o que é MVP | O que é um MVP e quando desenvolver um? | `/blog/o-que-e-mvp` | Informacional | `/desenvolvimento-de-sistemas` |

**Sobre o título 1.** O briefing sugeria "…em 2026". Ano no título obriga a reescrever todo ano e a URL fica datada. Recomendo o título sem ano e o ano no `dateModified` e na primeira linha do texto. Se preferir com ano, o slug permanece sem ele.

**Nota de risco no artigo 8.** "Como escolher uma empresa para criar seu site" chega perto de "empresa de criação de sites", que é comercial e pertence a `/criacao-de-sites`. Mitigação: o artigo é escrito como critério de avaliação — o que perguntar, o que exigir, o que evitar — e não como argumento de venda da GSR. O CTA aparece só no fim.

---

## 7. Posts legados no mapa

| Post legado | Nova URL | Alvo após revisão | Conflito |
|---|---|---|---|
| Criação de sites em São Luís | `/sao-luis-ma/criacao-de-sites` | criação de sites em São Luís | — |
| Por que ter um site profissional | `/blog/por-que-ter-um-site-profissional` | por que ter um site profissional | Baixo |
| Tendências em criação de sites 2024 | `/blog/tendencias-em-criacao-de-sites` | tendências em criação de sites | Baixo. Reescrever como evergreen |
| Por que investir em sistemas personalizados | `/blog/por-que-investir-em-sistemas-personalizados` | por que investir em sistema personalizado | **Médio** — ver abaixo |
| 7 erros que matam as vendas do site | `/blog/erros-que-prejudicam-as-vendas-do-seu-site` | erros que prejudicam vendas do site | Baixo |
| SEO local para triplicar clientes | `/blog/seo-local-para-empresas` | seo local para empresas | Baixo. Reescrever o título |
| Dashboard em sistema web | `/blog/dashboard-em-sistemas-web` | dashboard em sistema web | Baixo |

**Conflito a resolver antes de republicar:** "Por que investir em sistemas personalizados" usa "sistemas personalizados", que é secundário de `/desenvolvimento-de-sistemas`. Na revisão, o artigo precisa se posicionar como **quando faz sentido e quando não faz** — conteúdo de decisão — e não como venda de sistema personalizado. O termo comercial permanece com a página de serviço.

---

## 8. Termos de marca

| Termo | Página | Observação |
|---|---|---|
| GSR Sistemas | `/` | Nome oficial e único |
| GSR Sistemas São Luís | `/` e `/sao-luis-ma` | |
| GSR Sites e Sistemas | `/` | Variação legada, ainda usada em avaliações do Google. Não usar no site, mas reconhecer |
| GSR Sistemas contato / telefone | `/contato` | |

O site atual alterna entre três nomes, o que dispersa a entidade. A partir daqui, **GSR Sistemas** em todos os lugares: site, schema, Google Business Profile, redes, assinaturas.

---

## 9. Lacunas — para revisar quando os dados chegarem

Termos que provavelmente têm busca real e hoje não têm página responsável:

- criação de sites preço / valor
- desenvolvimento de aplicativos, aplicativo sob medida — **a GSR presta esse serviço?** Se sim, é uma lacuna relevante na arquitetura
- sistema de gestão para [segmento]
- site para clínica, advogado, restaurante — vertical por segmento. Só se houver cases
- manutenção de site mensal
- migração de site WordPress

Nenhum vira página agora. Entram na revisão depois do export do Search Console.

---

## 10. Prioridade de execução

| Prioridade | Página | Motivo |
|---|---|---|
| 1 | `/sao-luis-ma/criacao-de-sites` | Recebe o 301 de maior valor. Menor concorrência, maior intenção de compra |
| 2 | `/criacao-de-sites` | Termo comercial central |
| 3 | `/desenvolvimento-de-sistemas` | Serviço de maior ticket |
| 4 | `/` | Distribui autoridade para tudo |
| 5 | `/sao-luis-ma` | Sustenta o cluster local |
| 6 | `/sao-luis-ma/desenvolvimento-de-sistemas` | Local + alto ticket |
| 7 | `/sobre` | E-E-A-T |
| 8 | `/landing-pages`, `/lojas-virtuais`, `/automacao-e-integracoes` | |
| 9 | Artigos 1 e 2 (custo) | Maior potencial de tráfego qualificado |
| 10 | Demais artigos | Conforme `content-plan.md` |

A prioridade é local antes de nacional. É contraintuitivo, mas é onde a GSR tem chance real de ranquear no primeiro ano, e é de onde vem lead qualificado mais cedo.

---

## 11. Verificação antes de publicar qualquer página

1. Qual é o termo primário desta página?
2. Alguma outra página já tem esse termo como primário ou secundário?
3. A intenção é comercial, informacional ou navegacional?
4. Se comercial: é serviço ou local?
5. Que páginas linkam para ela? Pelo menos duas, de dentro do conteúdo?
6. Para quais páginas ela linka?
7. O conteúdo responde à intenção ou só menciona o termo?

Falhou em qualquer uma, não publica.
