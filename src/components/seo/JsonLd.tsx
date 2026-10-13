/**
 * JSON-LD renderizado no servidor, dentro do HTML inicial.
 *
 * O dangerouslySetInnerHTML é o caminho correto aqui: o conteúdo é gerado por
 * nós a partir do CMS, nunca vem do usuário, e escapamos `<` para fechar a via
 * de injeção via string vinda de campo de texto.
 */
export const JsonLd = ({ data }: { data: unknown }) => {
  if (!data) return null
  const json = JSON.stringify(data).replace(/</g, '\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
