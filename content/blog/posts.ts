import type { BlogCategory, BlogPost } from './types';

export const blogCategories: BlogCategory[] = [
  {
    slug: 'organisation',
    name: 'Organisation',
    description: "Méthodes simples pour tenir un logement sans y passer ses soirées.",
  },
  {
    slug: 'entretien-maison',
    name: 'Entretien maison',
    description: 'Gestes d’entretien pièce par pièce et bonnes pratiques.',
  },
  {
    slug: 'conseils-pratiques',
    name: 'Conseils pratiques',
    description: 'Ce qu’il faut savoir avant, pendant et après une intervention.',
  },
];

/**
 * ARTICLES D'EXEMPLE.
 *
 * Les trois articles ci-dessous sont marqués `brouillon` : ils servent à
 * valider la structure éditoriale du blog. Ils ne sont pas indexables, sont
 * exclus du sitemap et affichent un bandeau explicite.
 *
 * Pour publier : relire le contenu, le valider côté entreprise, puis passer
 * `status` à `publie` et mettre `datePublished` à jour.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: 'garder-une-maison-propre-avec-peu-de-temps',
    title: 'Garder une maison propre quand on manque de temps',
    description:
      "Une méthode réaliste pour entretenir son logement en semaine : des routines courtes, un ordre de passage logique et les tâches à ne pas laisser s'accumuler.",
    keyAnswer:
      "Pour tenir un logement avec peu de temps, mieux vaut plusieurs passages courts qu'une grande session hebdomadaire. Traitez chaque jour une zone à fort usage — cuisine, salle de bain, sols de passage — et gardez les tâches lourdes pour un créneau unique dans le mois.",
    category: 'organisation',
    datePublished: '2026-01-15',
    author: 'Najem Clean Service',
    readingMinutes: 5,
    cover: {
      src: '/images/blog/cover-organisation.png',
      alt: 'Illustration abstraite aux couleurs de Najem Clean Service',
    },
    status: 'brouillon',
    blocks: [
      {
        type: 'p',
        text: "Le problème n'est presque jamais le ménage en lui-même : c'est le moment où on peut le faire. Une semaine chargée suffit à transformer un entretien courant en gros chantier du week-end. La méthode qui suit part de cette contrainte plutôt que de l'ignorer.",
      },
      { type: 'h2', text: 'Découper au lieu de tout regrouper' },
      {
        type: 'p',
        text: "Une session de trois heures le samedi demande un créneau de trois heures. Quatre passages de vingt minutes en semaine demandent quatre fois vingt minutes, ce qui se trouve beaucoup plus facilement. Le résultat visible est comparable, la charge mentale est nettement plus faible.",
      },
      {
        type: 'ul',
        items: [
          'Lundi : cuisine, plans de travail et évier',
          'Mardi : salle de bain et sanitaires',
          'Jeudi : sols des zones de passage',
          'Vendredi : rangement et surfaces des pièces de vie',
        ],
      },
      { type: 'h2', text: 'Identifier les zones à fort usage' },
      {
        type: 'p',
        text: "Dans la plupart des logements, moins d'un quart de la surface concentre l'essentiel de la saleté visible : l'entrée, le plan de travail, l'évier, le lavabo, les sols entre les pièces. Traiter ces zones régulièrement donne une impression de propreté générale, même si le reste attend quelques jours.",
      },
      { type: 'h3', text: 'Les trois gestes qui changent le plus' },
      {
        type: 'ol',
        items: [
          'Vider l’évier avant de se coucher : la cuisine repart propre le lendemain.',
          'Passer un coup sur le lavabo après la toilette du matin, tant que la surface est encore humide.',
          'Ramasser ce qui traîne dans le salon en une passe, avant de s’installer le soir.',
        ],
      },
      { type: 'h2', text: 'Ce qu’il ne faut pas laisser s’accumuler' },
      {
        type: 'p',
        text: "Certaines tâches deviennent disproportionnées si on les repousse. Le calcaire dans la salle de bain, la graisse sur la crédence et la poussière derrière les meubles demandent dix fois plus d'effort après trois mois qu'après trois semaines.",
      },
      {
        type: 'note',
        title: 'À garder en tête',
        text: "Un entretien régulier n'est pas plus rapide sur une semaine, il est plus rapide sur un trimestre. C'est ce qui rend le rythme fixe intéressant.",
      },
      { type: 'h2', text: 'Quand déléguer devient plus simple' },
      {
        type: 'p',
        text: "À partir du moment où l'entretien courant est systématiquement reporté, le passage régulier d'un professionnel règle le problème à la racine : le créneau est posé, il n'a plus besoin d'être arbitré chaque semaine. C'est le principe du nettoyage régulier réservable depuis l'application Najem Clean Service.",
      },
    ],
    faq: [
      {
        question: 'Combien de temps faut-il par jour pour tenir un logement ?',
        answer:
          "Cela dépend de la surface et du nombre d'occupants. Pour un appartement occupé par deux personnes, des passages de quinze à vingt minutes sur les zones à fort usage suffisent généralement à éviter l'accumulation.",
      },
      {
        question: 'Vaut-il mieux nettoyer le matin ou le soir ?',
        answer:
          "Le moment importe moins que la régularité. Le soir a un avantage pratique : la cuisine et la salle de bain viennent d'être utilisées, ce qui rend le nettoyage plus rapide.",
      },
    ],
    related: ['grand-nettoyage-par-ou-commencer', 'preparer-son-logement-avant-une-intervention'],
  },
  {
    slug: 'grand-nettoyage-par-ou-commencer',
    title: 'Grand nettoyage : par où commencer, pièce par pièce',
    description:
      'Un ordre de passage logique pour un nettoyage en profondeur : du haut vers le bas, du sec vers l’humide, et les zones que l’on oublie systématiquement.',
    keyAnswer:
      "Un grand nettoyage se fait du haut vers le bas et du sec vers l'humide : on dépoussière d'abord les hauteurs, on nettoie ensuite les surfaces, et on termine par les sols. Cet ordre évite de refaire deux fois le même travail.",
    category: 'entretien-maison',
    datePublished: '2026-02-04',
    author: 'Najem Clean Service',
    readingMinutes: 6,
    cover: {
      src: '/images/blog/cover-entretien.png',
      alt: 'Illustration abstraite aux couleurs de Najem Clean Service',
    },
    status: 'brouillon',
    blocks: [
      {
        type: 'p',
        text: "Un grand nettoyage raté se reconnaît à un détail : on a lavé les sols avant de dépoussiérer les étagères. L'ordre de passage compte autant que le produit utilisé.",
      },
      { type: 'h2', text: 'La règle de base : du haut vers le bas' },
      {
        type: 'p',
        text: "La poussière tombe. Tout ce qui est en hauteur — dessus d'armoires, luminaires, étagères hautes, cadres de portes — doit donc être traité avant les surfaces basses, et les sols en dernier.",
      },
      { type: 'h2', text: 'Cuisine' },
      {
        type: 'ul',
        items: [
          'Dessus des meubles hauts et hotte',
          'Crédence et plan de travail',
          'Extérieur des appareils, poignées et interrupteurs',
          'Évier et robinetterie',
          'Plinthes puis sol',
        ],
      },
      {
        type: 'p',
        text: "La graisse se décolle mieux sur une surface tiède : nettoyer la crédence peu après avoir cuisiné demande moins d'effort qu'à froid.",
      },
      { type: 'h2', text: 'Salle de bain' },
      {
        type: 'ul',
        items: [
          'Aération : ouvrir avant de commencer',
          'Douche, parois et joints',
          'Lavabo, robinetterie et miroir',
          'Sanitaires',
          'Sol en dernier',
        ],
      },
      {
        type: 'note',
        title: 'Temps de pose',
        text: "La plupart des produits d'entretien ont besoin de quelques minutes pour agir. Appliquer, passer à une autre zone, puis revenir : c'est plus efficace que de frotter immédiatement.",
      },
      { type: 'h2', text: 'Chambres et pièces de vie' },
      {
        type: 'p',
        text: "Ce sont les pièces où l'on oublie le plus de zones : sous le lit, derrière les têtes de lit, les plinthes, les rebords de fenêtres et les interrupteurs. Un grand nettoyage se distingue justement par ces détails.",
      },
      { type: 'h3', text: 'Les oublis les plus fréquents' },
      {
        type: 'ul',
        items: [
          'Poignées de portes et interrupteurs',
          'Plinthes et angles de sol',
          'Rebords intérieurs des fenêtres',
          'Dessus des portes et des cadres',
        ],
      },
      { type: 'h2', text: 'Répartir sur deux jours plutôt qu’un' },
      {
        type: 'p',
        text: "Un grand nettoyage complet fatigue, et la qualité baisse sur la fin. Traiter les pièces d'eau un jour et les pièces de vie le lendemain donne un résultat plus homogène. Si le créneau n'existe pas, c'est typiquement le type d'intervention qui se délègue bien.",
      },
    ],
    related: [
      'garder-une-maison-propre-avec-peu-de-temps',
      'preparer-son-logement-avant-une-intervention',
    ],
  },
  {
    slug: 'preparer-son-logement-avant-une-intervention',
    title: 'Préparer son logement avant l’arrivée d’un professionnel',
    description:
      'Quelques minutes de préparation permettent à une intervention de nettoyage d’être réellement utile. Voici ce qui compte, et ce qui ne sert à rien.',
    keyAnswer:
      "Avant une intervention, l'essentiel est de dégager les surfaces, de signaler les zones prioritaires et de préciser les consignes d'accès. Il n'est pas nécessaire de nettoyer à l'avance : il suffit de rendre les surfaces accessibles.",
    category: 'conseils-pratiques',
    datePublished: '2026-02-26',
    author: 'Najem Clean Service',
    readingMinutes: 4,
    cover: {
      src: '/images/blog/cover-pratique.png',
      alt: 'Illustration abstraite aux couleurs de Najem Clean Service',
    },
    status: 'brouillon',
    blocks: [
      {
        type: 'p',
        text: "Beaucoup de personnes rangent — voire nettoient — avant l'arrivée d'un professionnel. Une partie de cet effort est utile, l'autre non. La distinction tient à un point simple : ce qui fait gagner du temps sur place est utile, le reste ne l'est pas.",
      },
      { type: 'h2', text: 'Ce qui aide réellement' },
      {
        type: 'ol',
        items: [
          'Dégager les plans de travail, les tables et le sol des objets qui gênent le passage.',
          'Indiquer les deux ou trois zones qui comptent le plus pour vous.',
          'Signaler les surfaces fragiles ou les produits à éviter.',
          'Préciser les consignes d’accès : étage, code, présence ou non sur place.',
        ],
      },
      { type: 'h2', text: 'Ce qui n’est pas nécessaire' },
      {
        type: 'p',
        text: "Nettoyer avant l'intervention n'a pas d'intérêt : c'est exactement ce qui est pris en charge. De même, il n'est pas utile de sortir tout le matériel à l'avance sans savoir ce qui sera utilisé.",
      },
      { type: 'h2', text: 'Pendant l’intervention' },
      {
        type: 'p',
        text: "Vous n'êtes pas obligé de rester présent, à condition que les modalités d'accès aient été convenues. Si vous restez, laissez les pièces en cours de traitement libres : cela évite de repasser deux fois au même endroit.",
      },
      {
        type: 'note',
        title: 'Bon réflexe',
        text: "Notez vos consignes au moment de la réservation dans l'application plutôt que de les transmettre à l'arrivée : elles sont enregistrées et restent disponibles pour les interventions suivantes.",
      },
      { type: 'h2', text: 'Après le passage' },
      {
        type: 'p',
        text: "Faites un tour rapide des pièces traitées pendant que l'intervention est encore fraîche. Un retour précis — une zone oubliée, une préférence particulière — est plus utile qu'un avis général, et il améliore les prestations suivantes.",
      },
    ],
    faq: [
      {
        question: 'Faut-il être présent pendant l’intervention ?',
        answer:
          "Ce n'est pas obligatoire, à condition que les modalités d'accès au logement aient été précisées lors de la réservation.",
      },
      {
        question: 'Faut-il fournir les produits d’entretien ?',
        answer:
          "Précisez ce point au moment de la réservation dans l'application : si vous souhaitez que des produits spécifiques soient utilisés, indiquez-le dans votre demande.",
      },
    ],
    related: ['garder-une-maison-propre-avec-peu-de-temps', 'grand-nettoyage-par-ou-commencer'],
  },
];
