-- ---------------------------------------------------------------------------
-- Najem Clean Service — schéma de la base
--
-- À exécuter dans Supabase > SQL Editor > New query.
-- Le script est réexécutable sans risque : il ne détruit rien.
-- ---------------------------------------------------------------------------

create table if not exists public.contenu_site (
  -- Clé du champ, telle que définie dans /config/editable.ts
  -- (exemple : "contact.telephone", "accueil.titre").
  cle text primary key,
  valeur text not null,
  modifie_le timestamptz not null default now()
);

comment on table public.contenu_site is
  'Textes et coordonnées saisis depuis l''administration du site. '
  'Une clé absente signifie « valeur par défaut du code ».';

-- Horodatage automatique à chaque écriture.
create or replace function public.contenu_site_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.modifie_le := now();
  return new;
end;
$$;

drop trigger if exists contenu_site_touch on public.contenu_site;
create trigger contenu_site_touch
  before insert or update on public.contenu_site
  for each row execute function public.contenu_site_touch();

-- ---------------------------------------------------------------------------
-- Sécurité
--
-- Le contenu est destiné à être affiché publiquement : la lecture est ouverte.
-- Aucune politique d'écriture n'est créée, donc personne ne peut modifier la
-- table avec la clé publique. Seule l'application, qui écrit avec la clé
-- secrète (service_role, exemptée de RLS et jamais exposée au navigateur),
-- peut enregistrer des modifications.
-- ---------------------------------------------------------------------------

alter table public.contenu_site enable row level security;

drop policy if exists "Lecture publique du contenu" on public.contenu_site;
create policy "Lecture publique du contenu"
  on public.contenu_site
  for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Messages reçus par le formulaire de contact
--
-- Contrairement au contenu du site, ces lignes contiennent des données
-- personnelles. Aucune politique RLS n'est créée : la table est donc
-- totalement inaccessible avec la clé publique, y compris en lecture. Seule
-- l'application, qui utilise la clé secrète, peut y écrire et la consulter.
-- ---------------------------------------------------------------------------

create table if not exists public.messages_contact (
  id uuid primary key default gen_random_uuid(),
  prenom text not null,
  nom text not null,
  email text not null,
  telephone text,
  objet text not null,
  message text not null,
  lu boolean not null default false,
  recu_le timestamptz not null default now()
);

comment on table public.messages_contact is
  'Messages du formulaire de contact. Données personnelles : conservation '
  'limitée à 12 mois, voir la fonction purger_messages_expires().';

create index if not exists messages_contact_recu_le_idx
  on public.messages_contact (recu_le desc);

alter table public.messages_contact enable row level security;

-- ---------------------------------------------------------------------------
-- Conservation limitée à 12 mois
--
-- L'application appelle cette fonction à chaque message reçu et à chaque
-- ouverture de la liste dans l'administration : aucune extension n'est donc
-- nécessaire. Pour une purge garantie même sans trafic, planifiez-la avec
-- pg_cron (bloc facultatif en fin de fichier).
-- ---------------------------------------------------------------------------

create or replace function public.purger_messages_expires()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  supprimes integer;
begin
  delete from public.messages_contact
  where recu_le < now() - interval '12 months';
  get diagnostics supprimes = row_count;
  return supprimes;
end;
$$;

revoke all on function public.purger_messages_expires() from anon, authenticated;

-- ---------------------------------------------------------------------------
-- FACULTATIF — purge planifiée
--
-- À exécuter séparément, après avoir activé l'extension pg_cron dans
-- Supabase > Database > Extensions. Sans cela, la purge reste déclenchée par
-- l'application, ce qui suffit dès lors que le site reçoit des messages.
--
--   select cron.schedule(
--     'purge-messages-contact',
--     '0 3 * * *',
--     $job$ select public.purger_messages_expires(); $job$
--   );
-- ---------------------------------------------------------------------------
