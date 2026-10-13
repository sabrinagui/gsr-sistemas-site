# docs/data

Diretório preparado para receber os exports que ainda não temos. Nada aqui bloqueia a FASE 2, mas o mapa de migração e o mapa de keywords só ficam completos depois que estes arquivos existirem.

Coloque os CSV com exatamente estes nomes — os scripts de revisão vão procurar por eles.

## Google Search Console

Propriedade: `gsrsistemas.com` — e também `www.gsrsistemas.com`, se estiver verificada separadamente.

| Arquivo | Onde exportar | Período |
|---|---|---|
| `gsc-queries.csv` | Desempenho → Consultas | 16 meses |
| `gsc-pages.csv` | Desempenho → Páginas | 16 meses |
| `gsc-indexing.csv` | Indexação → Páginas | estado atual |
| `gsc-links.csv` | Links → Páginas mais vinculadas externamente | estado atual |

Do relatório de Indexação, interessam especialmente as categorias **"Rastreada — não indexada no momento"** e **"Descoberta — não indexada"**: é onde aparecem URLs que existem para o Google e não estão em nenhum sitemap.

## Google Analytics 4

Propriedade `G-FVHZ0NLLXC`.

| Arquivo | Relatório | Período |
|---|---|---|
| `ga4-landing-pages.csv` | Páginas de destino, sessões orgânicas | 12 meses |

Serve para achar URLs que recebem tráfego e não estão no sitemap nem no mapa de migração.

## Backlinks

`backlinks.csv` — export do Ahrefs, Semrush ou do próprio Search Console.

Precisa conter a **página de destino** de cada link, não só o domínio de origem. É o único jeito de garantir que nenhuma URL com link externo seja perdida na migração.

## Google Business Profile

`gbp-nap.txt` — texto simples com o que está cadastrado hoje: nome exato, endereço se houver, telefone, categorias, área de atendimento, site.

Serve para conferir a consistência de NAP entre o perfil e o site.

---

## O que acontece quando os arquivos chegarem

1. Toda URL que aparecer nos exports e não estiver em `migration-url-map.csv` é adicionada, com destino analisado individualmente.
2. As consultas reais do Search Console entram em `seo-keyword-map.md` e a priorização é revisada.
3. As páginas com tráfego ou backlink sobem de prioridade no mapa de redirects.
4. A lista de imagens com tráfego de Google Imagens define quais `/wp-content/uploads/*` precisam de 301.

Isso precisa acontecer **antes** do lançamento, não depois.

---

## Nota

Estes arquivos podem conter dados de negócio. Se o projeto for versionado em repositório público, adicione `docs/data/*.csv` ao `.gitignore` e mantenha só este README.
