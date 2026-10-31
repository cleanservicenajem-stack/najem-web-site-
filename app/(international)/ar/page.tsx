import type { Metadata } from 'next';
import {
  AccueilInternational,
  metadataAccueilInternational,
} from '@/components/international/AccueilInternational';
import { accueilAr } from '@/content/i18n/ar';

export function generateMetadata(): Promise<Metadata> {
  return metadataAccueilInternational(accueilAr);
}

export default function AccueilArabe() {
  return <AccueilInternational dico={accueilAr} />;
}
