import { MusicListenButton } from "@/src/components/MusicPlatformProvider";
import { getFactSourceUrl } from "@/src/data/catalog";
import type { Track } from "@/src/types/content";

export function TrackCard({
  track,
  side,
  onChoose,
  disabled = false,
}: {
  track: Track;
  side: "left" | "right";
  onChoose: () => void;
  disabled?: boolean;
}) {
  const factSourceUrl = getFactSourceUrl(track);
  const releaseInformation = [
    track.language.length ? `语言：${track.language.join(" / ")}` : "语言：以公开发行页为准",
    track.label ? `唱片：${track.label}` : "唱片：以公开发行页为准",
  ].join(" · ");
  return (
    <article className={`duel-card duel-card-${side}`}>
      <div className="card-orbit" aria-hidden="true">
        <span />
      </div>
      <div className="duel-card-copy">
        <p className="eyebrow">{track.releaseYear} · {track.albumTitle}</p>
        <h2>{track.title}</h2>
        {track.titleEn && track.titleEn !== track.title && <p className="track-en">{track.titleEn}</p>}
        <div className="track-story">
          <span>作品线索</span>
          <p>{track.summary}</p>
          <details>
            <summary>了解更多发行背景</summary>
            <p>{track.albumIntroduction}</p>
            <small>{releaseInformation}</small>
            <a href={factSourceUrl} target="_blank" rel="noreferrer">查看资料来源 ↗</a>
          </details>
        </div>
      </div>
      <div className="duel-card-actions">
        <button className="button button-primary" type="button" onClick={onChoose} disabled={disabled}>
          留下这首
        </button>
        <MusicListenButton track={track} />
      </div>
    </article>
  );
}
