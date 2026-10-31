import type { Metadata } from 'next';
import {
  AccueilInternational,
  metadataAccueilInternational,
} from '@/components/international/AccueilInternational';
import { accueilEn } from '@/content/i18n/en';

export function generateMetadata(): Promise<Metadata> {
  return metadataAccueilInternational(accueilEn);
}

export default function AccueilAnglais() {
  return <AccueilInternational dico={accueilEn} />;
}
