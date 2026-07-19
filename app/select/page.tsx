"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { albums, getTrack, starterTrackIds, starterTracks } from "@/src/data/catalog";
import { MAX_TRACKS, MIN_TRACKS } from "@/src/lib/bracket";
import { useSavedState } from "@/src/hooks/useSavedState";

export default function SelectPage() {
  const router = useRouter();
  const { state, hydrated, updateSelection, reset } = useSavedState();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const selected = state.selectedTrackIds;

  useEffect(() => {
    if (hydrated && !state.starterSeeded && selected.length === 0 && starterTrackIds.length === 10) {
      updateSelection(starterTrackIds);
    }
  }, [hydrated, selected.length, state.starterSeeded, updateSelection]);

  function toggleTrack(trackId: string) {
    if (selected.includes(trackId)) {
      updateSelection(selected.filter((id) => id !== trackId));
      setMessage("");
      return;
    }
    if (selected.length >= MAX_TRACKS) {
      setMessage(`最多选择 ${MAX_TRACKS} 首；请先放下一首。`);
      return;
    }
    updateSelection([...selected, trackId]);
    setMessage("");
  }

  function toggleAlbum(albumId: string) {
    const album = albums.find((candidate) => candidate.id === albumId);
    if (!album) return;
    const allSelected = album.trackIds.every((id) => selected.includes(id));
    if (allSelected) {
      updateSelection(selected.filter((id) => !album.trackIds.includes(id)));
      setMessage("");
      return;
    }
    const next = [...new Set([...selected, ...album.trackIds])];
    if (next.length > MAX_TRACKS) {
      setMessage(`最多选择 ${MAX_TRACKS} 首；请先取消一张专辑。`);
      return;
    }
    updateSelection(next);
    setMessage("");
  }

  function continueFlow() {
    if (selected.length < MIN_TRACKS) {
      setMessage(`还差 ${MIN_TRACKS - selected.length} 首，才能开始这段旅程。`);
      return;
    }
    router.push("/bracket");
  }

  function restartSelection() {
    if (window.confirm("重新开始后，之前的选择会被清除。确定要从头来吗？")) {
      reset();
      setExpanded([]);
      setMessage("");
    }
  }

  if (!hydrated) return <div className="page-shell loading-state">正在找回你的选择…</div>;

  return (
    <div className="page-shell flow-page">
      <header className="flow-header">
        <p className="eyebrow">第一步 · 先从十首开始</p>
        <h1>先留下你想带上的歌</h1>
        <p>起点十首已经替你准备好；接下来可以按专辑逐首挑选，也可以整张加入。</p>
      </header>

      <section className="top-action-panel">
        <div className="top-action-status">
          <span className="status-star" aria-hidden="true">✦</span>
          <div>
            <strong>你已经留下 {selected.length} 首</strong>
            <span>{selected.length < MIN_TRACKS ? `距离 ${MIN_TRACKS} 首还差 ${MIN_TRACKS - selected.length} 首` : `接下来还要做 ${selected.length - 1} 次选择`}</span>
            <small>这段选择已经替你保存好了</small>
          </div>
        </div>
        <div className="top-action-buttons">
          <button className="text-link reset-selection-button" type="button" onClick={restartSelection}>重新开始一段选择</button>
          <Link href="/about" className="text-link">轻量旅程怎么玩？</Link>
          <button className="button button-primary" type="button" onClick={continueFlow} disabled={selected.length < MIN_TRACKS}>
            {selected.length < MIN_TRACKS ? `还差 ${MIN_TRACKS - selected.length} 首` : "开始相遇 →"}
          </button>
        </div>
      </section>
      {message && <p className="inline-error" role="alert">{message}</p>}

      <section className="starter-panel">
        <div className="section-heading inline-heading">
          <div><p className="eyebrow">起点十首</p><h2>先从这十首开始</h2></div>
          <span>已经自动留下，可随时放下或换歌</span>
        </div>
        <div className="starter-grid">
          {starterTracks.map((track) => {
            const checked = selected.includes(track.id);
            return (
              <button className={`starter-track ${checked ? "starter-track-selected" : ""}`} type="button" key={track.id} onClick={() => toggleTrack(track.id)} aria-pressed={checked}>
                <span>{checked ? "✦" : "+"}</span>
                <strong>{track.title}</strong>
                <small>{track.albumTitle} · {track.releaseYear}</small>
              </button>
            );
          })}
        </div>
      </section>

      <div className="selection-tools">
        <span>继续探索专辑：可以逐首加入，也可以整张带上</span>
        <span className="mono">上限 {MAX_TRACKS} 首</span>
      </div>

      <div className="album-grid">
        {albums.map((album, index) => {
          const isSelected = album.trackIds.every((id) => selected.includes(id));
          const isExpanded = expanded.includes(album.id);
          return (
            <article className={`album-card ${isSelected ? "album-card-selected" : ""}`} style={{ "--delay": `${index * 18}ms` } as React.CSSProperties} key={album.id}>
              <div className="album-card-top">
                <span className="album-year mono">{album.releaseYear}</span>
                <span className="album-status" aria-label={isSelected ? "已选择" : "未选择"}>{isSelected ? "✦" : "○"}</span>
              </div>
              <div className="album-orbit" aria-hidden="true"><span /></div>
              <p className="album-type">{album.releaseType === "ep" ? "EP" : "ALBUM"} · {album.trackIds.length} TRACKS</p>
              <h2>{album.title}</h2>
              {album.titleEn && album.titleEn !== album.title && <p className="album-en">{album.titleEn}</p>}
              <div className="album-actions">
                <button className={isSelected ? "button button-secondary" : "button button-primary"} type="button" onClick={() => toggleAlbum(album.id)}>
                  {isSelected ? "撤下整张专辑" : "整张加入"}
                </button>
                <button className="icon-button" type="button" aria-expanded={isExpanded} onClick={() => setExpanded(isExpanded ? expanded.filter((id) => id !== album.id) : [...expanded, album.id])}>
                  {isExpanded ? "收起歌曲" : "看看这张专辑里有什么"} {isExpanded ? "↑" : "↓"}
                </button>
              </div>
              {isExpanded && (
                <ol className="album-track-list">
                  {album.trackIds.map((id) => {
                    const track = getTrack(id);
                    const checked = selected.includes(id);
                    return (
                      <li key={id}>
                        <span>{track?.title}</span>
                        <button className="track-inline-button" type="button" onClick={() => toggleTrack(id)} aria-pressed={checked}>
                          {checked ? "已加入 · 放下" : "逐首加入"}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
            </article>
          );
        })}
      </div>

    </div>
  );
}
