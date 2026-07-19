export default function SelectLoading() {
  return (
    <div className="page-shell selection-skeleton" aria-label="正在打开专辑选择">
      <p className="eyebrow">第一步 · 带上熟悉的作品</p>
      <div className="skeleton-heading" />
      <div className="skeleton-grid">
        {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index} />)}
      </div>
    </div>
  );
}
