/**
 * Converte um link de Vimeo ou YouTube no endereço do player para <iframe>.
 * Qualquer outro formato devolve null (o bloco de vídeo não aparece).
 */
export const videoEmbedUrl = (url?: string | null): string | null => {
  if (!url) return null
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?title=0&byline=0&portrait=0&dnt=1`
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0`
  return null
}
