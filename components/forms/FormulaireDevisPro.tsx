'use client';

import { useState, type FormEvent } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const champ =
  'w-full rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-[0.95rem] text-ink transition-colors duration-300 placeholder:text-ink-soft/70 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-line dark:bg-paper';

const etiquette = 'mb-2 block text-[0.875rem] font-medium text-navy-800';

/**
 * Demande de devis pro : deux champs, puis WhatsApp s'ouvre avec le message
 * déjà rédigé, adressé à Najem. Rien n'est enregistré sur le site : c'est le
 * visiteur qui envoie le message depuis son compte WhatsApp.
 */
export function FormulaireDevisPro({ lienWhatsapp }: { lienWhatsapp: string }) {
  const [erreur, setErreur] = useState(false);

  const envoyer = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    const donnees = new FormData(evenement.currentTarget);
    const nom = String(donnees.get('nom') ?? '').trim();
    const demande = String(donnees.get('demande') ?? '').trim();

    if (!nom || !demande) {
      setErreur(true);
      return;
    }
    setErreur(false);

    const message = `Bonjour, demande de devis pro.\nNom ou société : ${nom}\nDemande : ${demande}`;
    window.location.assign(`${lienWhatsapp}?text=${encodeURIComponent(message)}`);
  };

  return (
    <form onSubmit={envoyer} className="space-y-5">
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
        <label htmlFor="devis-demande" className={etiquette}>
          Votre demande
        </label>
        <textarea
          id="devis-demande"
          name="demande"
          required
          rows={4}
          maxLength={500}
          className={`${champ} resize-y`}
        />
      </div>

      {erreur ? (
        <p role="alert" className="text-[0.875rem] text-danger-ink">
          Remplissez les deux champs.
        </p>
      ) : null}

      <Button type="submit" icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}>
        Envoyer sur WhatsApp
      </Button>

      <p className="text-[0.8rem] leading-relaxed text-ink-soft">
        WhatsApp s’ouvre avec votre message prêt : appuyez sur « Envoyer » pour nous le
        transmettre.
      </p>
    </form>
  );
}
