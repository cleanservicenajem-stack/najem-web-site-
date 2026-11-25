'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PHOTOS_CONSERVATION_JOURS, PHOTOS_MAX } from '@/lib/devis-config';

const champ =
  'w-full rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-[0.95rem] text-ink transition-colors duration-300 placeholder:text-ink-soft/70 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-line dark:bg-paper';

const etiquette = 'mb-2 block text-[0.875rem] font-medium text-navy-800';

type Photo = { fichier: File; apercu: string };

/** `biens` : la catégorie gère des logements, on lui demande combien et lesquels. */
const categories = [
  { nom: 'Conciergerie', biens: true },
  { nom: 'Propriétaire de plusieurs biens', biens: true },
  { nom: 'Agence immobilière', biens: true },
  { nom: 'Hôtel ou apparthôtel', biens: true },
  { nom: 'Propriétaire de bureaux', biens: false },
  { nom: 'Magasin', biens: false },
  { nom: 'Restaurant ou café', biens: false },
  { nom: 'Autre professionnel', biens: false },
];

const typesDeBiens = ['Studios', 'Appartements', 'Villas'];

const frequences = [
  'Une seule fois',
  'Chaque semaine',
  'Plusieurs fois par semaine',
  'À définir',
];

const facultatif = <span className="text-ink-soft">(facultatif)</span>;

/** Réduit la photo sur l'appareil (1 600 px, JPEG) et retire ses métadonnées. */
const reduire = async (fichier: File): Promise<Blob> => {
  const image = await createImageBitmap(fichier);
  const echelle = Math.min(1, 1600 / Math.max(image.width, image.height));
  const toile = document.createElement('canvas');
  toile.width = Math.round(image.width * echelle);
  toile.height = Math.round(image.height * echelle);
  toile.getContext('2d')?.drawImage(image, 0, 0, toile.width, toile.height);
  image.close();

  return new Promise((resoudre, rejeter) =>
    toile.toBlob(
      (blob) => (blob ? resoudre(blob) : rejeter(new Error('image illisible'))),
      'image/jpeg',
      0.8,
    ),
  );
};

/** Dépose la photo et renvoie son adresse complète. */
const deposer = async (fichier: File): Promise<string> => {
  const donnees = new FormData();
  donnees.append('photo', await reduire(fichier), 'photo.jpg');
  const reponse = await fetch('/api/devis-photos', { method: 'POST', body: donnees });
  if (!reponse.ok) throw new Error(`dépôt refusé (${reponse.status})`);
  const { chemin } = (await reponse.json()) as { chemin: string };
  return `${window.location.origin}${chemin}`;
};

type Props = { lienWhatsapp: string };

/**
 * Demande de devis pro : le visiteur choisit sa catégorie, répond à quelques
 * questions, puis WhatsApp s'ouvre avec le message déjà rédigé, adressé à
 * Najem. C'est lui qui l'envoie depuis son compte. Seules les photos sont
 * enregistrées par le site ; leurs liens figurent dans le message.
 */
export function FormulaireDevisPro({ lienWhatsapp }: Props) {
  const [categorie, setCategorie] = useState('');
  const gereDesBiens = categories.find((c) => c.nom === categorie)?.biens ?? false;
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  /** Adresses déjà obtenues : un second essai ne redépose pas la même photo. */
  const deposees = useRef(new Map<File, string>());
  const apercus = useRef<string[]>([]);

  useEffect(() => {
    const liste = apercus.current;
    return () => liste.forEach((adresse) => URL.revokeObjectURL(adresse));
  }, []);

  const ajouter = (evenement: ChangeEvent<HTMLInputElement>) => {
    const choisies = Array.from(evenement.target.files ?? []);
    evenement.target.value = '';
    const place = PHOTOS_MAX - photos.length;
    const nouvelles = choisies.slice(0, place).map((fichier) => {
      const apercu = URL.createObjectURL(fichier);
      apercus.current.push(apercu);
      return { fichier, apercu };
    });
    setPhotos([...photos, ...nouvelles]);
    setErreur(choisies.length > place ? `${PHOTOS_MAX} photos au maximum.` : null);
  };

  const envoyer = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    const donnees = new FormData(evenement.currentTarget);
    const lire = (cle: string) => String(donnees.get(cle) ?? '').trim();
    const nom = lire('nom');
    const numero = lire('numero');
    const quartier = lire('quartier');
    const nombreBiens = lire('nombreBiens');
    const types = donnees.getAll('typesBiens').join(', ');
    const passages = lire('passages');
    const surface = lire('surface');
    const frequence = lire('frequence');
    const demande = lire('demande');

    if (!categorie || !nom || !quartier || (gereDesBiens && !nombreBiens)) {
      setErreur('Complétez les champs obligatoires.');
      return;
    }
    setErreur(null);
    setEnvoi(true);

    const liens: string[] = [];
    try {
      for (const { fichier } of photos) {
        const lien = deposees.current.get(fichier) ?? (await deposer(fichier));
        deposees.current.set(fichier, lien);
        liens.push(lien);
      }
    } catch {
      setEnvoi(false);
      setErreur('Une photo n’a pas pu être ajoutée. Réessayez, ou retirez les photos.');
      return;
    }

    const message = [
      'Bonjour, demande de devis pro.',
      `Catégorie : ${categorie}`,
      `Nom ou société : ${nom}`,
      numero ? `ICE ou SIRET : ${numero}` : null,
      `Quartier ou ville : ${quartier}`,
      nombreBiens ? `Nombre de biens en charge : ${nombreBiens}` : null,
      types ? `Types de biens : ${types}` : null,
      passages ? `Passages souhaités par mois : ${passages}` : null,
      surface ? `Surface approximative : ${surface} m²` : null,
      frequence ? `Fréquence souhaitée : ${frequence}` : null,
      demande ? `Précisions : ${demande}` : null,
      liens.length > 0 ? `Photos :\n${liens.join('\n')}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    setEnvoi(false);
    window.location.assign(`${lienWhatsapp}?text=${encodeURIComponent(message)}`);
  };

  return (
    <form onSubmit={envoyer} className="space-y-5">
      <div>
        <label htmlFor="devis-categorie" className={etiquette}>
          Vous êtes
        </label>
        <select
          id="devis-categorie"
          name="categorie"
          required
          value={categorie}
          onChange={(evenement) => setCategorie(evenement.target.value)}
          className={champ}
        >
          <option value="" disabled>
            Choisissez votre catégorie
          </option>
          {categories.map((c) => (
            <option key={c.nom} value={c.nom}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="devis-nom" className={etiquette}>
          Nom ou société
        </label>
        <input
          id="devis-nom"
          name="nom"
          type="text"
          required
          maxLength={80}
          autoComplete="organization"
          className={champ}
        />
      </div>

      <div>
        <label htmlFor="devis-numero" className={etiquette}>
          Numéro ICE ou SIRET <span className="text-ink-soft">(si vous en avez un)</span>
        </label>
        <input
          id="devis-numero"
          name="numero"
          type="text"
          inputMode="numeric"
          maxLength={20}
          className={champ}
        />
      </div>

      <div>
        <label htmlFor="devis-quartier" className={etiquette}>
          Quartier ou ville
        </label>
        <input
          id="devis-quartier"
          name="quartier"
          type="text"
          required
          maxLength={80}
          className={champ}
        />
      </div>

      {categorie && gereDesBiens ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="devis-biens" className={etiquette}>
                Nombre de biens en charge
              </label>
              <input
                id="devis-biens"
                name="nombreBiens"
                type="number"
                inputMode="numeric"
                min={1}
                max={9999}
                required
                className={champ}
              />
            </div>
            <div>
              <label htmlFor="devis-passages" className={etiquette}>
                Passages par mois {facultatif}
              </label>
              <input
                id="devis-passages"
                name="passages"
                type="number"
                inputMode="numeric"
                min={1}
                max={99999}
                className={champ}
              />
            </div>
          </div>

          <fieldset>
            <legend className={etiquette}>Types de biens {facultatif}</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {typesDeBiens.map((type) => (
                <label key={type} className="flex items-center gap-2 text-[0.925rem] text-ink">
                  <input
                    type="checkbox"
                    name="typesBiens"
                    value={type}
                    className="h-4 w-4 rounded border-[var(--border)] text-brand-600 focus:ring-brand-300"
                  />
                  {type}
                </label>
              ))}
            </div>
          </fieldset>
        </>
      ) : null}

      {categorie && !gereDesBiens ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="devis-surface" className={etiquette}>
              Surface en m² {facultatif}
            </label>
            <input
              id="devis-surface"
              name="surface"
              type="number"
              inputMode="numeric"
              min={1}
              max={99999}
              className={champ}
            />
          </div>
          <div>
            <label htmlFor="devis-frequence" className={etiquette}>
              Fréquence {facultatif}
            </label>
            <select id="devis-frequence" name="frequence" defaultValue="" className={champ}>
              <option value="">Choisissez</option>
              {frequences.map((frequence) => (
                <option key={frequence} value={frequence}>
                  {frequence}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor="devis-demande" className={etiquette}>
          Précisions {facultatif}
        </label>
        <textarea
          id="devis-demande"
          name="demande"
          rows={4}
          maxLength={500}
          className={`${champ} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="devis-photos" className={etiquette}>
          Photos <span className="text-ink-soft">(facultatif, {PHOTOS_MAX} au maximum)</span>
        </label>
        <input
          id="devis-photos"
          type="file"
          accept="image/*"
          multiple
          disabled={envoi || photos.length >= PHOTOS_MAX}
          onChange={ajouter}
          className="block w-full text-[0.875rem] text-ink-soft file:me-3 file:rounded-full file:border-0 file:bg-brand-tint file:px-4 file:py-2.5 file:text-[0.875rem] file:font-medium file:text-brand-700"
        />
        {photos.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-3">
            {photos.map((photo, index) => (
              <li key={photo.apercu} className="relative">
                {/* Aperçu local (blob:) : next/image n'apporterait rien ici. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.apercu}
                  alt={`Photo ${index + 1}`}
                  className="h-20 w-20 rounded-xl border border-[var(--border)] object-cover"
                />
                <button
                  type="button"
                  disabled={envoi}
                  onClick={() => setPhotos(photos.filter((autre) => autre !== photo))}
                  aria-label={`Retirer la photo ${index + 1}`}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-night text-white"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-soft">
          Évitez les personnes et les documents. Les photos sont enregistrées à l’envoi,
          accessibles par leur lien et supprimées après {PHOTOS_CONSERVATION_JOURS} jours.
        </p>
      </div>

      {erreur ? (
        <p role="alert" className="text-[0.875rem] text-danger-ink">
          {erreur}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={envoi}
        icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
      >
        {envoi ? 'Ajout des photos…' : 'Envoyer sur WhatsApp'}
      </Button>

      <p className="text-[0.8rem] leading-relaxed text-ink-soft">
        WhatsApp s’ouvre avec votre message prêt : appuyez sur « Envoyer » pour nous le
        transmettre.
      </p>
    </form>
  );
}
