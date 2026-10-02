import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { estAdministrateur } from '@/lib/admin/habilitations';

/**
 * Garde d'accès à l'administration.
 *
 * Le contrôle est fait ici plutôt que dans chaque page : aucune route sous
 * `/admin` ne peut être oubliée. Les pages et les actions revérifient malgré
 * tout — un proxy protège l'accès, pas l'écriture.
 *
 * Ce fichier a aussi la charge de rafraîchir le jeton Supabase. Les composants
 * serveur ne peuvent pas écrire de cookie ; sans ce passage à chaque requête,
 * les sessions expireraient au bout d'une heure.
 */
export default async function proxy(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const clePublique = process.env.SUPABASE_ANON_KEY;

  let reponse = NextResponse.next({ request });

  const connecte = await (async () => {
    if (!url || !clePublique) return false;

    const supabase = createServerClient(url, clePublique, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (aPoser, entetes) => {
          for (const { name, value } of aPoser) request.cookies.set(name, value);
          reponse = NextResponse.next({ request });
          for (const { name, value, options } of aPoser) reponse.cookies.set(name, value, options);
          // Sans ces en-têtes, un CDN pourrait mettre en cache une réponse
          // porteuse d'un cookie de session et la servir à quelqu'un d'autre.
          for (const [cle, valeur] of Object.entries(entetes)) reponse.headers.set(cle, valeur);
        },
      },
    });

    // `getClaims` vérifie la signature du jeton ; le cookie seul est falsifiable.
    const { data, error } = await supabase.auth.getClaims();
    const email = data?.claims?.email;
    if (error || typeof email !== 'string') return false;

    // Une session Supabase valide ne suffit pas : tout compte du projet en
    // obtient une. Seules les adresses habilitées entrent.
    return estAdministrateur(email);
  })();

  const { pathname, search } = request.nextUrl;
  const estPageConnexion = pathname === '/admin/connexion';

  const rediriger = (destination: URL) => {
    const redirection = NextResponse.redirect(destination);
    for (const cookie of reponse.cookies.getAll()) {
      redirection.cookies.set(cookie.name, cookie.value, cookie);
    }
    for (const entete of ['cache-control', 'expires', 'pragma']) {
      const valeur = reponse.headers.get(entete);
      if (valeur) redirection.headers.set(entete, valeur);
    }
    return redirection;
  };

  if (!connecte && !estPageConnexion) {
    const destination = new URL('/admin/connexion', request.url);
    destination.searchParams.set('suivant', `${pathname}${search}`);
    return rediriger(destination);
  }

  if (connecte && estPageConnexion) {
    return rediriger(new URL('/admin', request.url));
  }

  // Ceinture et bretelles : l'administration ne doit jamais être indexée,
  // même si une route échappait aux métadonnées `noindex`.
  reponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return reponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};
