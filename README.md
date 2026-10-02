# Najem Clean Service — site web

Site vitrine de Najem Clean Service, service de nettoyage à domicile au Maroc.
L'objectif de chaque page est le téléchargement de l'application mobile.

- [App Store](https://apps.apple.com/ma/app/najem-clean-service/id6763940227?l=fr-FR)
- [Google Play](https://play.google.com/store/apps/details?id=com.elamranihaytam.najemcleanservice)

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev
```

Le site est alors disponible sur http://localhost:3000.

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | Analyse statique |

## Pile technique

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4,
Supabase pour le contenu modifiable, les messages du formulaire et
l'authentification de l'administration.

## Administration

`/admin` permet de modifier les textes et coordonnées du site, le référencement
par page, les énoncés destinés aux moteurs génératifs, et de consulter les
messages reçus par le formulaire de contact.

L'accès demande deux choses, les deux étant nécessaires :

1. un compte dans Supabase → Authentication → Users ;
2. la même adresse dans la variable `ADMIN_EMAILS`.

Aucun mot de passe n'est stocké dans le dépôt : Supabase s'en charge.

## Base de données

Exécuter une fois `supabase/schema.sql` dans Supabase → SQL Editor. Le script
est réexécutable sans risque et ne détruit rien. Il crée la table du contenu,
celle des messages, et la fonction de purge qui supprime automatiquement les
messages de plus de douze mois.

## Conventions

Aucune donnée d'entreprise n'est inventée. Les informations non communiquées
valent `null` dans `config/site.ts` : l'interface les masque et les données
structurées ne les déclarent pas. Il suffit de renseigner la valeur à cet
endroit pour qu'elle apparaisse partout.

Les secrets ne sont jamais versionnés ni exposés au navigateur. `.env.example`
documente les variables attendues, sans aucune valeur réelle.

---

Designed by [vsnstudios](https://www.vsnstudios.ma/)
