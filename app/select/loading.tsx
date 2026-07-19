export default function SelectLoading() {
  return (
    <div className="page-shell selection-skeleton" aria-label="正在打开候选歌曲页面">
      <p className="eyebrow">第一步 · 预选阶段</p>
      <div className="skeleton-heading" />
      <div className="skeleton-grid">
        {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index} />)}
      </div>
    </div>
  );
}
