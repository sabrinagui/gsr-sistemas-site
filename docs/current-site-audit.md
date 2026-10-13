# Auditoria do site atual — gsrsistemas.com

Data da coleta: 28/08/2026
Método: inspeção HTTP direta (curl), REST API do WordPress (`/wp-json/wp/v2/`), sitemaps do Yoast, DNS e certificado TLS.
Escopo: tudo que é observável publicamente. Dados de Search Console, Analytics e backlinks **não** estão incluídos — ver seção 10.

---

## 1. Resumo executivo

O site é pequeno: **7 posts, 4 páginas, 1 categoria, 0 tags, 62 arquivos de mídia**. Todo o conteúdo comercial vive em uma única página (a home), construída em Elementor sobre o tema `hello-elementor`.

Isso significa duas coisas para a migração:

- **O risco de perda é baixo.** Há pouquíssimas URLs a preservar e nenhuma estrutura complexa. A migração é tecnicamente segura.
- **Praticamente não há autoridade construída para proteger.** Não existem páginas de serviço, não existe página local, não existe portfólio com URL própria. O ganho da reconstrução virá quase todo de conteúdo novo, não de preservação.

Há, porém, **um problema grave e ativo** que precisa ser resolvido antes de qualquer outra coisa: o hostname `www.gsrsistemas.com` serve o sistema de outro cliente.

---

## 2. Problema crítico — `www` serve o sistema D&F Joias

Confirmado por DNS, certificado e conteúdo:

| Verificação | Resultado |
|---|---|
| DNS `gsrsistemas.com` | `145.223.30.76` |
| DNS `www.gsrsistemas.com` | alias → `145.223.30.76` (mesmo IP) |
| DNS `defjoias.app.br` | `145.223.30.76` (mesmo IP) |
| Certificado TLS servido em `www.gsrsistemas.com` | `CN=defjoias.app.br`, SAN: `defjoias.app.br`, `www.defjoias.app.br` |
| `https://www.gsrsistemas.com/` | HTTP **200** — `<title>D&F Joias - Gestão de Entregas</title>` |
| `https://www.gsrsistemas.com/home/` | HTTP **200** — mesmo conteúdo, `<h1>JavaScript Necessário</h1>` |
| `https://gsrsistemas.com/home/` (apex) | 301 → `/` |

**Diagnóstico:** o servidor não tem vhost configurado para `www.gsrsistemas.com`. Toda requisição a esse hostname cai no vhost padrão da máquina, que é o app D&F Joias. Não é um redirect mal feito — é um hostname inteiro apontando para o site errado.

**Consequências de SEO em vigor hoje:**

1. Existe um segundo hostname da marca retornando 200 com conteúdo de terceiro, indexado pelo Google. É isso que explica `www.gsrsistemas.com/home/` aparecer nos resultados associado a "D&F Joias".
2. O certificado é inválido para `www` — qualquer visitante que digite `www.gsrsistemas.com` recebe alerta de segurança do navegador.
3. Não há canonicalização entre `www` e apex, porque `www` nem sequer é o mesmo site.
4. O app D&F Joias, um sistema interno, está exposto sob o domínio da GSR.

**Ação:** corrigir no DNS/servidor **antes** do lançamento. `www` deve responder 301 para o apex. A URL `/home/` especificamente deve retornar **410**, nunca 301 para a home da GSR — o conteúdo indexado não é da GSR e um 301 para `/` sinalizaria equivalência falsa. Complementar com pedido de remoção de URL no Search Console.

**Pendência com o cliente:** confirmar que o sistema D&F Joias segue acessível em `defjoias.app.br` e que ninguém o usa via `www.gsrsistemas.com`, para que a correção não derrube o acesso de um cliente ativo.

---

## 3. Inventário de URLs

### 3.1 Posts (7)

| URL | Título | Publicado |
|---|---|---|
| `/2024/09/04/criacao-de-sites-por-que-ter-um-site-profissional-e-essencial-para-o-sucesso-do-seu-negocio/` | Criação de Sites: Por que ter um site profissional é essencial… | 04/09/2024 |
| `/2024/09/04/as-principais-tendencias-em-criacao-de-sites-para-2024/` | As principais tendências em criação de sites para 2024 | 04/09/2024 |
| `/2024/09/04/por-que-investir-no-desenvolvimento-de-sistemas-personalizados-para-o-seu-negocio/` | Por que investir no desenvolvimento de sistemas personalizados… | 04/09/2024 |
| `/2024/12/23/criacao-de-sites-em-sao-luis/` | Criação de Sites em São Luís - GSR Sites e Sistemas | 23/12/2024 |
| `/2025/08/14/7-erros-que-estao-matando-as-vendas-do-seu-site-e-como-corrigir-hoje/` | 7 Erros Que Estão Matando as Vendas do Seu Site | 14/08/2025 |
| `/2025/08/14/como-um-site-otimizado-para-seo-local-pode-triplicar-seus-clientes-em-90-dias/` | Como um Site Otimizado para SEO Local Pode Triplicar Seus Clientes em 90 Dias | 14/08/2025 |
| `/2025/11/19/otimize-sua-gestao-por-que-todo-sistema-web-precisa-de-um-dashboard-profissional/` | Otimize sua Gestão: Por Que Todo Sistema Web Precisa de um Dashboard Profissional | 19/11/2025 |

O post de São Luís tem cerca de **2.070 palavras** — é o único conteúdo substancial do site.

Nenhum post foi atualizado após a publicação (`modified` = `date` em todos os 7). Nenhum tem tags. Todos estão na categoria genérica `sem-categoria`.

O permalink usa `/AAAA/MM/DD/slug/`. Estrutura ruim: sinaliza obsolescência, produz URLs longas e cria três níveis de arquivo de data indexáveis por post.

### 3.2 Páginas (4)

| URL | Título | Observação |
|---|---|---|
| `/` | Home | Todo o conteúdo comercial do site |
| `/blog/` | Blog | Listagem |
| `/links/` | Links | Página link-in-bio — precisa de decisão |
| `/pagina-exemplo/` | Página de exemplo | Página padrão do WordPress, **publicada e indexável** |

### 3.3 Arquivos e URLs de sistema indexáveis

Todas retornam **200 sem `<meta name="robots">`**, ou seja, indexáveis:

- `/category/sem-categoria/` — única categoria, sem valor
- `/author/sabrina/`
- `/2024/`, `/2024/09/`, `/2024/12/`, `/2024/12/23/`, `/2025/`, `/2025/08/`, `/2025/11/` — arquivos de data, duplicam o blog
- `/?s=termo` — resultados de busca interna
- `/e-floating-buttons/floating-08/` e `/floating-08-2/` — custom post type de um plugin de botão flutuante, listados no sitemap
- `/feed/`, `/comments/feed/`
- `/wp-json/wp/v2/*` — API pública, expõe todo o conteúdo

O `robots.txt` atual é `Disallow:` vazio — libera tudo. Não há nenhuma exclusão configurada, nem no robots nem em meta robots.

### 3.4 Não existem hoje

`/sobre`, `/contato`, `/servicos`, `/portfolio`, `/orcamento` — todos retornam **404**. São apenas âncoras na home (`/#sobrenos`, `/#portfolio`, `/#contato`).

---

## 4. Conteúdo e dados reais a preservar

Coletado do site. **Precisa de confirmação do cliente antes de reutilizar** — está marcado o que é verificável e o que não é.

**Identidade e contato**

- Nome usado no site: alterna entre **GSR Sistemas**, **GSR Sites e Sistemas** e **GSR Criação de Sites e Sistemas**. Inconsistente.
- E-mail: `contato@gsrsistemas.com`
- Telefone/WhatsApp exibido no rodapé: **(98) 99122-8060**
- Endereço exibido: **"Avenida Daniel de La Touche, São Luís, Maranhão"** — sem número, bairro ou CEP
- Instagram: `instagram.com/gsrsistemas`
- Autor dos posts: `sabrina`

**Inconsistência de NAP — corrigir antes do lançamento.** A home usa **três números de WhatsApp diferentes**:

- `wa.me/5598991671028` — botão do banner principal
- `wa.me/+5598991228060` — rodapé, bate com o telefone exibido
- `wa.me/558998991228060` — **número inválido**, dígitos a mais; esse link está quebrado hoje

**Prova social encontrada**

- Widget Trustindex: "EXCELENTE — com base em **5 avaliações**" do Google
- Depoimentos exibidos, todos datados de 10/04/2024: Carlos Adriano, Marcio Andson, Renato Mesquita
- O texto "Sobre nós" afirma **"mais de 10 anos de experiência"** — precisa de confirmação; não há nada no site que sustente

**Serviços descritos hoje:** Sites Responsivos, E-commerce, Sistemas Sob Medida, Manutenção e Suporte.

**Portfólio:** a seção "Veja alguns dos nossos projetos" existe, mas **não tem nenhum texto** — apenas imagens (`1.png`…`4.png`, 1080×1080). Não há nome de projeto, cliente, descrição ou link. Na prática, não existe portfólio a migrar; os case studies terão de ser construídos do zero com o cliente.

**Analytics já instalado:** GA4 `G-FVHZ0NLLXC` e GTM `GTM-539GQMP8`. Reaproveitar as mesmas propriedades no site novo preserva o histórico. Microsoft Clarity não está instalado.

---

## 5. Problemas técnicos de SEO encontrados

**Metadados**

- `<title>` da home: `Home - GSR Criação de Sites e Sistemas %` — o `%` literal é uma variável quebrada do Yoast, visível na SERP
- `og:title` da home é apenas `Home`
- Títulos dos posts ficam longos demais pela concatenação do nome do site — o post de São Luís gera um title de 106 caracteres
- Não há `og:image` dedicada por post; a OG da home é uma imagem 1080×1080

**Dados estruturados**

- Existe `Organization` e `WebSite` gerados pelo Yoast, mas **sem `address`, sem `telephone`, sem `LocalBusiness`/`ProfessionalService`**
- `sameAs` lista apenas o Instagram
- Para uma empresa cuja estratégia é SEO local, a ausência de schema local é uma lacuna direta

**Hierarquia de headings**

- A home vai de `H1` direto para `H5` nos cards de serviço — pula H2, H3 e H4
- O aviso de copyright do rodapé está marcado como `H2`
- Headings escolhidos por tamanho visual, não por estrutura

**Imagens**

- **62 de 62 arquivos da biblioteca de mídia estão sem `alt`.** Não é uma amostra: é a totalidade.
- Nomes de arquivo sem significado: `1.png`, `2.png`, `3.png`, `4.png`, `Frame-2121457817-1.png`, `Design-sem-nome-10.png`, `Imagem-1.png`
- Imagens muito acima do necessário: seis arquivos com 2560px de largura, incluindo `saas-concept-collage-scaled.jpg` (924 KB), `side-view-woman-working-laptop-scaled.jpg` (565 KB) e `4.png` (473 KB)
- Um screenshot de 1366×5319 e 1 MB (`screencapture-mcmmarketingdigital…`)
- Praticamente tudo em PNG/JPEG; há um único `.webp` na biblioteca inteira
- Várias imagens da home são servidas sem `width`/`height` no HTML — causa CLS
- Fotos de banco de imagens genéricas: `side-view-woman-working-laptop`, `close-up-man-writing-code-laptop`, `maos-femininas-digitando-no-teclado`

**Performance**

- HTML da home: **161 KB**
- **38 `<script>` e 36 folhas de estilo** em uma única página
- Stack: Elementor + Elementor Pro + Happy Elementor Addons + Happy Addons Pro sobre `hello-elementor`
- Animações Lottie carregadas como JSON: `Animation-1725393084291.json` sozinha tem **374 KB**
- Vídeo `video-hero.mp4` (375 KB) no topo da página
- `Cache-Control: max-age=0` e `X-Cache: MISS` no HTML

**Cabeçalhos HTTP** — HSTS, `X-Frame-Options`, `X-Content-Type-Options` e `X-XSS-Protection` já estão presentes. Faltam CSP e `Referrer-Policy`.

**Arquitetura**

- Uma única página comercial concorrendo com todos os termos ao mesmo tempo: criação de sites, sistemas, e-commerce, manutenção
- Nenhuma página de serviço, nenhuma página local, nenhum case com URL própria
- Os links internos existentes apontam quase todos para âncoras da home
- Não há breadcrumbs

---

## 6. Riscos da migração

| Risco | Gravidade | Mitigação |
|---|---|---|
| Corrigir o `www` derruba acesso ativo ao sistema D&F Joias | **Alta** | Confirmar com o cliente que o acesso é feito por `defjoias.app.br` antes de mexer |
| Perder o ranking de `/2024/12/23/criacao-de-sites-em-sao-luis/` | **Alta** | É a URL legada de maior valor. 301 direto para `/sao-luis-ma/criacao-de-sites` e reaproveitar o conteúdo lá |
| Trocar o permalink de todos os 7 posts | Média | Todos mapeados em `migration-url-map.csv`, sem cadeias: 301 direto para o destino final |
| Reindexação total, já que toda URL de post muda | Média | Redirects implementados no dia 1, sitemap enviado no lançamento, monitorar Search Console por 90 dias |
| Perder o histórico de GA4 | Baixa | Reutilizar `G-FVHZ0NLLXC` e `GTM-539GQMP8` |
| Perder imagens indexadas no Google Imagens e hotlinks | Baixa | 301 de `/wp-content/uploads/*` para os novos caminhos, ao menos para as imagens em uso |
| Backlinks apontando para URLs desconhecidas | **Não avaliado** | Depende de dados aos quais não tenho acesso — ver seção 10 |
| Perder o widget de avaliações Trustindex | Baixa | As 5 avaliações do Google continuam existindo no perfil; reimplementar exibindo apenas o que for real |

---

## 7. O que não deve ser mantido

- Estrutura de permalink com data
- Categoria `sem-categoria` e a taxonomia de tags, que está vazia
- `/pagina-exemplo/` e as URLs `e-floating-buttons`
- Arquivos de data e resultados de busca indexáveis
- Elementor, Happy Addons e a pilha de 38 scripts
- Imagens de banco genéricas
- A afirmação "mais de 10 anos de experiência", a menos que o cliente confirme
- O título "…Pode Triplicar Seus Clientes em 90 Dias" — promessa não verificável

---

## 8. Decisões que precisavam ser tomadas antes da FASE 2

> **Estado após a aprovação da FASE 2.** Resolvidas: WhatsApp oficial — **(98) 98891-5251**, fonte única em `SiteSettings` · marca padronizada como **GSR Sistemas** · CNPJ **45.971.007/0001-99** · D&F Joias confirmado em `defjoias.app.br`, `www` tratado como erro de configuração · `LocalBusiness` preparado e desligado até a confirmação do endereço.
> Ainda abertas: **4** (tempo de mercado), **6** (razão social), **7** (projetos reais para os cases) e a decisão sobre `/links` (item 1).

1. **`/links/`** — ainda é usada na bio do Instagram? Se sim, recriar em `/links` com `noindex,follow`. Se não, 410.
2. **Qual é o WhatsApp oficial?** Há três números no site, um deles inválido. O site, o schema e o Google Business Profile precisam usar um só.
3. **Endereço completo** — número, bairro e CEP. Sem isso não dá para montar `LocalBusiness` nem manter NAP consistente com o Google Business Profile.
4. **"Mais de 10 anos de experiência"** — é verdadeiro? Desde que ano a GSR opera?
5. **Nome canônico da marca** — "GSR Sistemas" é o recomendado; já é o que está no schema e no rodapé.
6. **Razão social e CNPJ** — para `legalName` no schema e para a página Sobre.
7. **Projetos reais para os case studies** — nome do cliente, segmento, o que foi feito, autorização de divulgação. Hoje não existe nenhum conteúdo de portfólio a migrar.
8. **D&F Joias** — confirmar que o sistema não é acessado por `www.gsrsistemas.com`.

---

## 9. Sequência recomendada para a correção do `www`

1. Confirmar com o cliente o item 8 acima.
2. Documentar o estado atual no Search Console — exportar Páginas, Consultas e Links — **antes** de mexer.
3. Configurar `www.gsrsistemas.com` no servidor com certificado válido e 301 para o apex.
4. `www.gsrsistemas.com/home/` → 410 explícito.
5. Solicitar remoção de URL no Search Console para `www.gsrsistemas.com/home/`.
6. Verificar a propriedade de domínio no Search Console, que cobre apex e `www` de uma vez.

Isso pode ser feito **antes** do site novo ficar pronto e traz ganho imediato.

---

## 10. O que eu não consegui auditar — preciso de você

Estes dados não são acessíveis publicamente. Sem eles, o mapa de URLs está completo em relação ao que o site expõe, mas não em relação ao que o Google conhece.

**Google Search Console** — exportar como CSV e colocar em `docs/data/`

- Desempenho → Consultas, últimos 16 meses
- Desempenho → Páginas, últimos 16 meses
- Indexação → Páginas: a lista completa, incluindo "Rastreada — não indexada no momento" e "Descoberta — não indexada"
- Links → Páginas mais vinculadas externamente e domínios de origem
- Confirmar se `www.gsrsistemas.com` está verificado como propriedade separada

**Google Analytics 4** (`G-FVHZ0NLLXC`)

- Páginas de destino por sessões orgânicas, últimos 12 meses
- Isso identifica URLs que recebem tráfego e podem não estar no sitemap

**Backlinks** — export do Ahrefs, SEMrush ou do próprio Search Console, com as páginas de destino. É o único jeito de garantir que nenhuma URL com link externo será perdida.

**Acesso ao WordPress** — para exportar o conteúdo completo dos posts em vez de raspar o HTML renderizado, e para conferir se há rascunhos ou conteúdo despublicado que valha migrar.

**Google Business Profile** — o NAP exato cadastrado hoje, para alinhar com o site.

Assim que esses exports existirem, eu reviso `migration-url-map.csv` incluindo qualquer URL que apareça neles e ainda não esteja mapeada.
