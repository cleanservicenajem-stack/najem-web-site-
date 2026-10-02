import type { Metadata } from 'next';
import { Mail, MailOpen, Phone, Trash2 } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { exigerAdministrateur } from '@/lib/admin/auth';
import { AlerteStockage } from '@/components/admin/AlerteStockage';
import { basculerLecture, effacerMessage } from '@/app/admin/actions';
import { listerMessages, type MessageContact } from '@/lib/admin/messages';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Messages reçus' };

const dateLisible = (iso: string): string =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Africa/Casablanca',
  }).format(new Date(iso));

function Message({ message }: { message: MessageContact }) {
  return (
    <article
      className={
        message.lu
          ? 'rounded-2xl border border-[var(--border)] bg-surface p-6'
          : 'rounded-2xl border border-brand-line bg-surface p-6 shadow-[var(--shadow-card)]'
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display text-[1.05rem] font-semibold text-navy-800">
            {message.prenom} {message.nom}
            {message.lu ? null : (
              <span className="ml-3 inline-flex rounded-full bg-brand-tint px-2.5 py-0.5 align-middle text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-brand-700">
                Nouveau
              </span>
            )}
          </p>
          <p className="mt-1 text-[0.85rem] text-ink-soft">
            {message.objet} · reçu le {dateLisible(message.recuLe)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <form action={basculerLecture}>
            <input type="hidden" name="id" value={message.id} />
            <input type="hidden" name="lu" value={message.lu ? '0' : '1'} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3.5 py-2 text-[0.85rem] text-ink-soft transition-colors duration-300 hover:border-brand-line hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line"
            >
              {message.lu ? (
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <MailOpen className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {message.lu ? 'Marquer non lu' : 'Marquer lu'}
            </button>
          </form>

          <form action={effacerMessage}>
            <input type="hidden" name="id" value={message.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3.5 py-2 text-[0.85rem] text-ink-soft transition-colors duration-300 hover:border-danger-line hover:text-danger-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">
                Supprimer le message de {message.prenom} {message.nom}
              </span>
              Supprimer
            </button>
          </form>
        </div>
      </div>

      <p className="mt-5 whitespace-pre-line text-[0.95rem] leading-relaxed text-ink">
        {message.message}
      </p>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--border)] pt-4 text-[0.875rem]">
        <a
          href={`mailto:${message.email}?subject=${encodeURIComponent(`Re : ${message.objet}`)}`}
          className="inline-flex items-center gap-2 rounded-sm text-brand-600 transition-colors duration-300 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          {message.email}
        </a>
        {message.telephone ? (
          <a
            href={`tel:${message.telephone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 rounded-sm text-ink-soft transition-colors duration-300 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {message.telephone}
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default async function MessagesPage() {
  await exigerAdministrateur();
  const messages = await listerMessages();
  const nonLus = messages.filter((message) => !message.lu).length;

  return (
    <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <AdminNav actif="messages" nonLus={nonLus} />

      <main className="px-6 py-10 lg:px-12 lg:py-14">
        <div className="max-w-3xl">
          <AlerteStockage />

          <h1 className="font-display text-[1.9rem] font-bold leading-tight text-navy-900 md:text-[2.3rem]">
            Messages reçus
          </h1>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
            Les demandes envoyées depuis le formulaire de contact du site. Elles sont conservées
            douze mois, puis supprimées automatiquement.
          </p>

          {messages.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[0.95rem] text-ink-soft">
              Aucun message pour le moment.
            </p>
          ) : (
            <ul className="mt-10 space-y-4">
              {messages.map((message) => (
                <li key={message.id}>
                  <Message message={message} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
