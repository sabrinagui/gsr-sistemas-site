# Arquitetura de informação — GSR Sistemas

FASE 2. Documento para aprovação antes da implementação.
Domínio canônico: `https://gsrsistemas.com` — sem `www`, sem barra final.

---

## 1. Princípio que rege este documento

Uma URL só existe quando reúne as quatro condições que você definiu:

1. intenção de busca clara e distinta das outras páginas
2. conteúdo próprio, que não é reescrita de outra página
3. serviço real que a GSR presta
4. valor para quem chega nela

Quando uma dessas falha, a página **não entra**. O termo é atendido dentro de uma página maior, como seção com H2 próprio. É assim que se evita canibalização por construção, em vez de tentar corrigir depois.

Por isso o mapa abaixo é menor do que a lista de URLs do briefing. As diferenças estão justificadas na seção 4.

---

## 2. Mapa de URLs

Legenda de fase: **L** = no lançamento · **P** = pós-lançamento, condicionado · **E** = estrutura pronta no CMS, sem página pública ainda

### Institucional

| URL | Fase | Observação |
|---|---|---|
| `/` | L | Home |
| `/sobre` | L | E-E-A-T. Só com informação confirmada |
| `/contato` | L | |
| `/orcamento` | L | Formulário principal de conversão |
| `/obrigado` | L | Página de sucesso. `noindex` |
| `/404` | L | Não é URL própria; resposta 404 real |

### Serviços

| URL | Fase | Intenção principal |
|---|---|---|
| `/servicos` | L | Hub. Navegacional, não comercial |
| `/criacao-de-sites` | L | Comercial — criação de sites |
| `/desenvolvimento-de-sistemas` | L | Comercial — sistemas sob medida |
| `/landing-pages` | L | Comercial — landing page |
| `/lojas-virtuais` | L | Comercial — loja virtual / e-commerce |
| `/automacao-e-integracoes` | L | Comercial — automação e integração |
| `/ui-ux-design` | P | **Fora do lançamento** (decisão aprovada). Entra quando houver processo e trabalho real de design a mostrar |
| `/manutencao-e-suporte` | P | **Fora do lançamento** (decisão aprovada). Entra quando o serviço tiver escopo e formato definidos |

### Subserviços

| URL | Fase | Decisão |
|---|---|---|
| `/desenvolvimento-de-sistemas/mvp` | P | Intenção distinta e público distinto. Entra quando houver conteúdo próprio |
| `/desenvolvimento-de-sistemas/dashboards` | P | Entra junto com o artigo de dashboard e ao menos um case |
| `/criacao-de-sites/sites-institucionais` | P | Intenção distinta. Depende de conteúdo próprio |
| `/desenvolvimento-de-sistemas/sistemas-sob-medida` | — | **Não criar.** Ver 4.1 |
| `/desenvolvimento-de-sistemas/sistemas-web` | — | **Não criar.** Ver 4.1 |
| `/desenvolvimento-de-sistemas/integracoes` | — | **Não criar.** Ver 4.2 |
| `/desenvolvimento-de-sistemas/portais` | — | **Não criar por ora.** Ver 4.3 |
| `/criacao-de-sites/sites-corporativos` | — | **Não criar.** Ver 4.4 |
| `/criacao-de-sites/sites-em-nextjs` | — | **Não como página de serviço.** Ver 4.5 |

### SEO local

| URL | Fase | Observação |
|---|---|---|
| `/sao-luis-ma` | L | Hub local |
| `/sao-luis-ma/criacao-de-sites` | L | Recebe o 301 do post legado. Maior prioridade do projeto |
| `/sao-luis-ma/desenvolvimento-de-sistemas` | L | Precisa de conteúdo local escrito do zero |
| `/sao-luis-ma/landing-pages` | P | Só com demanda ou case local |
| `/sao-luis-ma/lojas-virtuais` | P | Só com demanda ou case local |
| Outras cidades | — | Não existem. Regra em 5 |

### Portfólio

| URL | Fase | Observação |
|---|---|---|
| `/portfolio` | L / E | Vai ao ar a partir de 2 cases publicados. Ver 3.1 |
| `/portfolio/[slug]` | L / E | Cada case tem página própria assim que publicado |

### Blog

| URL | Fase | Observação |
|---|---|---|
| `/blog` | L | Listagem |
| `/blog/[slug]` | L | 6 posts migrados após revisão |
| `/blog/page/[n]` | P | Só quando passar de ~12 posts |
| `/blog/categoria/[slug]` | P | Só com 5+ posts por categoria. Ver 3.2 |
| `/blog/autor/[slug]` | P | Ver 3.3 |
| `/blog/feed.xml` | L | RSS |

### Sistema

| URL | Indexável | Observação |
|---|---|---|
| `/sitemap.xml` | — | |
| `/robots.txt` | — | |
| `/admin/*` | não | Payload. `noindex` + `Disallow` |
| `/api/*` | não | |
| `/preview/*` | não | `noindex` + `X-Robots-Tag: noindex` |
| `/links` | pendente | Aguarda confirmação de uso |

---

## 3. Decisões

### 3.1 Portfólio — julgamento editorial, sem número fixo no código

O site atual não tem nenhum case estruturado, só quatro imagens sem texto. A collection `CaseStudies` fica pronta no Payload desde o início.

**Decisão aprovada:** não há regra de quantidade codificada. `/portfolio` pode ir ao ar **a partir de 2 cases bons**; 3 ou mais é o ideal.

Implementação:

- `/portfolio` responde 200 sempre que houver **ao menos 1 case publicado**. Com zero, retorna 404 e fica fora do sitemap — página de listagem vazia não é conteúdo.
- A entrada no **menu principal** é controlada por um checkbox em `SiteSettings` (`showPortfolioInNav`), que você liga quando julgar que o conjunto está apresentável. Não é contagem automática.
- Cada case publicado tem página própria e entra no sitemap desde o primeiro, independentemente de o índice estar no menu. Um case sozinho já é conteúdo útil e ranqueável.

A diferença em relação à versão anterior: a decisão de quando o portfólio está pronto é sua, tomada olhando os cases, e não uma constante no código.

### 3.2 Categorias do blog

Com 6 posts migrados, criar páginas de categoria produz listagens de dois ou três itens que competem com `/blog`. Proposta: categoria existe como **campo** no Payload desde já, usada para filtro visual e para relacionamento, mas **sem página pública** até uma categoria acumular 5 posts.

### 3.3 Página de autor — decidido

**Bloco de autor no rodapé de cada post** — foto, nome, uma frase real, link para `/sobre`. Sem arquivo de autor indexável no lançamento.

`/author/sabrina/` recebe **301 para `/sobre`**. Já registrado em `migration-url-map.csv`.

Se mais adiante houver biografia, experiência e perfis externos a apresentar, `/blog/autor/sabrina` entra como página de E-E-A-T e o 301 é atualizado para ela.

### 3.4 `/ui-ux-design` e `/manutencao-e-suporte` — fora do lançamento

Decisão aprovada: nenhuma das duas entra como página própria agora.

O site atual lista "Manutenção e Suporte" como serviço, mas sem escopo, formato ou preço. UI/UX aparece no briefing e não no site atual. Sem escopo definido, seriam páginas finas.

Onde os dois aparecem no lançamento:

- **seção com H2 dentro de `/servicos`**, descrevendo a capacidade sem página de destino
- **etapa dentro do processo** em `/criacao-de-sites` e `/desenvolvimento-de-sistemas` — design faz parte da entrega, suporte vem depois dela

Viram página quando você definir o que exatamente é vendido em cada um.

---

## 4. Canibalizações evitadas

Esta seção justifica cada URL do briefing que não entrou.

### 4.1 `sistemas sob medida`, `sistemas personalizados`, `sistemas web` não são páginas separadas

Quem busca "desenvolvimento de sistemas", "desenvolvimento de sistemas sob medida", "sistemas personalizados para empresas" e "desenvolvimento de sistemas web" quer a mesma coisa: uma empresa que construa um sistema para ele. São variações lexicais da mesma intenção, não intenções diferentes.

Quatro páginas para essa intenção produziriam quatro textos quase idênticos disputando entre si — exatamente o que você pediu para evitar no item 9 do briefing ("não duplicar texto apenas trocando palavras-chave").

**Decisão:** `/desenvolvimento-de-sistemas` é a única página comercial dessa intenção e trabalha os quatro termos naturalmente ao longo do texto, com H2 dedicados a "Sistemas sob medida", "Sistemas web" e "Software personalizado".

### 4.2 `integrações` fica só em `/automacao-e-integracoes`

`/desenvolvimento-de-sistemas/integracoes` e `/automacao-e-integracoes` responderiam à mesma busca ("integração de sistemas"). Duas URLs, uma intenção.

**Decisão:** `/automacao-e-integracoes` é a página. `/desenvolvimento-de-sistemas` menciona integrações como capacidade e linka para ela.

### 4.3 `portais`

"Desenvolvimento de portais" é uma intenção real, mas estreita e sem sinal de que a GSR já entregou um. Sem case e sem conteúdo próprio, seria uma página fina.

**Decisão:** seção com H2 dentro de `/desenvolvimento-de-sistemas`. Vira página se aparecer demanda ou projeto.

### 4.4 `sites corporativos`

"Site institucional" e "site corporativo" são sinônimos comerciais em português. Duas páginas seriam o mesmo texto.

**Decisão:** uma só, `/criacao-de-sites/sites-institucionais`, quando entrar. O termo "corporativo" é trabalhado dentro dela.

### 4.5 `sites em Next.js`

Ninguém contrata site pesquisando "sites em Next.js" — quem digita isso é desenvolvedor pesquisando tecnologia, não empresa procurando fornecedor. É intenção informacional, não comercial.

**Decisão:** vira artigo (`/blog/wordpress-ou-nextjs`, já previsto no seu item 27) e seção "Tecnologia" dentro de `/criacao-de-sites`. Não é página de serviço.

### 4.6 Fronteira entre serviço e blog

A regra que impede o caso que você citou no item 49:

| Tipo de intenção | Onde é atendida |
|---|---|
| "quero contratar" — criação de sites, empresa de, desenvolvimento de sistemas | Página de serviço |
| "quero contratar aqui" — criação de sites em São Luís | Página local |
| "quero entender" — quanto custa, quanto tempo, o que é, como escolher, qual escolher | Blog |

Nenhum artigo do blog pode ter como alvo principal um termo comercial puro. Se um artigo começar a receber cliques de uma busca comercial, o alvo do artigo é revisado, não a página de serviço.

---

## 5. Regra para novas cidades

Nenhuma cidade além de São Luís entra por decisão de SEO. Uma nova cidade só existe quando **todas** forem verdadeiras:

1. há cliente atendido naquela cidade
2. há case publicável referente a ela
3. existe conteúdo local próprio a escrever — nomes, contexto, mercado — e não o texto de São Luís com a cidade trocada
4. há intenção comercial de atuar ali

Não haverá geração automática de páginas de localização. A collection `Locations` não tem qualquer mecanismo de criação em massa, e o painel avisa quando o conteúdo local está curto demais para sustentar a página — a decisão de publicar continua sendo editorial.

O hub `/sao-luis-ma` deixa explícito que a GSR atende todo o Brasil remotamente — é assim que o alcance nacional é comunicado, não com uma página por capital.

---

## 6. Navegação

### Header

```
Serviços ▾   Portfólio*   Sobre   Blog   Contato        [Solicitar orçamento]
```

`Serviços` abre um painel com as cinco páginas de serviço do lançamento e um link para `/servicos`. Renderizado no HTML inicial — o menu existe para o crawler mesmo sem JavaScript.

`Portfólio` aparece no menu quando você ligar `showPortfolioInNav` em `SiteSettings` — sua decisão editorial, conforme 3.1.

`São Luís` **não** entra no menu principal. A página local é alcançada pela home, pelo rodapé e pelas páginas de serviço — colocá-la no menu passaria a impressão de empresa que só atende localmente.

### Rodapé

Quatro colunas, sem inflar com termos:

| Coluna 1 | Coluna 2 | Coluna 3 | Coluna 4 |
|---|---|---|---|
| GSR Sistemas + descrição institucional + São Luís/MA, atendimento em todo o Brasil | Serviços (5 links) | Empresa: Sobre, Portfólio*, Blog, Contato, Orçamento | Contato: WhatsApp, e-mail, Instagram, `/sao-luis-ma` |

CNPJ e linha de copyright em faixa inferior, em texto normal — não em heading.

### Breadcrumbs

Em todas as páginas exceto a home. Visíveis e com `BreadcrumbList` em JSON-LD.

```
Início > Serviços > Desenvolvimento de Sistemas
Início > São Luís, MA > Criação de Sites
Início > Blog > Quanto custa criar um site
Início > Portfólio > [Nome do projeto]
```

---

## 7. Modelo de links internos

Cada relação abaixo é um campo no Payload, não uma decisão manual repetida a cada página.

| Origem | Destino | Onde aparece | Campo |
|---|---|---|---|
| Artigo | Serviço | CTA no meio e no fim do texto | `relatedServices` |
| Artigo | Artigos | Bloco final | `relatedPosts` |
| Serviço | Cases | Bloco "Projetos" | `relatedCases` |
| Serviço | Artigos | Bloco "Conteúdo relacionado" | `relatedPosts` |
| Serviço | Página local | Bloco local no fim da página | automático via `Locations` |
| Case | Serviços | Bloco "Serviços deste projeto" | `relatedServices` |
| Case | Cases | "Projetos relacionados" | por `projectType` |
| Local | Serviço nacional | Dentro do texto | `relatedServices` |
| Local | Cases locais | Bloco "Projetos em São Luís" | `relatedCases` |
| Home | Serviços, cases, local, artigos | Blocos da home | — |

Duas regras que valem para tudo:

- **Nenhuma página depende só do menu para receber link.** Toda página precisa de pelo menos dois links internos vindos de dentro do conteúdo de outras páginas.
- **Todo link interno usa a URL canônica final.** Nunca com barra final, nunca com `www`, nunca apontando para algo que redireciona.

### Profundidade

Nenhuma página fica a mais de três cliques da home. Serviços e a página local estão a um clique. Artigos e cases, a dois.

---

## 8. Estrutura de headings por tipo de página

Corrige o problema do site atual, onde o H1 saltava para H5 e o copyright era H2.

**Serviço**

```
H1  Criação de Sites Profissionais
H2  O que entregamos
  H3  por tipo de site
H2  Por que a GSR
H2  Como funciona o processo
  H3  por etapa
H2  Tecnologias
H2  Projetos
H2  Perguntas frequentes
  H3  por pergunta
H2  Conteúdo relacionado
H2  Vamos conversar sobre seu projeto
```

**Local**

```
H1  Criação de Sites em São Luís, MA
H2  Sites para empresas de São Luís
H2  Quem atendemos
H2  Como trabalhamos
H2  Tipos de site
H2  Desempenho e busca no Google
H2  Atendimento em São Luís e no Maranhão
H2  Depoimentos
H2  Perguntas frequentes
H2  Solicitar orçamento
```

**Artigo** — H1 = título; H2/H3 seguindo o argumento, nunca escolhidos por tamanho.

**Case** — H1 = nome do projeto; H2 para Desafio, Solução, O que foi construído, Tecnologias, Resultado.

Um H1 por página. Sem salto de nível. Tamanho é responsabilidade do CSS, não da tag.

---

## 9. Inventário final do lançamento

| Grupo | Páginas |
|---|---|
| Institucional | `/`, `/sobre`, `/contato`, `/orcamento`, `/obrigado` |
| Serviços | `/servicos` + 5 páginas |
| Local | `/sao-luis-ma` + 2 páginas |
| Blog | `/blog` + 6 artigos migrados |
| Portfólio | `/portfolio` + cases, conforme forem cadastrados |
| **Total indexável** | **~21 URLs**, mais um por case publicado |

Vinte e uma páginas com conteúdo real valem mais do que sessenta páginas finas. As demais entram por decisão editorial, uma a uma, quando houver o que dizer.

---

## 10. Pendências desta fase

| # | Pendência | Bloqueia |
|---|---|---|
| 1 | `/links` ainda em uso? | Decisão de manter, `noindex` ou 410 |
| 2 | Endereço é local de atendimento presencial? | `LocalBusiness` — hoje preparado e desligado |
| 3 | Razão social | `legalName` no schema |
| 4 | Tempo de mercado e números reais | Blocos de prova social — hoje sem números |
| 5 | Projetos reais com autorização de cliente | Cases e entrada de `/portfolio` no menu |

**Resolvidas nesta revisão:** portfólio sem regra fixa de quantidade (3.1) · bloco de autor em vez de arquivo (3.3) · `/ui-ux-design` e `/manutencao-e-suporte` fora do lançamento (3.4).
