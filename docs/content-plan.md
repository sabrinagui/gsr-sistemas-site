# Plano de conteúdo — GSR Sistemas

FASE 2. Documento para aprovação.

---

## 1. Princípios

1. **Qualidade acima de volume.** Quatro conteúdos por mês, no máximo. Melhor publicar dois bons do que quatro medianos.
2. **Todo conteúdo tem objetivo declarado antes de existir.** Keyword, intenção, página-alvo, links internos, CTA e serviço relacionado são definidos no brief, não descobertos escrevendo.
3. **Nada é publicado sem revisão humana.**
4. **Nenhuma afirmação sobre a GSR entra sem confirmação sua.** Isso vale para número, prazo, quantidade de clientes, tempo de mercado e resultado de projeto.
5. **A página de serviço fica com a intenção comercial; o blog fica com a informacional.** Sem exceção.

---

## 2. Afirmações proibidas até confirmação

Lista de bloqueio, válida para todo texto do site e do blog. Se aparecer em conteúdo migrado, é removido, não adaptado.

| Afirmação | Situação |
|---|---|
| "mais de 10 anos de experiência" | **Bloqueada.** Está no site atual, sem confirmação |
| Qualquer número de projetos entregues | Bloqueada |
| Qualquer número de clientes | Bloqueada |
| Qualquer percentual de resultado ("aumentou 40% as vendas") | Bloqueada |
| "triplicar seus clientes em 90 dias" | **Bloqueada.** Título de post existente. Reescrever |
| Prazo de entrega fixo em dias | Bloqueada até você definir faixas reais |
| Preço ou faixa de preço | Bloqueada até você definir |
| Nome de cliente | Bloqueada sem autorização por escrito |
| "equipe de X pessoas" | Bloqueada |
| Prêmio, certificação, parceria | Bloqueada |

O que pode ser dito sem número: o que a GSR faz, como trabalha, com que tecnologia, quais problemas resolve, onde atua. É suficiente para escrever todas as páginas do lançamento.

O bloco `Stats` da home fica **vazio e não renderiza** até você fornecer números reais. É melhor não ter a seção do que ter uma com número inventado.

---

## 3. Migração dos posts — cada um exige sua aprovação

Nenhum dos seis é republicado automaticamente. O fluxo por post:

```
Extrair do WordPress
  → Converter para Lexical, preservando estrutura
  → Preservar publishedAt original
  → Revisar: remover afirmação bloqueada, corrigir heading, ajustar título
  → Marcar needsReview
  → Você aprova
  → Publicar (needsReview desmarcado, 301 ativo)
```

`needsReview: true` **impede a publicação**. É uma trava no Payload, não um lembrete.

| Post | Nova URL | O que fazer na revisão | Esforço |
|---|---|---|---|
| Por que ter um site profissional | `/blog/por-que-ter-um-site-profissional` | Atualizar exemplos, corrigir headings, adicionar links para `/criacao-de-sites` | Baixo |
| Tendências em criação de sites 2024 | `/blog/tendencias-em-criacao-de-sites` | **Reescrever.** Título e conteúdo presos a 2024. Tornar evergreen ou não republicar | Alto |
| Por que investir em sistemas personalizados | `/blog/por-que-investir-em-sistemas-personalizados` | Reposicionar como conteúdo de decisão — quando vale e quando não vale. Ver nota de canibalização no mapa de keywords | Médio |
| 7 erros que matam as vendas | `/blog/erros-que-prejudicam-as-vendas-do-seu-site` | Revisar promessas, adicionar links | Baixo |
| SEO local / triplicar clientes | `/blog/seo-local-para-empresas` | **Reescrever título e toda promessa de resultado.** Linkar para `/sao-luis-ma` | Médio |
| Dashboard em sistema web | `/blog/dashboard-em-sistemas-web` | Revisar, linkar para `/desenvolvimento-de-sistemas` | Baixo |

**Caso separado — o post de São Luís.** `/2024/12/23/criacao-de-sites-em-sao-luis/` não vai para o blog. Suas ~2.070 palavras são a base de `/sao-luis-ma/criacao-de-sites`, a landing comercial local. É o conteúdo mais valioso do site atual e o trabalho de reescrita dele tem a maior prioridade do projeto.

Cada post migrado carrega `legacyUrl` preenchido, para que o par URL antiga → nova fique documentado no próprio conteúdo.

---

## 4. Ritmo editorial

Do lançamento em diante:

| Por mês | Tipo |
|---|---|
| 2 | Comercial — página de serviço nova, página local, ou revisão profunda de uma existente |
| 2 | Informacional — artigo do blog |

Quatro é teto, não meta. Mês sem conteúdo bom é mês sem publicação.

**Revisão de conteúdo existente conta como produção.** Atualizar um artigo que já ranqueia costuma render mais do que publicar um novo — e o `showUpdatedDate` existe para que a data de atualização só apareça quando a revisão for real.

---

## 5. Briefs dos dez artigos

Todo artigo entra em produção com estes campos preenchidos. O que está abaixo é o brief; o texto vem depois da sua aprovação de cada um.

**Estrutura comum:** breadcrumb · H1 · autor · data de publicação · data de atualização quando real · imagem destacada · índice quando passar de 1.200 palavras · corpo · links internos · CTA · artigos relacionados · serviços relacionados.

### 1. Quanto custa criar um site profissional?
`/blog/quanto-custa-criar-um-site` · comercial-investigativa · **prioridade 1**

Ângulo: o que **determina** o custo, não uma tabela de preços. Escopo, número de páginas, conteúdo, integrações, prazo, manutenção. Por que a mesma descrição de projeto gera orçamentos muito diferentes.
Links: `/criacao-de-sites`, `/landing-pages`, `/orcamento`, artigos 5 e 8.
**Pendência:** só publicamos faixa de preço se você definir. Sem isso, o artigo explica a estrutura de custo sem citar valor — o que ainda responde à busca.

### 2. Quanto custa desenvolver um sistema sob medida?
`/blog/quanto-custa-desenvolver-um-sistema` · comercial-investigativa · **prioridade 2**

Ângulo: por que sistema é orçado por escopo e não por tabela. Levantamento, complexidade de regra de negócio, integrações, usuários, infraestrutura, manutenção. Comparação honesta com o custo de sistema pronto ao longo do tempo.
Links: `/desenvolvimento-de-sistemas`, artigos 4, 6 e 7.

### 3. WordPress ou Next.js: qual escolher para seu site?
`/blog/wordpress-ou-nextjs` · comparativa

Ângulo: comparação técnica honesta, incluindo quando WordPress é a escolha certa. Performance, segurança, custo de manutenção, autonomia de publicação, SEO.
Nota: a GSR está migrando o próprio site de WordPress para Next.js. Isso é experiência real e vale ser dito — é E-E-A-T legítimo.
Links: `/criacao-de-sites`, artigo 1.

### 4. Sistema pronto ou sob medida: qual escolher?
`/blog/sistema-pronto-ou-sob-medida` · comparativa

Ângulo: critérios de decisão. **Precisa dizer quando o pronto é a escolha certa** — um artigo que sempre conclui "sob medida" perde credibilidade e não responde à busca.
Links: `/desenvolvimento-de-sistemas`, artigos 2 e 7.

### 5. Quanto tempo leva para desenvolver um site?
`/blog/quanto-tempo-para-criar-um-site` · informacional

Ângulo: as etapas e o que faz cada uma demorar. O papel do cliente no prazo — conteúdo e aprovações são a causa mais comum de atraso.
**Pendência:** faixas de prazo reais da GSR. Sem elas, o artigo descreve as etapas sem prometer duração.
Links: `/criacao-de-sites`, artigo 1.

### 6. Quanto tempo leva para desenvolver um sistema?
`/blog/quanto-tempo-para-desenvolver-um-sistema` · informacional

Mesma estrutura, aplicada a sistemas. Levantamento, MVP, iteração, homologação.
Links: `/desenvolvimento-de-sistemas`, artigos 2 e 10.

### 7. O que é um sistema sob medida e quando vale a pena?
`/blog/o-que-e-sistema-sob-medida` · informacional

Ângulo: definição clara, com exemplos de tipos de problema — não de clientes. **Quando não vale a pena** é seção obrigatória.
Cuidado de canibalização: é definição, não venda. O termo comercial pertence a `/desenvolvimento-de-sistemas`.
Links: `/desenvolvimento-de-sistemas`, artigos 4 e 2.

### 8. Como escolher uma empresa para criar seu site
`/blog/como-escolher-empresa-para-criar-site` · comercial-investigativa

Ângulo: critérios de avaliação e perguntas a fazer a qualquer fornecedor. O que exigir na proposta, quem fica com o código e o domínio, o que acontece depois da entrega, sinais de alerta.
**Risco de canibalização — atenção redobrada.** Escrever como critério neutro, não como argumento de venda da GSR. CTA só no fim.
Links: `/criacao-de-sites`, `/portfolio` (quando existir), artigo 1.

### 9. Site institucional ou landing page: qual sua empresa precisa?
`/blog/site-institucional-ou-landing-page` · comparativa

Ângulo: propósito diferente, não qualidade diferente. Quando cada um resolve, e quando a resposta é os dois.
Links: `/criacao-de-sites`, `/landing-pages`.

### 10. O que é um MVP e quando desenvolver um?
`/blog/o-que-e-mvp` · informacional

Ângulo: MVP como forma de reduzir risco, não como versão barata. O que entra e o que fica de fora. Quando **não** fazer MVP.
Links: `/desenvolvimento-de-sistemas`, artigos 2 e 6.
Este artigo é pré-requisito de `/desenvolvimento-de-sistemas/mvp`.

### Pauta candidata — Shopify ou WooCommerce
`/blog/shopify-ou-woocommerce` · comparativa · **fila de espera, não entra nos 10**

Com as plataformas de e-commerce definidas, essa comparação vira pauta natural. Mesmo formato do artigo 3: quando cada uma é a escolha certa, incluindo os casos em que Shopify vence.

A seção comparativa dentro de `/lojas-virtuais` vem primeiro. O artigo só entra se houver profundidade a acrescentar além dela — caso contrário seria a mesma comparação em dois lugares, que é canibalização.

---

## 6. Calendário dos seis primeiros meses

Sujeito ao seu ritmo. Comercial e informacional alternados.

| Mês | Comercial | Informacional |
|---|---|---|
| 1 (lançamento) | `/sao-luis-ma/criacao-de-sites`, `/criacao-de-sites` | Revisão dos 6 posts migrados |
| 2 | `/desenvolvimento-de-sistemas`, `/sao-luis-ma/desenvolvimento-de-sistemas` | Artigos 1 e 2 (custo) |
| 3 | Primeiro case, `/sobre` ampliada | Artigos 3 e 8 |
| 4 | Segundo case → **portfólio pode ir ao menu**, `/landing-pages` revisada | Artigos 5 e 9 |
| 5 | Terceiro case | Artigos 4 e 7 |
| 6 | `/desenvolvimento-de-sistemas/mvp` se houver conteúdo | Artigos 6 e 10 |

Sobre o portfólio: cada case publicado já tem página própria e entra no sitemap desde o primeiro. O que você decide é **quando o índice entra no menu** — a partir de 2 cases bons já dá, 3 ou mais é o ideal. É o checkbox `showPortfolioInNav`, sem regra de quantidade no código.

Cadastrar projetos reais continua sendo a tarefa que mais destrava o cronograma, e a que depende inteiramente de você.

---

## 7. Alt das imagens — procedimento de revisão

As 62 mídias atuais estão sem alt. Conforme sua decisão, **nada é gerado automaticamente**.

**O que não será feito:** derivar alt do nome do arquivo, do título da página ou da keyword-alvo. Gerar alt automaticamente produziria 62 descrições erradas em vez de 62 ausências — pior para acessibilidade, porque o leitor de tela passa a ler ruído com confiança.

**Procedimento**

1. Só as imagens **efetivamente migradas** entram na lista. A maior parte das 62 é ícone, animação Lottie, foto de banco e arquivo órfão que não vai para o site novo.
2. Gero `docs/data/media-alt-review.csv` a partir do que for migrado:

   ```
   Arquivo | Onde é usada | Tipo | Alt proposto | Alt final | Decorativa
   ```
3. A coluna "Alt proposto" fica **vazia** para foto e captura de tela — só você sabe o que a imagem mostra. Vem preenchida apenas para logo e ícone, onde a descrição é objetiva ("Logo da GSR Sistemas").
4. Você preenche "Alt final" ou marca "Decorativa".
5. Importação para o `Media`. Imagem decorativa recebe `isDecorative: true` e renderiza `alt=""`.

**O que faz um bom alt aqui:** descreve o que se vê e o que importa naquele contexto. "Painel de controle de um sistema de gestão mostrando gráficos de vendas por período" — não "dashboard sistema gestão criação de sites São Luís".

Imagem nova segue a mesma regra: `alt` obrigatório no upload.

---

## 8. Uso de IA

Permitido: pesquisa, estruturação, rascunho, revisão de texto, sugestão de pauta, verificação de consistência de links internos.

Não permitido: publicação automática, geração em lote, texto sobre a GSR sem sua confirmação, qualquer número ou afirmação factual não verificada.

Todo texto passa por você antes de publicar. Nenhum artigo vai ao ar sem que alguém que conhece a GSR tenha lido inteiro.

---

## 9. Checklist antes de publicar

- [ ] Keyword primária definida e sem conflito com página existente
- [ ] Intenção de busca identificada e realmente respondida
- [ ] Título entre ~50 e 60 caracteres, sem promessa não verificável
- [ ] Meta description entre ~140 e 160
- [ ] Um H1, hierarquia sem salto
- [ ] Ao menos 2 links internos saindo, com âncora descritiva
- [ ] Ao menos 2 links internos entrando, de dentro do conteúdo de outras páginas
- [ ] Serviço relacionado vinculado
- [ ] CTA presente e coerente com a intenção
- [ ] Imagem destacada com alt revisado
- [ ] Nenhuma afirmação da lista de bloqueio
- [ ] Nenhum número sem fonte
- [ ] URL curta, sem acento, sem data
- [ ] `showUpdatedDate` marcado só se houve revisão real
- [ ] Revisão humana feita

---

## 10. Acompanhamento

**Semanal, primeiros 90 dias** — Search Console: Páginas indexadas, erro de rastreamento, redirects, "Rastreada — não indexada".

**Mensal** — posição das keywords primárias · páginas de entrada orgânica · leads por página de origem · páginas se sobrepondo nas mesmas consultas · Core Web Vitals de campo.

**Sinal de canibalização a vigiar:** duas páginas aparecendo na mesma consulta, ou a página que ranqueia para um termo não ser a que foi designada para ele. Quando acontecer, o ajuste é no conteúdo — reforçar a diferença de intenção — antes de pensar em canonical ou consolidação.

**Trimestral** — revisar o mapa de keywords com os dados reais · revisar conteúdo desatualizado · avaliar novas páginas pelos quatro critérios · reavaliar redirects com contador `hits` zerado.

---

## 11. Pendências

| # | Pendência | Bloqueia |
|---|---|---|
| 1 | Tempo de mercado real | Página Sobre, bloco de prova social |
| 2 | Faixas de preço divulgáveis | Artigos 1 e 2 |
| 3 | Faixas de prazo reais | Artigos 5 e 6 |
| 4 | Projetos reais + autorização de cliente | Cases e entrada do portfólio no menu |
| 5 | Biografia e experiência da autora | Bloco de autor no rodapé dos posts, página Sobre |
| 6 | Aprovação individual dos 6 posts migrados | Publicação de cada um |

**Resolvidas nesta revisão:** plataformas de e-commerce definidas (Shopify e WooCommerce) · manutenção e UI/UX fora do lançamento, portanto sem páginas a produzir · portfólio sem regra de quantidade.
