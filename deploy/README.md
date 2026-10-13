# Deploy da GSR Sistemas

## Estrutura

- `Dockerfile`: Next standalone, Node 22, sharp e usuário 1001 sem privilégios.
- `docker-compose.yml`: banco, migração, app e backup opcional, todos da GSR.
- `.github/workflows/deploy.yml`: build no GitHub, imagens SHA/latest no GHCR e SSH.
- `deploy/remote.mjs`: única rotina administrativa; valida SHA e restringe o deploy.
- `deploy/server.env.example`: modelo sem segredos para o servidor.
- `deploy/export-windows.ps1`: exportação somente leitura no Windows.
- `deploy/schema-fingerprint.sql`: comparação estrutural para a importação inicial.
- `src/migrations`: migrations e snapshots gerados pelo Payload.

Não há scripts `.sh` no projeto. Os comandos curtos das tarefas estão no Compose.
Relatórios do servidor e backups ficam fora do repositório.

## Isolamento e execução

Pasta `/opt/gsr-site`, projeto Compose `gsr-site`, containers `gsr-app` e `gsr-db`.
Rede `gsr-network` em `10.203.20.0/24`, sem sobreposição constatada na instalação.
Volumes `gsr-db-data` e `gsr-media`; banco PostgreSQL 18 sem porta publicada;
app somente em `127.0.0.1:13020`. Confirmar porta/rede novamente antes de alterações.
O SaaS `/www/wwwroot/gsr-sistemas` e o WordPress são projetos independentes.

O serviço `gsr-migrate` exige `GSR_MIGRATIONS_READY=1`, espera o banco saudável,
executa o CLI e precisa terminar com sucesso para o Compose iniciar o app.
O app executa `node server.js` diretamente, sem entrypoint customizado.
`push` fica desligado em produção; autoRun de jobs só roda no processo contínuo
normal, nunca durante build ou migrations. Logs Docker têm limite de tamanho.

A imagem inclui dependências de produção e fontes necessárias ao CLI do Payload,
além do standalone. O build usa valores fictícios e não acessa o banco real.
Páginas, sitemap e RSS usam dados em execução; os caches de consultas continuam.
`robots.txt` lê SITE_ENV em execução. Preview não deve ser publicado sem noindex.
Uploads persistem em `/app/media`, dono UID/GID 1001. R2 não é necessário.
Sem Resend em produção, emails ficam desativados sem imprimir mensagens ou tokens.

## Importação inicial

1. Dump PostgreSQL 18 completo, incluindo globals, versões, relacionamentos e jobs.
   Preservar originais do Windows; conferir hashes, contagens e mídia antes de restaurar.
2. Restaurar somente `gsr` e comparar schema lógico com um banco descartável criado
   pela migration candidata. Ignorar owners, ACLs, OIDs e posição física das colunas.
3. Se equivalentes, após backup, substituir só o marcador `dev`/batch -1 por
   `20261013_211955_initial`/batch 1. Não recriar tabelas existentes do dump.
   Se houver diferenças, parar e reconciliar explicitamente antes de marcar baseline.
4. Conferir migrate:status, contagens, globals, imagens e checksums. Só então ativar
   GSR_MIGRATIONS_READY. Toda edição de `.env` exige backup datado, modo 600.

Importação de 13/10/2026 concluída. Comprovante privado no servidor:
`/opt/gsr-site/backups/import-20261013-214254/verification.json`.
Não colocar dumps, mídia original, secrets ou comprovantes privados no Git.

## Backup

O serviço opcional `gsr-backup` faz pg_dump custom, valida catálogo, copia mídia,
gera SHA256 e retém snapshots pontuais por 14 dias quando executado. O checkpoint
inicial de importação fica numa subpasta e não entra nessa limpeza. Nenhum volume
é removido. Os backups periódicos ficam a cargo do aaPanel e da Hostinger;
não há agendamento diário próprio da GSR.

```sh
cd /opt/gsr-site
docker compose -p gsr-site --profile maintenance run --rm --name gsr-backup --no-deps gsr-backup
```

Usar sempre `--name gsr-backup`: o nome único impede duas execuções simultâneas.
O comando acima faz um backup pontual. Dumps/media ficam em `backups`, modo 600.
Fazer teste de restore em banco descartável; listar catálogo não prova restauração.

Restore do banco, somente na GSR e com parada aprovada do app e backup prévio:

```sh
cd /opt/gsr-site
docker compose -p gsr-site stop gsr-app
docker compose -p gsr-site exec -T gsr-db pg_restore --exit-on-error --single-transaction --clean --if-exists --no-owner --no-acl -U gsr -d gsr < backups/ARQUIVO.dump
docker compose -p gsr-site up -d --no-deps --wait gsr-app
```

Se o restore falhar, não iniciar o app. Restaurar mídia do snapshot correspondente
no volume gsr-media, validando caminhos, hashes e dono 1001. Nunca restaurar no
banco original do Windows nem em bancos de outros projetos.

## SSH e GitHub

O grupo Docker equivale a root. Para acesso limitado, proposta a aprovar:
`deploy` sem grupo Docker, chave dedicada com comando forçado e sudo somente para
`/usr/bin/node /usr/local/lib/gsr-site/remote.mjs`. Você cria e autoriza a chave.
O arquivo instalado deve pertencer a root e ser protegido contra escrita de deploy.
Não alterar sshd_config nem reutilizar chaves de outros projetos.

Na chave pública dedicada: comando forçado
`/usr/bin/node /usr/local/lib/gsr-site/remote.mjs`, opção `restrict`.
A rotina aceita apenas `gsr-deploy <SHA de 40 caracteres>` e executa somente comandos
com o Compose fixo da GSR; possui lock de deploy, backup antes de migrations e healthcheck.
Os arquivos Compose e `.env` do servidor devem continuar controlados por root.
Revisar sudoers e autorização da chave antes de instalar. Nada disso foi ativado ainda.

Secrets que você cadastra no repositório:

| Nome | Valor |
|---|---|
| GSR_SSH_HOST | IP/hostname do servidor |
| GSR_SSH_PORT | Porta SSH atual, sem alterá-la |
| GSR_SSH_USER | deploy |
| GSR_SSH_PRIVATE_KEY | Chave privada dedicada, nunca no chat |
| GSR_SSH_KNOWN_HOSTS | Host key obtida e conferida por canal confiável |

GITHUB_TOKEN é fornecido pelo Actions para publicar. Pacote GHCR deve ser público
para pull anônimo; se privado, preparar credencial exclusiva de leitura por stdin.
PAYLOAD_SECRET e DATABASE_URI ficam apenas no `.env` protegido do servidor.
Revisar arquivos antes de commit/push; Actions deploy só em push na main e sem
concorrência. Pull requests validam build e não publicam nem fazem deploy.

## Domínio, SSL e rollback

Nginx/aaPanel termina HTTPS e renova certificados. Docker não publica 80/443.
Preservar challenge ACME da GSR; ampliar certificado do aaPanel para incluir www.
Não editar vhost da D&F, default_server, configuração global ou firewall.

Testar primeiro em túnel SSH ou subdomínio aprovado com proteção/noindex. Só trocar
com OK explícito, horário escolhido, backups completos do WordPress e banco GSR,
diff exato do vhost e plano de rollback. www faz 301 ao apex, exceto /home/ com 410.
Validar com o Nginx do aaPanel antes de reload; se falhar, parar. Nunca restart.
Comparar sites com o baseline: já havia outros domínios com 502/certificado inválido.
Em 13/10/2026 o usuário removeu o WordPress e seu cadastro antes da troca.
Não existe rollback do WordPress apenas restaurando um vhost. Os backups antigos
devem permanecer privados e qualquer restauração exige validar sua compatibilidade.

Rollback do domínio restaura só os backups aprovados do vhost GSR, valida e faz reload.
O alvo de menos de um minuto precisa de teste e acesso administrativo disponível.
Rollback de imagem: conferir `previous-image.txt`, compatibilidade do schema,
backup datado de `.env`, definir GSR_IMAGE com SHA anterior, pull e up somente gsr-app.
Se a migration for incompatível, voltar a imagem pode exigir restore do banco,
com cuidado para preservar dados novos. No primeiro deploy ainda não existe imagem anterior.

Logs: `cd /opt/gsr-site && docker compose -p gsr-site logs -f`.
Implantação inicial concluída em 13/10/2026, com autorização do domínio e horário.
Imagem local `gsr-site:preview-20261013`, runtime `SITE_ENV=production`.
Home/painel/artigo/sitemap/robots, login temporário, upload, formulário real,
publicação agendada pelo autoRun, 265 arquivos de mídia e redirects públicos passaram.
Registros temporários removidos; conteúdo importado preservado.
Certificado apex+www emitido pelo aaPanel; renovação registrada em suas tarefas existentes.
Nenhum vhost preexistente alterado; D&F, seu e-commerce/homologação e SaaS responderam 200.
GitHub Actions ainda depende de revisão/commit/push, usuário/chave dedicada e Secrets.
`RESEND_API_KEY` ainda não configurado: leads são gravados, sem aviso por e-mail.
Estado e operação detalhados: `/opt/gsr-site/ENTREGA.md`.
