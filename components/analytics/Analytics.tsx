import Script from 'next/script';
import { siteConfig } from '@/config/site';

/**
 * Mesure d'audience — chargée uniquement si un identifiant réel est fourni via
 * les variables d'environnement. Aucun identifiant n'est codé en dur, et aucun
 * script tiers n'est injecté par défaut.
 */
export function Analytics() {
  const { gaId, gtmId } = siteConfig.analytics;

  if (!gaId && !gtmId) return null;

  return (
    <>
      {gtmId ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}

      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
    </>
  );
}
