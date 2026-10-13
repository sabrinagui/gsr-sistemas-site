# SEO técnico — GSR Sistemas

FASE 2. Documento para aprovação.

---

## 1. Regras de domínio e URL

| Item | Decisão |
|---|---|
| Host canônico | `gsrsistemas.com` — sem `www` |
| Protocolo | HTTPS obrigatório |
| Barra final | **Sem** (`trailingSlash: false`) |
| Caixa | minúsculas |
| Acentuação | slugs sem acento e sem cedilha (`sao-luis-ma`, `criacao-de-sites`) |
| Parâmetros | nenhuma URL indexável depende de query string |

Consequências, todas resolvidas por 301 e sem cadeia:

```
http://gsrsistemas.com/x        → https://gsrsistemas.com/x
https://www.gsrsistemas.com/x   → https://gsrsistemas.com/x
https://gsrsistemas.com/x/      → https://gsrsistemas.com/x
https://gsrsistemas.com/X       → https://gsrsistemas.com/x
```

**Consistência total**, que é o que você pediu: `canonical`, `sitemap.xml`, `href` de link interno, `og:url` e todo `@id`/`url` de JSON-LD usam a mesma função:

```ts
// src/lib/seo/url.ts
absoluteUrl(path: string): string   // única fonte de URL absoluta do projeto
```

Nenhum lugar do código concatena `https://gsrsistemas.com` à mão. Regra verificável em revisão: buscar pelo domínio literal fora de `url.ts` e do `.env` não deve retornar nada.

---

## 2. Correção do `www` — runbook

**Aprovado para execução.** Independente do rebuild, pode ser feito agora. O requisito inegociável é o da pré-condição: `defjoias.app.br` continua funcionando de forma independente antes, durante e depois.

**Pré-condição:** `defjoias.app.br` responde corretamente e de forma independente. Verificar antes de qualquer alteração:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://defjoias.app.br/
openssl s_client -connect defjoias.app.br:443 -servername defjoias.app.br </dev/null 2>/dev/null | openssl x509 -noout -subject -dates
```

**Passos**

1. Exportar Search Console — Páginas, Consultas, Links — antes de mexer. Estado congelado para comparação.
2. Criar vhost explícito para `www.gsrsistemas.com` no servidor, com certificado válido para o hostname.
3. Esse vhost responde `301` para `https://gsrsistemas.com{path}`, preservando o path.
4. **Exceção:** `/home/` responde `410 Gone` com página explicativa mínima. Não redireciona para `/`.
5. Confirmar que `defjoias.app.br` continua servindo o app normalmente. É o único vhost que pode responder pelo IP como padrão.
6. Search Console: pedir remoção de `https://www.gsrsistemas.com/home/`.
7. Verificar propriedade de domínio no Search Console — cobre apex e `www` de uma vez.

**Verificação após a mudança**

```bash
curl -sSI https://www.gsrsistemas.com/            # 301 → https://gsrsistemas.com/
curl -sSI https://www.gsrsistemas.com/blog/       # 301 → https://gsrsistemas.com/blog
curl -sSI https://www.gsrsistemas.com/home/       # 410
curl -sSI https://defjoias.app.br/                # 200
echo | openssl s_client -connect www.gsrsistemas.com:443 -servername www.gsrsistemas.com 2>/dev/null | openssl x509 -noout -subject
```

O último comando precisa mostrar um certificado válido para `gsrsistemas.com` — hoje mostra `CN=defjoias.app.br`.

---

## 3. Metadata

`generateMetadata()` centralizado em `src/lib/seo/metadata.ts`. Nenhuma rota monta metadata sozinha.

```ts
buildMetadata({
  title, description, path,
  image, type,            // 'website' | 'article'
  publishedTime, modifiedTime,
  noIndex,
  seo,                    // override vindo do CMS
}): Metadata
```

Cadeia de resolução, do mais específico ao mais genérico:

```
title        : seo.metaTitle → `${title} | GSR Sistemas`
               (Locations: `${title} em ${city}, ${stateCode} | GSR Sistemas`)
description  : seo.metaDescription → excerpt → description → SEOSettings.defaultDescription
og:image     : seo.ogImage → featuredImage → SEOSettings.defaultOGImage
canonical    : seo.canonicalUrl → absoluteUrl(path)
robots       : seo.index/follow → index,follow
```

**Sempre presentes:** `title`, `description`, `canonical`, `og:type`, `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:site_name`, `og:locale` (`pt_BR`), `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.

**Nunca:** `meta keywords`. Não é usada por nenhum buscador e expõe estratégia.

`noindex` automático em `/obrigado`, `/preview/*`, `/admin/*`, respostas 404 e qualquer conteúdo com `_status: draft`.

---

## 4. Redirects

### Camadas

| Camada | O que trata | Onde |
|---|---|---|
| 1 — infra | `www` → apex, HTTP → HTTPS | DNS/servidor + Vercel |
| 2 — estática | Redirects conhecidos na build | `next.config.ts` |
| 3 — dinâmica | Redirects criados no CMS | Middleware + cache |
| 4 — 410 | Conteúdo removido sem substituto | Route handler |

A camada 2 recebe o mapa de migração no seed. É a mais rápida e não toca o banco. A camada 3 existe para os redirects que você criar depois do lançamento, pelo painel.

### Cache da camada 3

O requisito do item 29 do briefing — não consultar o banco a cada requisição:

```
Map em memória, TTL de 5 minutos
  ↓ miss
Consulta Redirects (from = path, active = true)
  ↓
Grava no Map, inclusive o resultado negativo
```

Chaves negativas são o detalhe que faz o cache funcionar: sem elas, toda URL inexistente consulta o banco, e é justamente aí que os bots batem mais.

Invalidação imediata pelo hook `invalidateRedirectCache` ao salvar um redirect.

O middleware consulta o cache **apenas quando a rota não corresponde a nenhuma página existente** — o caminho feliz nunca paga esse custo.

### Duas descobertas da implementação (FASE 3)

**1. `?p=ID` não pode virar entrada de `next.config`.** O Next repassa a query string ao destino, então `/?page_id=20` → `/` viraria um **loop infinito** — a URL redirecionaria para ela mesma indefinidamente. Os 9 redirects de query foram para o proxy, que descarta a query explicitamente. Verificado: `/?page_id=20` responde 301 para `/` e para ali.

**2. `permanent: true` emite 308, não 301.** O Next traduz assim. O Google trata 301 e 308 como equivalentes, mas o mapa documenta 301 e não há motivo para o código divergir do documento — o gerador emite `statusCode: 301` explícito. Verificado no servidor local.

**Nota sobre a convenção do Next 16:** `middleware.ts` foi renomeado para `proxy.ts`. O arquivo é `src/proxy.ts`, com `export default function proxy`.

### Regras

- **Sem cadeia.** Todo `from` aponta para o destino final, com 200. O CSV já está assim, inclusive os `?p=ID`, que hoje passariam por dois saltos.
- **301 só com equivalente semântico.** Sem equivalente: 410 se removido de propósito, 404 se nunca existiu.
- **Nada é redirecionado para `/`** só para evitar 404.
- Antes de cada deploy, um script valida o mapa: `from` duplicado, ciclo, cadeia, destino que responde 404.

### Estados

| Situação | Status |
|---|---|
| URL antiga com equivalente | 301 |
| Conteúdo removido de propósito, sem equivalente | 410 |
| URL que nunca existiu | 404 |
| Teste temporário | 302 |

---

## 5. Sitemap

`/sitemap.xml`, gerado pelo `app/sitemap.ts` a partir do banco.

**Entra:** página pública com `_status: published`, `seo.index: true`, canônica própria e resposta 200.

**Não entra:** rascunho, `noindex`, redirect, 404/410, `/admin`, `/api`, `/preview`, `/obrigado`, `/links` (se mantida), paginação, filtro, busca.

`lastModified` é o `updatedAt` real do documento. Nunca a data do build — publicar o site não altera a data de conteúdo que não mudou.

Sem `changefreq` nem `priority`: o Google os ignora.

Sitemap index só quando passar de ~500 URLs. No lançamento são ~21 — um arquivo basta.

Redirect permanente dos sitemaps do Yoast (`/sitemap_index.xml`, `/post-sitemap.xml`, `/page-sitemap.xml`, `/category-sitemap.xml`, `/author-sitemap.xml`) para `/sitemap.xml`, mantido por ao menos 12 meses.

---

## 6. robots.txt

Gerado por `app/robots.ts`.

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /preview
Disallow: /obrigado

Sitemap: https://gsrsistemas.com/sitemap.xml
```

Sem `Disallow` de CSS ou JS — bloqueá-los impede o Google de renderizar a página.

Em preview e desenvolvimento, `Disallow: /` integral, decidido por variável de ambiente.

`robots.txt` não protege nada. Admin, API e preview têm autenticação ou token próprio — o `Disallow` é só higiene de crawl.

---

## 7. Dados estruturados

Helpers em `src/lib/seo/schema/`, todos alimentados por dado real do CMS. Nenhum valor literal no código.

| Schema | Onde | Estado |
|---|---|---|
| `Organization` | todas as páginas | **Ativo** |
| `WebSite` | home | Ativo |
| `WebPage` | todas | Ativo |
| `BreadcrumbList` | todas menos a home | Ativo |
| `Service` | páginas de serviço e locais | Ativo |
| `BlogPosting` | artigos | Ativo |
| `CreativeWork` | cases | Ativo quando houver cases |
| `FAQPage` | páginas com FAQ visível | **Opcional** — ver 7.2 |
| `LocalBusiness` / `ProfessionalService` | — | **Construído e desligado** — ver 7.1 |
| `AggregateRating` / `Review` | — | **Não implementado** — ver 7.3 |

### 7.1 `LocalBusiness` fica pronto e inativo

Conforme sua decisão. Enquanto `SiteSettings.address.isPhysicalLocation` for `false`:

- emite-se apenas `Organization`, com `name`, `url`, `logo`, `description`, `email`, `telephone`, `sameAs` e `areaServed`
- **nenhum `address` é emitido** — nem parcial
- nenhum endereço aparece em página, rodapé ou contato

`areaServed` comunica a atuação sem afirmar endereço físico:

```json
"areaServed": [
  { "@type": "City",  "name": "São Luís" },
  { "@type": "State", "name": "Maranhão" },
  { "@type": "Country", "name": "Brasil" }
]
```

Quando você confirmar o endereço e que ele é local de atendimento, marcar o checkbox passa a emitir `ProfessionalService` com `address`, `geo` e `openingHours`. Sem alteração de código.

**Isso é coerente com o Google Business Profile como empresa de área de serviço** — perfil sem endereço exibido, com área de atendimento declarada. Site e perfil dizendo a mesma coisa é o que sustenta o SEO local; site com endereço e perfil sem endereço é inconsistência de NAP.

`Organization` sozinho não prejudica o ranking local. Quem determina posição no pacote local é o Google Business Profile, não o schema.

### 7.2 FAQ — visível sempre, JSON-LD opcional

**Decisão aprovada:** o FAQ é um componente de conteúdo da página, não uma jogada de SEO. Fica visível em `/criacao-de-sites`, `/desenvolvimento-de-sistemas`, nas páginas locais e onde mais fizer sentido, respondendo dúvidas reais de quem vai contratar.

O `FAQPage` em JSON-LD **não é obrigatório**. Motivo: o Google restringiu o rich result de FAQ a sites de governo e saúde, então a marcação não traz o benefício que trazia. Continua sendo marcação válida e ajuda na compreensão da página, mas não justifica virar requisito.

Implementação: um campo `emitFaqSchema` (checkbox, default `false`) por página com FAQ. Ligado, o JSON-LD é emitido — e aí valem as condições de sempre:

1. o FAQ está visível na página, sem clique necessário para revelar o conteúdo
2. pergunta e resposta no schema são idênticas ao texto renderizado
3. a página é de serviço ou local — não é artigo, não é home

Assim a decisão fica reversível por página, sem deploy, e nenhuma página emite schema de FAQ por inércia.

### 7.3 Avaliações — exibir sim, marcar não

**Decisão aprovada.** As 5 avaliações do Google são reais e vão para `Testimonials` como prova social visível, com nome, texto, fonte e data — inclusive com link para a avaliação original quando houver.

**Nenhum `AggregateRating` nem `Review` é emitido para a própria GSR.** Razões:

1. As diretrizes do Google desencorajam marcação de avaliação **auto-servida** — a empresa marcando avaliações sobre si mesma no próprio site. É a fonte mais comum de ação manual por spam de dados estruturados.
2. As avaliações são do Google Business Profile. Elas já aparecem no perfil, que é onde produzem efeito. Duplicá-las no site não acrescenta e adiciona risco.
3. Cinco avaliações, todas de 10/04/2024, é base pequena e concentrada. Marcá-la como `AggregateRating` chama atenção sem trazer benefício proporcional.

O campo `rating` fica armazenado no CMS. Se a decisão mudar, o dado está lá.

Isso não vale para `Review` emitido por terceiros sobre a GSR em outros sites — esse é caso deles, não nosso, e não há nada a fazer no nosso schema.

### Validação

Antes do lançamento, todo template passa por Rich Results Test e Schema.org Validator. Zero erro; avisos analisados um a um.

Nenhuma propriedade preenchida com valor plausível. Dado ausente é propriedade ausente.

---

## 8. Cabeçalhos HTTP

| Cabeçalho | Valor |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | Ver abaixo |

CSP entra primeiro em `Report-Only`, ajustada com os relatórios reais, e só depois é aplicada. Precisa acomodar GTM, GA4 e Clarity — CSP restritiva demais quebra analytics silenciosamente.

O site atual já tem HSTS, `X-Frame-Options` e `nosniff`. Faltam `Referrer-Policy`, `Permissions-Policy` e CSP.

---

## 9. Imagens

Estado atual: 62 mídias sem alt, seis arquivos de 2560px, PNG de até 1 MB, um único WebP, imagens sem dimensão no HTML.

Regras do projeto novo:

- `next/image` em toda imagem de conteúdo. `formats: ['image/avif', 'image/webp']`
- `width` e `height` sempre, ou `fill` com contêiner de proporção fixa. **Zero CLS por imagem**
- `sizes` correto — imagem de 400px de exibição nunca baixa arquivo de 3000px
- Uma imagem de hero por página com `priority`. Nenhuma outra
- Todo o restante com `loading="lazy"` e `decoding="async"`
- Nomes descritivos em kebab-case: `dashboard-sistema-gestao.webp`, não `IMG_2983.jpg` nem `4.png`
- `alt` obrigatório no `Media`, com exceção explícita via `isDecorative`
- Sem `alt` gerado a partir de filename ou keyword

Antes de subir, toda imagem passa por redimensionamento para o máximo realmente exibido e por compressão. O Payload gera as variantes; o original não é servido.

**Entrega:** os arquivos ficam no **Cloudflare R2**, servidos por domínio público próprio do bucket, com cache longo e nome versionado. Esse domínio entra em `next.config.ts` como `remotePatterns` para que o `next/image` possa otimizá-los.

**LCP:** a home tem hoje um vídeo de 375 KB no topo. Recomendo substituir por imagem estática otimizada, ou carregar o vídeo depois do LCP, sem `autoplay` bloqueante. Vídeo em hero é a causa isolada mais comum de LCP ruim em mobile.

---

## 10. Fontes

- `next/font/local`, self-hosted, `.woff2`
- **Duas famílias no máximo**, com poucos pesos — títulos e texto
- `font-display: swap`, `preload` só nos pesos usados acima da dobra
- Métricas de fallback ajustadas para não haver deslocamento na troca

Sobre a escolha tipográfica: nada da paleta padrão de interface gerada — a fonte é parte da identidade e vai ser escolhida na fase de design, não herdada do default.

---

## 11. Core Web Vitals

| Métrica | Meta | O que a garante |
|---|---|---|
| LCP | ≤ 2,5 s | Server Components, hero estático otimizado, `priority`, sem JS bloqueante |
| INP | ≤ 200 ms | Pouco JS no cliente, sem biblioteca de animação pesada |
| CLS | ≤ 0,1 | Dimensão em toda imagem, espaço reservado, fonte com fallback ajustado |

Orçamento de página para as principais:

| | Meta |
|---|---|
| HTML | < 50 KB (hoje: 161 KB) |
| JS no cliente | < 100 KB comprimido |
| CSS | < 30 KB |
| Requisições | < 30 (hoje: 74 só de script e estilo) |

Renderização: Static Generation com ISR nas páginas de conteúdo; SSR só onde houver dado por requisição. Client Component apenas em menu mobile, formulário, acordeão de FAQ e player — cada um justificado em revisão.

Lighthouse ≥ 95 nas quatro categorias, medido em mobile com throttling, nas páginas: `/`, `/criacao-de-sites`, `/desenvolvimento-de-sistemas`, `/sao-luis-ma/criacao-de-sites`, um artigo.

---

## 12. Analytics

Preservados: **GA4 `G-FVHZ0NLLXC`** e **GTM `GTM-539GQMP8`**. Sem propriedade nova — o histórico continua.

- Carregados via `next/script` com `strategy="afterInteractive"`. Nunca bloqueiam a renderização
- IDs em `SEOSettings`, por ambiente
- `enableAnalytics` desligado em preview e desenvolvimento, para não poluir os dados
- Clarity entra depois do lançamento, medindo o impacto no INP antes de ficar permanente

### Eventos

| Evento | Disparo |
|---|---|
| `whatsapp_click` | clique em qualquer botão de WhatsApp |
| `phone_click` | clique em `tel:` |
| `email_click` | clique em `mailto:` |
| `contact_form_start` | primeiro campo preenchido |
| `contact_form_submit` | **apenas após resposta de sucesso do servidor** |
| `budget_form_start` | idem |
| `budget_form_submit` | **apenas após sucesso real** |
| `case_study_view` | visualização de case |
| `service_cta_click` | CTA em página de serviço |

Os eventos de submit disparam depois da confirmação do servidor, nunca no clique — clique no botão não é conversão, é intenção.

Parâmetros permitidos: `page_path`, `service`, `location`, `project_type`, `source_page`, `form_id`.

**Nunca enviados ao GA4:** nome, e-mail, telefone, empresa, texto da mensagem. Dado pessoal fica em `Leads`, no banco.

UTMs capturadas na primeira visita, guardadas na sessão e enviadas junto com o lead — não com o evento.

---

## 13. 404 e 410

**404** — página útil, HTTP 404 real, `noindex`. Texto curto, links para Home, Serviços, Blog e Contato, e o WhatsApp. Sem redirect automático, sem busca do "conteúdo mais parecido".

**410** — resposta explícita para conteúdo removido de propósito. Mensagem curta informando que a página não existe mais e alguns links. O 410 acelera a remoção do índice em relação ao 404.

Nenhum dos dois retorna 200. É o item que mais frequentemente quebra em SPA — e é por isso que a arquitetura é server-first.

---

## 14. Formulários

- Validação **server-side** obrigatória. Cliente só melhora a experiência
- Server Action com fallback funcional sem JavaScript quando possível
- Honeypot + verificação de tempo mínimo de preenchimento
- Rate limiting por IP: 5 envios por 10 minutos
- Sanitização de toda entrada antes de gravar
- Erro por campo, em texto, associado ao input via `aria-describedby`
- Sucesso: redirect para `/obrigado` (`noindex`), com evento disparado após confirmação do servidor
- Nenhuma credencial no cliente. Chave de e-mail e banco só em variável de ambiente do servidor

**Envio por Resend.** O lead é gravado em `Leads` **antes** do disparo do e-mail, e a falha no envio não invalida o formulário para o usuário — ela é registrada em log e o lead permanece no banco. Notificação por e-mail é conveniência; o registro é a fonte da verdade. Perder um lead porque o provedor de e-mail estava fora é um erro caro e evitável.

O domínio de envio precisa de SPF e DKIM verificados no Resend. Recomendo subdomínio dedicado para transacional, separado do e-mail comercial.

---

## 15. Acessibilidade

Não é item separado de SEO — HTML semântico correto serve aos dois.

- `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Um `<h1>` por página, sem salto de nível. Tamanho é CSS
- `<label>` associado a todo campo
- Foco visível, navegação por teclado completa, skip link
- Contraste mínimo 4,5:1 em texto
- `aria-*` só quando o HTML nativo não resolve
- Alvo de toque mínimo de 44×44 px

Testado com teclado e leitor de tela nas páginas principais, não só com auditoria automática.

---

## 16. Breakpoints

Mobile primeiro. Verificação em 375, 390, 430, 768, 1024, 1440 e 1920.

Sem rolagem horizontal em nenhuma largura. Tabela e bloco de código com rolagem no próprio contêiner.

---

## 17. Checklist de lançamento

**Antes**

- [ ] `www` corrigido, com certificado válido e 301 para o apex
- [ ] `www.gsrsistemas.com/home/` retornando 410
- [ ] `defjoias.app.br` verificado, funcionando de forma independente
- [ ] Exports de Search Console e GA4 salvos em `docs/data/`
- [ ] Todo `from` do mapa de redirects testado, sem cadeia e sem ciclo
- [ ] Sitemap contém só 200 indexável e canônico
- [ ] `robots.txt` correto no ambiente de produção
- [ ] Canonical conferido em todas as páginas
- [ ] Nenhuma URL acessível com e sem barra final
- [ ] Schema validado, sem erro
- [ ] `LocalBusiness` desligado, `Organization` ativo, nenhum endereço exposto
- [ ] Um só número de WhatsApp em todo o site: **(98) 98891-5251**
- [ ] Marca escrita como "GSR Sistemas" em todo lugar
- [ ] Nenhuma métrica, número de clientes ou tempo de mercado não confirmado
- [ ] Toda imagem com alt revisado ou marcada como decorativa
- [ ] Formulários testados, com e sem JavaScript
- [ ] 404 retornando 404, 410 retornando 410
- [ ] Lighthouse ≥ 95 nas cinco páginas principais
- [ ] Nenhum link interno quebrado ou apontando para redirect
- [ ] GA4 e GTM disparando com os IDs existentes
- [ ] Neon: branch de produção separado do de preview; conexão com pool configurada
- [ ] R2: bucket público acessível, domínio da mídia em `remotePatterns`
- [ ] Resend: SPF e DKIM verificados; lead gravado no banco mesmo se o e-mail falhar

**Depois**

- [ ] Sitemap enviado no Search Console
- [ ] Propriedade de domínio verificada
- [ ] Remoção de `www.gsrsistemas.com/home/` solicitada
- [ ] Google Business Profile alinhado ao site, com links para as páginas locais
- [ ] Monitorar Páginas, Redirects, Duplicadas e "Rastreada — não indexada" em 7, 30, 60 e 90 dias
- [ ] Comparar posições com o export pré-migração
- [ ] Core Web Vitals com dados de campo após 28 dias

---

## 18. Infraestrutura

Definida. Detalhamento em `payload-schema.md` §8.1.

| Camada | Serviço |
|---|---|
| Banco | Neon (PostgreSQL) |
| Mídia | Cloudflare R2 |
| E-mail | Resend |
| Hospedagem | Vercel |
| DNS | Registrador atual, simples. Cloudflare só se houver necessidade concreta |

A ausência do Cloudflare por ora **simplifica** a correção do `www`: a mudança é feita direto no servidor e no DNS atual, e a verificação por `curl` reflete o comportamento real, sem camada de borda no meio.

---

## 19. Pendências

| # | Pendência | Efeito |
|---|---|---|
| 1 | Endereço é local de atendimento? | `LocalBusiness` fica desligado |
| 2 | Razão social | `legalName` vazio |
| 3 | Acesso ao Search Console e ao GA4 | Exports, verificação de propriedade e envio do sitemap |
| 4 | Subdomínio para envio transacional | Configuração de SPF/DKIM no Resend |

**Resolvidas nesta revisão:** banco (Neon) · mídia (R2) · e-mail (Resend) · hospedagem (Vercel) · DNS (sem Cloudflare por ora) · runbook do `www` aprovado · FAQ schema opcional · avaliações sem `AggregateRating`/`Review`.
