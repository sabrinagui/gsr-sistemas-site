import Script from 'next/script'

import { getSEOSettings } from '@/lib/payload/queries'

/**
 * GA4 e GTM com os IDs existentes — trocar de propriedade perderia o histórico.
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
  const ga4 = seo?.ga4MeasurementId
  const clarity = seo?.clarityProjectId

  return (
    <>
      {gtm ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      ) : null}

      {ga4 && !gtm ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${ga4}');`}
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
