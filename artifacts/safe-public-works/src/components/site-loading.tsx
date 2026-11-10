export default function SiteLoading() {
  return (
    <div className="spw-loading" role="status">
      <picture>
        <img src="/brand-logo.webp" alt="Safeevg" width={112} height={112} />
      </picture>
      <span>Loading Safeevg…</span>
    </div>
  );
}

