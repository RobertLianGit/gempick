const stages = ["16 强", "8 强", "4 强", "决赛"];

export function ProgressBar({ current, total, label, region }: { current: number; total: number; label: string; region: string }) {
  const percentage = total ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  return (
    <div className="progress-wrap" aria-label={`${label} ${current}/${total}`}>
      <div className="progress-window-heading">
        <span>歌曲世界杯 · {region}</span>
        <strong>{label}</strong>
      </div>
      <div className="progress-copy">
        <span>总进度</span>
        <span className="mono">{current} / {total} 次 Pick</span>
      </div>
      <div className="orbit-progress">
        <div className="orbit-progress-fill" style={{ width: `${percentage}%` }} />
        <span className="orbit-progress-star" style={{ left: `${percentage}%` }} aria-hidden="true" />
      </div>
      <div className="progress-stages" aria-hidden="true">
        {stages.map((stage) => <span key={stage}>{stage}</span>)}
      </div>
    </div>
  );
}
