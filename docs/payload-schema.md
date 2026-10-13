# Schema do Payload — GSR Sistemas

FASE 2. Documento para aprovação.

Payload 3 no mesmo projeto Next.js, adaptador PostgreSQL, admin em `/admin`, editor Lexical.

---

## 1. Critério de projeto

Você pediu escalabilidade sem overengineering. O que isso significa em decisões concretas:

- **Cada campo tem um consumidor identificado.** Se nenhuma página lê o campo, ele não existe.
- **Relacionamento em vez de duplicação.** Depoimento, FAQ e case existem uma vez e são referenciados por serviço, local e home.
- **Blocos só onde a página varia de verdade.** Serviço e local têm estrutura fixa; o que muda é o conteúdo. Layout livre só em `Pages`.
- **Nada de campo "para o futuro".** É mais barato adicionar campo do que migrar dado morto.

O resultado são **11 collections e 4 globals** — a lista do briefing, sem `Categories` como collection separada no lançamento (justificativa em 3.6).

---

## 2. Campo compartilhado: `seoField`

Arquivo `src/fields/seo.ts`. Um grupo, usado por toda collection com página pública.

| Campo | Tipo | Comportamento |
|---|---|---|
| `metaTitle` | text | Vazio → gerado. Contador visual 50–60. Alerta, nunca bloqueia |
| `metaDescription` | textarea | Vazio → usa `excerpt`/`description`. Contador 140–160 |
| `focusKeyword` | text | Referência editorial. **Não** vai para meta keywords |
| `secondaryKeywords` | text (hasMany) | Referência editorial |
| `canonicalUrl` | text | Vazio → canônica própria. Só preencher em caso excepcional |
| `index` | checkbox | Default `true` |
| `follow` | checkbox | Default `true` |
| `ogTitle` | text | Vazio → `metaTitle` |
| `ogDescription` | textarea | Vazio → `metaDescription` |
| `ogImage` | upload → Media | Vazio → `featuredImage` → `SEOSettings.defaultOGImage` |
| `twitterTitle` | text | Vazio → `ogTitle` |
| `twitterDescription` | textarea | Vazio → `ogDescription` |
| `twitterImage` | upload → Media | Vazio → `ogImage` |

Tudo em uma aba "SEO", colapsada. O editor não é obrigado a preencher nada — o fallback resolve, e o override existe quando ele quiser.

**Cadeia de fallback do title**, implementada em `src/lib/seo/`:

```
metaTitle
  → `${title} em São Luís, MA | GSR Sistemas`   (Locations)
  → `${title} | GSR Sistemas`                   (demais)
```

O contador é um componente `admin.components.Field` no cliente, sobre um `text` comum. Mostra a contagem e muda de cor fora da faixa. Não valida.

---

## 3. Collections

### 3.1 `Pages`

Páginas institucionais de layout livre: `/sobre`, `/contato`, `/orcamento`, `/servicos`, `/obrigado`. É a única collection com composição por blocos.

| Campo | Tipo | Notas |
|---|---|---|
| `title` | text | obrigatório |
| `slug` | text | único, indexado. Gerado do title, editável |
| `excerpt` | textarea | Fallback de meta description |
| `layout` | blocks | Ver seção 5 |
| `featuredImage` | upload → Media | |
| `parent` | relationship → Pages | Opcional. Alimenta breadcrumb |
| `publishedAt` | date | |
| `seo` | group | `seoField` |

Versionamento com rascunhos. `updatedAt` é automático do Payload.

**Sem campo `breadcrumbs`.** O briefing pedia um, mas breadcrumb é derivado da URL e de `parent` — armazenar seria dado que pode divergir do que a página realmente é. Calculado em runtime.

**Sem campo `status`.** O Payload já fornece `_status` (`draft`/`published`) quando o versionamento está ligado. Um segundo campo criaria dois estados conflitantes.

### 3.2 `Services`

Estrutura fixa. O editor preenche conteúdo, não monta layout — é o que garante consistência entre as páginas de serviço.

| Campo | Tipo | Notas |
|---|---|---|
| `title` | text | "Criação de Sites Profissionais" |
| `shortTitle` | text | "Criação de Sites" — menu, cards, breadcrumb |
| `slug` | text | único. Vira a URL raiz: `/criacao-de-sites` |
| `parent` | relationship → Services | Preenchido só em subserviço. Define `/pai/filho` |
| `description` | textarea | Resumo curto. Usado em cards e como fallback de meta |
| `hero` | group | `headline`, `subheadline`, `image`, `primaryCta`, `secondaryCta` |
| `benefits` | array | `title`, `description`, `icon` (select de lista fixa) |
| `features` | array | `title`, `description` |
| `process` | array | `step`, `title`, `description` |
| `technologies` | relationship → Technologies (hasMany) | Ver 3.11 |
| `content` | richText | Corpo longo. Onde mora a substância de SEO |
| `faqs` | relationship → FAQs (hasMany) | |
| `relatedCases` | relationship → CaseStudies (hasMany) | |
| `relatedPosts` | relationship → Posts (hasMany) | |
| `relatedServices` | relationship → Services (hasMany) | |
| `cta` | group | `title`, `description`, `buttonLabel`, `buttonHref` |
| `order` | number | Ordem em `/servicos` e no menu |
| `showInNav` | checkbox | Controla o menu sem despublicar a página |
| `seo` | group | `seoField` |

`parent` é o que permite os subserviços diferidos (`/desenvolvimento-de-sistemas/mvp`) sem mudar o schema depois.

### 3.3 `Locations`

| Campo | Tipo | Notas |
|---|---|---|
| `city` | text | "São Luís" |
| `state` | text | "Maranhão" |
| `stateCode` | text | "MA" |
| `slug` | text | único. `sao-luis-ma` |
| `isHub` | checkbox | `true` → renderiza `/sao-luis-ma` |
| `service` | relationship → Services | Vazio no hub. Preenchido em `/sao-luis-ma/criacao-de-sites` |
| `hero` | group | Igual ao de Services |
| `description` | textarea | |
| `localContent` | richText | **Obrigatório.** Conteúdo escrito para este mercado |
| `serviceAreas` | array | `name` — bairros e municípios atendidos |
| `relatedServices` | relationship → Services (hasMany) | |
| `relatedCases` | relationship → CaseStudies (hasMany) | |
| `faqs` | relationship → FAQs (hasMany) | |
| `testimonials` | relationship → Testimonials (hasMany) | |
| `seo` | group | `seoField` |

**Controle contra doorway pages: validação editorial com aviso, sem trava rígida.**

Não há limite de caracteres bloqueando a publicação. O que existe:

1. **Aviso de conteúdo curto no painel.** Um componente no campo `localContent` mostra a contagem e, abaixo de um patamar de referência, exibe o alerta: *"Conteúdo local curto. Uma página de localização precisa de contexto próprio deste mercado, não do texto nacional com a cidade trocada."* Alerta, não erro — a publicação segue.
2. **Checklist de publicação no painel**, com quatro confirmações explícitas: conteúdo escrito para este mercado · não é reescrita da página nacional · há informação local real · foi revisado.
3. **Nenhum mecanismo de criação em massa.** A collection não tem importação em lote nem duplicação de registro com troca de cidade. Criar uma página local exige preencher o formulário inteiro, uma vez, para cada cidade.
4. **A regra editorial vale mais que a técnica** — as quatro condições de `information-architecture.md` §5 continuam sendo o critério real.

A mudança em relação à versão anterior: o julgamento fica com quem escreve, e o sistema informa em vez de impedir. Uma trava numérica seria contornável escrevendo texto ruim mais longo, o que é pior do que texto curto e honesto.

**Sem coordenadas por enquanto.** Entram quando `LocalBusiness` for ativado.

### 3.4 `CaseStudies`

| Campo | Tipo | Notas |
|---|---|---|
| `title` | text | Nome do projeto |
| `slug` | text | único → `/portfolio/[slug]` |
| `client` | text | |
| `clientApproved` | checkbox | **Obrigatório `true` para publicar.** Trava de autorização |
| `industry` | text | |
| `projectType` | select | site · sistema · landing page · loja virtual · automação · app |
| `summary` | textarea | |
| `challenge` | richText | |
| `solution` | richText | |
| `features` | array | `title`, `description` |
| `technologies` | relationship → Technologies (hasMany) | |
| `results` | array | `label`, `value`, `description` — **preenchimento livre, sem sugestão** |
| `testimonial` | relationship → Testimonials | Opcional |
| `featuredImage` | upload → Media | |
| `gallery` | array de upload → Media | Com `caption` |
| `websiteUrl` | text | |
| `year` | number | |
| `relatedServices` | relationship → Services (hasMany) | |
| `seo` | group | `seoField` |

`results` é array vazio por padrão e o painel não sugere nada. Case sem número publica normalmente — melhor sem métrica do que com métrica inventada.

`clientApproved` bloqueia a publicação enquanto não houver autorização do cliente.

### 3.5 `Posts`

| Campo | Tipo | Notas |
|---|---|---|
| `title` | text | |
| `slug` | text | único → `/blog/[slug]` |
| `excerpt` | textarea | |
| `content` | richText | |
| `featuredImage` | upload → Media | |
| `author` | relationship → Users | |
| `category` | select | Ver 3.6 |
| `topics` | text (hasMany) | Uso interno. **Sem página pública** |
| `relatedServices` | relationship → Services (hasMany) | |
| `relatedPosts` | relationship → Posts (hasMany) | |
| `publishedAt` | date | Preserva a data original na migração |
| `updatedAt` | date | Automático |
| `showUpdatedDate` | checkbox | Só exibe "atualizado em" quando houve revisão real |
| `readingTime` | number | Calculado no `beforeChange` |
| `tableOfContents` | checkbox | Gera índice a partir dos H2 |
| `legacyUrl` | text | URL antiga do WordPress. Documenta a migração |
| `needsReview` | checkbox | Ver abaixo |
| `seo` | group | `seoField` |

`showUpdatedDate` resolve um problema real: republicar 6 posts migrados faria todos exibirem data de atualização de hoje, sinalizando frescor que não existe. Fica desligado por padrão.

`needsReview` marca conteúdo migrado que ainda carrega afirmação a verificar — como "mais de 10 anos de experiência". Post com `needsReview: true` **não publica**.

### 3.6 Categorias

**Não entra como collection no lançamento.** Com 6 posts, uma collection de categorias produziria páginas de listagem com dois itens competindo com `/blog`.

Vira um `select` em `Posts` com valores fixos:

```
criacao-de-sites · desenvolvimento-de-sistemas · seo-e-performance · negocios-digitais
```

Serve para filtro visual e para relacionamento. Quando uma categoria chegar a 5 posts e você quiser página própria, ela é promovida a collection — migração trivial, já que os slugs são os mesmos.

### 3.7 `Testimonials`

| Campo | Tipo | Notas |
|---|---|---|
| `name` | text | |
| `company` | text | |
| `role` | text | |
| `testimonial` | textarea | |
| `rating` | number | 1–5. Opcional |
| `source` | select | google · whatsapp · e-mail · presencial |
| `sourceUrl` | text | Link para a avaliação original |
| `date` | date | |
| `project` | relationship → CaseStudies | Opcional |
| `approvedForWebsite` | checkbox | **Obrigatório `true` para exibir** |
| `featured` | checkbox | Destaque na home |

Os três depoimentos reais do site atual entram aqui, com `source: google` e a data original (10/04/2024). São exibidos no site com nome, texto, fonte e data — prova social visível e verificável.

**`rating` fica armazenado e não gera schema.** Decisão aprovada: nenhum `AggregateRating` nem `Review` é emitido para a própria GSR. O campo existe para exibição visual e para o caso de a decisão mudar. Detalhamento em `technical-seo.md`, seção 7.3.

### 3.8 `FAQs`

| Campo | Tipo |
|---|---|
| `question` | text |
| `answer` | richText |
| `relatedService` | relationship → Services |
| `relatedLocation` | relationship → Locations |
| `order` | number |

Uma pergunta, um registro, reutilizável em várias páginas. Evita a mesma resposta escrita cinco vezes de formas ligeiramente diferentes.

### 3.9 `Redirects`

| Campo | Tipo | Notas |
|---|---|---|
| `from` | text | único, indexado. Path com barra inicial |
| `to` | text | Vazio quando `type` for 410 |
| `type` | select | `301` · `302` · `410` |
| `active` | checkbox | Default `true` |
| `notes` | textarea | |
| `hits` | number | Contador. Mostra o que ainda recebe tráfego |
| `lastHitAt` | date | |

Carga inicial via seed a partir de `migration-url-map.csv`. Mecânica de resolução e cache em `technical-seo.md`, seção 6.

`hits` responde a uma pergunta prática: depois de um ano, quais redirects ainda importam.

### 3.10 `Leads`

| Campo | Tipo |
|---|---|
| `name`, `email`, `phone`, `company` | text |
| `projectType` | select |
| `budget` | select |
| `message` | textarea |
| `sourcePage` | text |
| `utmSource`, `utmMedium`, `utmCampaign` | text |
| `status` | select — novo · contatado · qualificado · convertido · descartado |
| `createdAt` | date |

**Acesso:** `create` público via endpoint próprio com validação server-side; `read`/`update` só autenticado. Nunca exposto pela REST/GraphQL pública do Payload.

`status` transforma a collection em pipeline mínimo, sem virar CRM.

### 3.11 `Technologies`

Não estava no briefing, mas resolve um problema concreto: as tecnologias aparecem em serviços, cases e na home. Sem collection, seriam digitadas de novo em cada lugar, com nome e logo divergindo.

| Campo | Tipo |
|---|---|
| `name` | text |
| `slug` | text |
| `logo` | upload → Media (SVG) |
| `category` | select — frontend · backend · banco · infra · integração · e-commerce |
| `order` | number |

Sem página pública. Só dado reutilizável.

Seed inicial com o que a GSR efetivamente usa — nada de logo de tecnologia que não é utilizada. Inclui **Shopify** e **WooCommerce** na categoria `e-commerce`, conforme definido para `/lojas-virtuais`.

### 3.12 `Media`

| Campo | Tipo | Notas |
|---|---|---|
| `alt` | text | **Obrigatório.** Ver abaixo |
| `caption` | text | |
| `isDecorative` | checkbox | Marca imagem decorativa → renderiza `alt=""` |
| `credit` | text | |

`upload` com `imageSizes` — thumbnail 400, card 800, hero 1600 — e `formatOptions` gerando WebP. AVIF via `next/image`.

**Armazenamento em Cloudflare R2**, via `@payloadcms/storage-s3` apontado para o endpoint S3-compatível do R2. O arquivo não fica no sistema de arquivos da Vercel — que é efêmero e tornaria upload impossível em produção. Bucket com domínio público próprio, para que a URL da imagem seja estável e cacheável. Credenciais só em variável de ambiente do servidor.

`alt` é obrigatório **exceto** quando `isDecorative` estiver marcado. Assim uma imagem decorativa recebe `alt=""` correto por decisão explícita, e nunca por esquecimento — que é o estado atual das 62 mídias.

Na migração, **nenhum alt é gerado automaticamente**. O procedimento de atribuição manual está em `content-plan.md`, seção 7.

### 3.13 `Users`

Padrão do Payload, com acréscimos para o bloco de autor:

| Campo | Tipo |
|---|---|
| `name` | text |
| `bio` | textarea |
| `role` | text |
| `avatar` | upload → Media |
| `linkedin`, `github` | text |

---

## 4. Globals

### `SiteSettings`

`companyName` ("GSR Sistemas") · `legalName` (**vazio até confirmação**) · `cnpj` (`45.971.007/0001-99`) · `description` · `domain` · `logo` · `logoLight` · `favicon` · `phone` · `whatsapp` (`+5598988915251`) · `whatsappMessage` · `email` (`contato@gsrsistemas.com`) · `foundingYear` (**vazio até confirmação**) · `socialProfiles` (array de `platform` + `url`)

Grupo `address`, todo opcional e desligado por padrão:

`street` · `number` · `neighborhood` · `city` ("São Luís") · `state` ("MA") · `postalCode` · `country` ("BR") · `coordinates` · **`isPhysicalLocation`** (checkbox, default `false`) · **`showAddressOnSite`** (checkbox, default `false`)

Esses dois checkboxes são o mecanismo que você pediu: o `LocalBusiness` fica construído e inativo. Enquanto `isPhysicalLocation` for `false`, o site emite apenas `Organization` e não exibe endereço em lugar nenhum. Quando você confirmar, marca o checkbox e o schema local passa a ser emitido — sem alteração de código.

`whatsapp` é fonte única. Todo botão de WhatsApp do site lê daqui. Os três números do site atual desaparecem por construção.

Grupo `display`, para decisões editoriais que você controla sem deploy:

- **`showPortfolioInNav`** (checkbox, default `false`) — coloca Portfólio no menu principal quando você julgar que os cases estão apresentáveis. Conforme decidido, não há contagem automática; `/portfolio` já responde 200 a partir de 1 case publicado, e a entrada no menu é sua decisão.
- `showTestimonials` (checkbox, default `true`)

### `Header`

`navItems` (array com `label`, `type` [page/service/custom], `reference`, `url`, `subItems`) · `ctaLabel` · `ctaHref`

### `Footer`

`description` · `columns` (array com `title` e `links`) · `showCnpj` · `copyrightText`

### `SEOSettings`

`defaultTitle` · `titleTemplate` (`%s | GSR Sistemas`) · `defaultDescription` · `defaultOGImage` · `organizationDescription` · `sameAs` · `googleSiteVerification` · `ga4MeasurementId` (`G-FVHZ0NLLXC`) · `gtmContainerId` (`GTM-539GQMP8`) · `clarityProjectId` · `enableAnalytics` (checkbox — desligado em preview e desenvolvimento)

---

## 5. Blocos

Usados **apenas em `Pages`**. Serviços, locais, cases e posts têm estrutura fixa — é o que impede layout caótico, que foi sua preocupação no item 58.

| Bloco | Para quê |
|---|---|
| `Hero` | Topo de página institucional |
| `RichText` | Texto corrido |
| `ImageText` | Imagem + texto, alternável |
| `ServicesGrid` | Cards de serviço, por relacionamento |
| `CaseStudiesBlock` | Cases selecionados ou os N mais recentes |
| `Testimonials` | Só `approvedForWebsite: true` |
| `Stats` | Números. **Sem valor padrão.** Bloco vazio não renderiza |
| `Benefits` | Lista de benefícios |
| `Process` | Etapas numeradas |
| `TechnologyGrid` | Por relacionamento |
| `FAQ` | Por relacionamento |
| `CTA` | Chamada + botão |
| `RelatedPosts` | |
| `LocalSEOBlock` | Bloco local com link para `/sao-luis-ma` |
| `ContactForm` | Escolhe entre formulário de contato e de orçamento |
| `LogoCloud` | Logos de cliente. **Requer autorização por logo** |

O `Stats` merece nota: ele não vem com nenhum número preenchido nem placeholder do tipo "+100 projetos". Um bloco `Stats` sem entradas simplesmente não renderiza. Não há caminho no painel que produza métrica inventada por inércia.

A home é uma `Page` com blocos, o que permite reordenar seções sem deploy.

---

## 6. Rascunho, versão e preview

- Versionamento com rascunhos em `Pages`, `Services`, `Locations`, `CaseStudies`, `Posts`. `maxPerDoc: 20`.
- Consultas públicas filtram `_status: 'published'`. Rascunho **nunca** aparece em página pública, sitemap ou listagem.
- Preview em `/preview?secret=...&collection=...&slug=...`, que valida o token, ativa o draft mode e redireciona para a rota real. Resposta com `X-Robots-Tag: noindex, nofollow` e bloqueio no `robots.txt`.
- `admin.livePreview` configurado nas cinco collections.

---

## 7. Hooks

| Hook | Onde | O que faz |
|---|---|---|
| `formatSlug` | todas com slug | Normaliza acento, espaço, caixa |
| `revalidatePath` | após `change`/`delete` | Revalida a rota, a listagem e o sitemap |
| `calculateReadingTime` | `Posts` | |
| `warnOnShortLocalContent` | `Locations` | **Avisa** sobre conteúdo local curto. Não bloqueia |
| `requireClientApproval` | `CaseStudies` | Bloqueia publicação sem autorização |
| `blockUnreviewedContent` | `Posts` | Bloqueia publicação com `needsReview` |
| `invalidateRedirectCache` | `Redirects` | Limpa o cache em memória |
| `notifyLead` | `Leads` | E-mail ao criar |

---

## 8. Acesso

| Collection | read | create | update/delete |
|---|---|---|---|
| Conteúdo público | publicado: livre; rascunho: autenticado | autenticado | autenticado |
| `Leads` | autenticado | endpoint próprio | autenticado |
| `Media` | livre | autenticado | autenticado |
| `Users` | autenticado | admin | próprio ou admin |
| Globals | livre | — | autenticado |

Papéis: `admin` e `editor`. Editor não gerencia usuários nem `SiteSettings`.

Admin do Payload com autenticação, `noindex` e `Disallow` no robots.

---

## 8.1 Infraestrutura

Definida. É o que o `payload.config.ts` e o ambiente precisam refletir.

| Camada | Serviço | Notas |
|---|---|---|
| Banco | **Neon** (PostgreSQL) | `@payloadcms/db-postgres`. Branch de produção e branch de preview separados — o preview da Vercel aponta para um branch do Neon, nunca para a base de produção |
| Mídia | **Cloudflare R2** | `@payloadcms/storage-s3` no endpoint S3-compatível. Bucket com domínio público próprio |
| E-mail | **Resend** | `@payloadcms/email-resend`. Notificação de lead, recuperação de senha e convite de usuário |
| Hospedagem | **Vercel** | Next.js + admin do Payload no mesmo deploy |
| DNS | Registrador atual | Mantido simples. Cloudflare só se houver necessidade concreta — ver nota abaixo |

**Sobre o Neon.** O modo serverless fecha conexão ociosa, o que combina com funções serverless. Ponto de atenção na FASE 3: usar a string de conexão com pool e configurar o adaptador para não abrir conexão por requisição. É o erro mais comum nessa combinação e aparece como lentidão intermitente, não como falha clara.

**Sobre o R2.** Escolha correta aqui — a Vercel tem sistema de arquivos efêmero, então upload precisa ir para armazenamento externo de qualquer forma, e o R2 não cobra egress. As variantes de imagem são geradas no upload pelo Payload e servidas do bucket.

**Sobre o Resend.** Exige verificação do domínio com SPF e DKIM. Recomendo usar um subdomínio dedicado para envio transacional, para que qualquer problema de reputação não afete o e-mail comercial `contato@gsrsistemas.com`.

**Sobre o DNS.** Mantido no registrador atual, sem Cloudflare por ora, conforme decidido. A Vercel já entrega CDN e certificado. O Cloudflare entraria se aparecer necessidade concreta — WAF, regras de redirect na borda ou proteção contra abuso. **Uma observação importante:** a correção do `www` (runbook em `technical-seo.md` §2) é feita no servidor/DNS atual e é independente dessa decisão. Ela precisa acontecer de qualquer forma, e sem Cloudflare no caminho ela fica mais simples de verificar.

Todas as credenciais em variável de ambiente do servidor. Nenhuma chega ao cliente.

---

## 9. Estrutura de arquivos

```
src/
  collections/
    Pages.ts  Services.ts  Locations.ts  CaseStudies.ts  Posts.ts
    Testimonials.ts  FAQs.ts  Redirects.ts  Leads.ts
    Technologies.ts  Media.ts  Users.ts
  globals/
    SiteSettings.ts  Header.ts  Footer.ts  SEOSettings.ts
  fields/
    seo.ts  slug.ts  hero.ts  cta.ts
  blocks/
    index.ts + um arquivo por bloco
  hooks/
  payload.config.ts
```

---

## 10. Divergências em relação ao briefing

| Briefing | Aqui | Motivo |
|---|---|---|
| `Categories` como collection | `select` em `Posts` | 6 posts não sustentam páginas de categoria. Promovível depois |
| `breadcrumbs` como campo em `Pages` | Derivado da URL e de `parent` | Dado armazenado pode divergir da estrutura real |
| `status` como campo | `_status` nativo | Dois campos de estado entrariam em conflito |
| `tags` em `Posts` | `topics`, sem página pública | Você mesmo pediu para não indexar tags sem valor |
| — | `Technologies` (nova) | Evita redigitar tecnologia em cada serviço e case |
| — | `needsReview`, `clientApproved`, `showUpdatedDate`, `isDecorative` | Travas que impedem publicar conteúdo não verificado |
| — | `showPortfolioInNav` em `SiteSettings` | Entrada do portfólio no menu vira decisão editorial, não contagem |
| `coordinates` | Fora por ora | Entra com `LocalBusiness` |

**Revisão após a aprovação da FASE 2:** a validação rígida de conteúdo local (mínimo de caracteres) foi substituída por aviso no painel mais checklist editorial — ver 3.3. As demais travas continuam, porque tratam de autorização e verificação de fato, não de julgamento de qualidade.

---

## 11. Pendências

| # | Pendência | Efeito |
|---|---|---|
| 1 | Razão social | `legalName` fica vazio |
| 2 | Ano de fundação | `foundingYear` vazio; nenhuma menção a tempo de mercado no site |
| 3 | Endereço é local de atendimento? | `isPhysicalLocation` fica `false`; sem `LocalBusiness`, sem endereço exibido |
| 4 | Categorias iniciais do blog | Valores do `select` |
| 5 | Projetos reais com autorização de cliente | Cases e entrada do portfólio no menu |

**Resolvidas nesta revisão:** infraestrutura definida (Neon, R2, Resend, Vercel) · plataformas de e-commerce (Shopify e WooCommerce) · portfólio sem regra de quantidade codificada · validação editorial das páginas locais.
