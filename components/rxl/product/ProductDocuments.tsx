import type { ProductDocument } from "@/lib/rxl/types/catalog";

export function ProductDocuments({ documents }: { documents: ProductDocument[] }) {
  if (!documents.length) return <p className="rxl-pdp-muted">No verified product documents are connected yet.</p>;
  return (
    <div className="rxl-document-list">
      {documents.map((document) => (
        <div className="rxl-document-row" key={document.id}>
          <div>
            <strong>{document.title}</strong>
            <span>{[document.format, document.size].filter(Boolean).join(" · ") || document.type}</span>
          </div>
          {document.href ? (
            <a href={document.href} className="rxl-card-link">Open document</a>
          ) : (
            <span className="rxl-demo-badge">Not connected</span>
          )}
        </div>
      ))}
    </div>
  );
}
