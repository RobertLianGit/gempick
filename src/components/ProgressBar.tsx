export function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const percentage = total ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  return (
    <div className="progress-wrap" aria-label={`${label} ${current}/${total}`}>
      <div className="progress-copy">
        <span>{label}</span>
        <span className="mono">已完成 {current} 次 Pick · 共 {total} 次</span>
      </div>
      <div className="orbit-progress">
        <div className="orbit-progress-fill" style={{ width: `${percentage}%` }} />
        <span className="orbit-progress-star" style={{ left: `${percentage}%` }} aria-hidden="true" />
      </div>
    </div>
  );
}
