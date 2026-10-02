import { buildGraph, type JsonLd } from '@/lib/schema';

type StructuredDataProps = {
  /** Entités schema.org à publier. Elles sont regroupées dans un `@graph`. */
  data: JsonLd[];
  id?: string;
};

/**
 * Injecte un bloc JSON-LD unique par page. Le regroupement en `@graph` évite
 * les entités dupliquées et permet de référencer l'organisation par `@id`.
 */
export function StructuredData({ data, id = 'structured-data' }: StructuredDataProps) {
  if (data.length === 0) return null;

  return (
    <script
      id={id}
      type="application/ld+json"
      // Contenu généré côté serveur à partir de données statiques typées.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildGraph(data)).replace(/</g, '\\u003c'),
      }}
    />
  );
}
