import type { DictionnaireAccueil } from './types';

/** Accueil en anglais (/en). Traduction des contenus publiés en français. */
export const accueilEn: DictionnaireAccueil = {
  langue: 'en',
  separateur: ', ',

  meta: {
    titre: 'Home Cleaning in Casablanca from {prix} | Najem',
    titreSansPrix: 'Home Cleaning in Casablanca | Najem Clean Service',
    description:
      'Book a cleaner in Casablanca in minutes with the Najem Clean Service app: express cleaning from {prix}, full cleaning, house cleaning and monthly plans.',
    descriptionSansPrix:
      'Book a cleaner in Casablanca in minutes with the Najem Clean Service app: express cleaning, full cleaning, house cleaning and monthly plans.',
  },

  entete: {
    accueil: 'Najem Clean Service — home',
    navigation: 'Main menu',
    telecharger: 'Get the app',
    menu: { tarifs: 'Prices', services: 'Services', questions: 'FAQ' },
  },

  hero: {
    surtitre: 'Cleaners booked through the app',
    titre: 'Home cleaning in Casablanca',
    accroche:
      'Book your cleaner in minutes in the Najem Clean Service app: express cleaning from {prix}, one-off or with a monthly plan, anywhere in Casablanca.',
    accrocheSansPrix:
      'Book your cleaner in minutes in the Najem Clean Service app: one-off or with a monthly plan, anywhere in Casablanca.',
  },

  services: {
    titre: 'A service for every situation',
    intro:
      'Choose your service in the app, pick a time slot, and a selected professional comes to your home.',
    liste: [
      { nom: 'Regular cleaning', texte: 'Scheduled visits, at the pace you choose.' },
      { nom: 'One-off cleaning', texte: 'For a specific need, with no commitment.' },
      { nom: 'Deep cleaning', texte: 'A complete reset of your home, beyond routine upkeep.' },
      { nom: 'Move-in and move-out cleaning', texte: 'An empty home cleaned before you move in or after you leave.' },
      { nom: 'Specialised care', texte: 'Carpets, sofas, windows, ironing and disinfection.' },
      { nom: 'Short-term rentals', texte: 'Cleaning between two stays, for Airbnb hosts and concierge companies.' },
    ],
  },

  tarifs: {
    titre: 'How much does home cleaning cost in Casablanca?',
    intro: 'The prices of the app, by home size. Options are added to the price of the package.',
    colonnes: { logement: 'Home', formule: 'Package', detail: 'Details', prix: 'Price' },
    abonnement: 'Monthly plan',
    parMois: '/ month',
    options:
      'Options: ironing, terrace or balcony, very dirty oven and fridge, sofa and carpet shampooing, extra hour. The exact price of your cleaning is shown in the app before you confirm.',
    lienDetail: 'All prices and options (in French)',
  },

  fonctionnement: {
    titre: 'How to book a cleaner',
    etapes: [
      'Download the Najem Clean Service app on iPhone or Android.',
      'Choose your home size and package: express, full, house or prestige cleaning.',
      'Enter your address, the date, the time slot and any instructions.',
      'Confirm: the price is shown before you book, and you track your request from your account.',
    ],
  },

  zones: {
    titre: 'Everywhere in Casablanca',
    texte:
      'Najem Clean Service covers all of Casablanca, from the city centre to residential neighbourhoods: {quartiers} and every other neighbourhood. Availability at your address is confirmed in the app when you book.',
    quartiers: [
      'Maarif',
      'Gauthier',
      'Racine',
      'Bourgogne',
      'Anfa',
      'Ain Diab',
      'Californie',
      'Oasis',
      'Sidi Maarouf',
      'Hay Hassani',
      'Ain Sebaa',
      'Belvédère',
    ],
  },

  questions: {
    titre: 'Frequently asked questions',
    prix: {
      question: 'How much does home cleaning cost in Casablanca?',
      reponse:
        'With Najem Clean Service, express cleaning starts at {express} for {duree} in a studio or small apartment.',
      suite:
        'Full cleaning is {complet}, house cleaning {grand} and prestige cleaning {prestige}. The exact price of your cleaning and options is shown in the app before you confirm.',
    },
    abonnement: {
      question: 'Do you offer a monthly cleaning plan?',
      reponse:
        'Yes. The monthly plan groups several cleanings each month, for less than booking the same cleanings one by one:',
    },
    zones: {
      question: 'Which areas of Casablanca do you cover?',
      reponse:
        'All of Casablanca. Availability at your address is confirmed in the app when you book.',
    },
    reserver: {
      question: 'How do I book a cleaner?',
      reponse:
        'Download the Najem Clean Service app on iPhone or Android, choose your home size, the package, the date and the time slot, then confirm. You book and pay in the app, and you track your request from your account.',
    },
    contenu: {
      question: 'What does a cleaning include?',
      reponse:
        'Living areas and bedrooms; kitchen worktops, the outside of appliances and the sink; bathroom and toilets; floors vacuumed and mopped; dusting of accessible surfaces. The exact details are confirmed when you book, depending on your home and your instructions.',
    },
  },

  appel: {
    titre: 'Your clean home starts here',
    texte: 'Download the Najem Clean Service app and book your first cleaning in Casablanca.',
  },

  pied: {
    description:
      'Home cleaning services in Casablanca, booked through a mobile app on iPhone and Android.',
    siteFrancais: 'Site in French',
    mentions: 'Legal notice (French)',
    confidentialite: 'Privacy policy (French)',
    droits: 'All rights reserved.',
    langueChoix: 'Site language',
  },

  boutiques: {
    ios: { haut: 'Download on the', bas: 'App Store', aria: 'Download on the App Store' },
    android: { haut: 'Get it on', bas: 'Google Play', aria: 'Get it on Google Play' },
    nouvelleFenetre: 'opens in a new window',
  },

  grille: {
    categories: {
      studio: { titre: 'Studio and small apartment', precision: 'Up to 2 rooms' },
      grand: { titre: 'Large apartment and villa', precision: 'Up to 5 bedrooms' },
      'tres-grand': { titre: 'Very large home', precision: 'Large villas and luxury homes' },
    },
    formules: {
      'studio-express': 'Express cleaning',
      'studio-complet': 'Full cleaning',
      'grand-express': 'Express cleaning',
      'grand-menage': 'House cleaning',
      'tres-grand-express': 'Express cleaning',
      'tres-grand-prestige': 'Prestige cleaning',
    },
  },

  duree: (heures, minutes) => `${heures} h${minutes > 0 ? ` ${minutes} min` : ''}`,
  prix: (montant) => `${new Intl.NumberFormat('en-US').format(montant)} DH`,
  quantite: (nombre, nom) => `${nombre} × ${nom.toLowerCase()}`,
  abonnementContenu: (elements) => `${elements.join(' + ')} each month`,
};
