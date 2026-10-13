import React from 'react'

/**
 * Marca da GSR no painel do Payload.
 *
 * O admin tem tema claro e escuro (html[data-theme]). As duas versões da logo
 * são renderizadas e o CSS em app/(payload)/custom.scss mostra a certa.
 */

/** Logo da tela de login. */
export const AdminLogo = () => (
  <span className="gsr-brand gsr-brand--logo">
    <img src="/brand/gsr-logo-escura.png" alt="GSR Sistemas" className="gsr-brand__light" width={512} height={120} />
    <img src="/brand/gsr-logo-branca.png" alt="GSR Sistemas" className="gsr-brand__dark" width={665} height={139} />
    <span className="gsr-brand__tagline">Painel do site</span>
  </span>
)

/** Texto acima do formulário de login. */
export const LoginIntro = () => (
  <p className="gsr-login-intro">Entre para editar o conteúdo do site e acompanhar os leads.</p>
)

/** Rodapé da navegação lateral: atalho para o site publicado. */
export const NavSiteLink = () => (
  <a className="gsr-nav-site" href="/" target="_blank" rel="noopener noreferrer">
    <span>Ver o site</span>
    <span aria-hidden>↗</span>
  </a>
)

/** Ícone pequeno no topo da navegação lateral. */
export const AdminIcon = () => (
  <span className="gsr-brand gsr-brand--icon">
    <img src="/brand/gsr-logo-escura.png" alt="GSR Sistemas" className="gsr-brand__light" width={512} height={120} />
    <img src="/brand/gsr-logo-branca.png" alt="GSR Sistemas" className="gsr-brand__dark" width={665} height={139} />
  </span>
)
