import Script from 'next/script'

import { getSEOSettings } from '@/lib/payload/queries'

/**
 * Mesmas tags do site antigo, para não perder histórico nem medição:
 *
 *  - Google Tag Manager (GTM-539GQMP8): no site antigo ele dispara só a
 *    conversão do Google Ads e o vinculador de conversões. NÃO dispara GA4.
 *  - gtag.js com três destinos, como o Site Kit fazia:
 *      G-FVHZ0NLLXC   propriedade GA4 principal
 *      GT-TNPWVZW4    tag do Google do Site Kit (envia para G-1G7G5PVN22)
 *      AW-16761105005 Google Ads
 *
 * Por isso o GA4 é carregado direto mesmo com o GTM ativo: se dependesse do
 * contêiner, o Analytics pararia de receber dados no lançamento.
 *
 * afterInteractive: nunca bloqueia a renderização. Desligado fora de produção,
 * para não poluir os dados com tráfego de desenvolvimento e preview.
 */
export const Analytics = async () => {
  const seo = await getSEOSettings()

  const isProduction = process.env.NODE_ENV === 'production'
  const isPreview = process.env.VERCEL_ENV === 'preview'
  if (!isProduction || isPreview || seo?.enableAnalytics === false) return null

  const gtm = seo?.gtmContainerId
  const clarity = seo?.clarityProjectId
  const gtagIds = [seo?.ga4MeasurementId, seo?.googleTagId, seo?.googleAdsId].filter(
    (id): id is string => typeof id === 'string' && id.trim().length > 0,
  )

  return (
    <>
      {gtm ? (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      ) : null}

      {gtagIds.length > 0 ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}`} strategy="afterInteractive" />
          <Script id="gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('set','linker',{domains:['gsrsistemas.com']});
${gtagIds.map((id) => `gtag('config','${id}');`).join('\n')}`}
          </Script>
        </>
      ) : null}

      {clarity ? (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${clarity}');`}
        </Script>
      ) : null}
    </>
  )
}
