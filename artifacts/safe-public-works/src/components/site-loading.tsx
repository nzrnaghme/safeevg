export default function SiteLoading() {
  return (
    <div className="spw-loading" role="status">
      <picture>
        <img src="/brand-logo.webp" alt="EVG" width={112} height={112} />
      </picture>
      <span>Loading EVG…</span>
    </div>
  );
}

