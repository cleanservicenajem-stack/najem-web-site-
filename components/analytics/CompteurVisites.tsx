import Script from 'next/script';

/**
 * Compteur de visites (Vercel Web Analytics) : sans cookie, servi depuis le même
 * domaine, donc sans changement de la politique de sécurité (CSP) ni dépendance.
 *
 * Monté sur les pages publiques seulement (pas dans l'administration). Le fichier
 * `/_vercel/insights/script.js` n'existe qu'une fois « Web Analytics » activé dans
 * le projet Vercel, suivi d'un nouveau déploiement.
 */
export function CompteurVisites() {
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      <Script id="compteur-visites-file" strategy="afterInteractive">
        {`window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};`}
      </Script>
      <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
    </>
  );
}
