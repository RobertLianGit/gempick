"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { albums, getTrack, starterTrackIds, starterTracks } from "@/src/data/catalog";
import { PICK_FIELD_SIZE } from "@/src/lib/bracket";
import { useSavedState } from "@/src/hooks/useSavedState";

const starterTrackIdSet = new Set(starterTrackIds);
const selfPickSlotCount = PICK_FIELD_SIZE - starterTrackIds.length;

export default function SelectPage() {
  const router = useRouter();
  const { state, hydrated, updateSelection, reset } = useSavedState();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const selected = state.selectedTrackIds;
  const selectedSelfPickCount = selected.filter((id) => !starterTrackIdSet.has(id)).length;
  const starterSongsReady = starterTrackIds.every((id) => selected.includes(id));
  const fieldIsReady = starterSongsReady && selected.length === PICK_FIELD_SIZE && selectedSelfPickCount === selfPickSlotCount;
  const legacySelectionNeedsRestart = state.starterSeeded && !state.bracket && (!starterSongsReady || selectedSelfPickCount > selfPickSlotCount);

  useEffect(() => {
    if (hydrated && !state.starterSeeded && selected.length === 0 && starterTrackIds.length === 10) {
      updateSelection(starterTrackIds);
    }
  }, [hydrated, selected.length, state.starterSeeded, updateSelection]);

  function toggleTrack(trackId: string) {
    if (starterTrackIdSet.has(trackId)) {
      setMessage("这首是自动入围的种子歌，不占你的 6 个自选席位。");
      return;
    }
    if (selected.includes(trackId)) {
      updateSelection(selected.filter((id) => id !== trackId));
      setMessage("");
      return;
    }
    if (selectedSelfPickCount >= selfPickSlotCount || selected.length >= PICK_FIELD_SIZE) {
      setMessage("6 个自选席位已经选满；请先移出一首，再加入新的歌。");
      return;
    }
    updateSelection([...selected, trackId]);
    setMessage("");
  }

  function continueFlow() {
    if (legacySelectionNeedsRestart) {
      setMessage("已有记录不符合新的 10 首种子歌 + 6 个自选席位赛制，请先重新开始 Pick。");
      return;
    }
    if (!fieldIsReady) {
      setMessage(`还需要选满 ${selfPickSlotCount} 个自选席位，组成 16 强。`);
      return;
    }
    router.push("/bracket");
  }

  function restartSelection() {
    if (window.confirm("重新开始后，之前的 Pick 记录会被清除。确定要从头来吗？")) {
      reset();
      setExpanded([]);
      setMessage("");
    }
  }

  if (!hydrated) return <div className="page-shell loading-state">正在找回你的 Pick 进度…</div>;

  return (
    <div className="page-shell flow-page">
      <header className="flow-header">
        <p className="eyebrow">第一步 · 世界杯式预选阶段</p>
        <h1>十首种子歌，六个席位由你决定。</h1>
        <p>十首种子歌已经自动入围；再从全部作品中 Pick 6 首，组成属于你的歌曲 16 强。</p>
      </header>

      <section className="top-action-panel selection-sticky-progress" aria-label={`已选 ${selected.length} / ${PICK_FIELD_SIZE} 首`}>
        <div className="top-action-status">
          <span className="status-star" aria-hidden="true">✦</span>
          <div>
            <strong>已选 {selected.length} / {PICK_FIELD_SIZE} 首</strong>
            <span>{legacySelectionNeedsRestart ? "需要按新赛制重新预选" : fieldIsReady ? "16 强已经就位 · 接下来完成 15 次 Pick" : `10 首种子歌 + 自选席位 ${selectedSelfPickCount} / ${selfPickSlotCount}`}</span>
            <div className="selection-progress-track" aria-hidden="true"><span className="selection-progress-fill" style={{ width: `${Math.min(100, (selected.length / PICK_FIELD_SIZE) * 100)}%` }} /></div>
            <small>候选歌和 Pick 进度已保存在本机</small>
          </div>
        </div>
        <div className="top-action-buttons">
          <button className="button button-primary" type="button" onClick={continueFlow} disabled={!fieldIsReady}>
            {legacySelectionNeedsRestart ? "请先重新开始" : fieldIsReady ? "进入 Pick →" : `还差 ${Math.max(0, selfPickSlotCount - selectedSelfPickCount)} 个席位`}
          </button>
        </div>
      </section>
      <div className="selection-secondary-actions">
        <button className="text-link reset-selection-button" type="button" onClick={restartSelection}>重新开始 Pick</button>
        <Link href="/about" className="text-link">Pick 是怎么玩的？</Link>
      </div>
      {(message || legacySelectionNeedsRestart) && <p className="inline-error" role="alert">{message || "检测到旧版候选记录；请点击“重新开始 Pick”进入新的世界杯式流程。"}</p>}

      <section className="starter-panel">
        <div className="section-heading inline-heading">
          <div><p className="eyebrow">自动入围</p><h2>十首种子歌</h2></div>
          <span>不占你的 6 个自选席位</span>
        </div>
        <div className="starter-grid">
          {starterTracks.map((track) => (
              <div className="starter-track starter-track-selected starter-track-seeded" key={track.id}>
                <span>种子</span>
                <strong>{track.title}</strong>
                <small>{track.albumTitle} · {track.releaseYear}</small>
              </div>
          ))}
        </div>
      </section>

      <div className="selection-tools">
        <span>你的六个席位：展开专辑，逐首选择</span>
        <span className="mono">已选 {Math.min(selectedSelfPickCount, selfPickSlotCount)} / {selfPickSlotCount}</span>
      </div>

      <div className="album-grid">
        {albums.map((album, index) => {
          const selectedInAlbumCount = album.trackIds.filter((id) => selected.includes(id) && !starterTrackIdSet.has(id)).length;
          const isExpanded = expanded.includes(album.id);
          return (
            <article className={`album-card ${selectedInAlbumCount ? "album-card-selected" : ""}`} style={{ "--delay": `${index * 18}ms` } as React.CSSProperties} key={album.id}>
              <div className="album-card-top">
                <span className="album-year mono">{album.releaseYear}</span>
                <span className="album-status" aria-label={`${selectedInAlbumCount} 首进入自选席位`}>{selectedInAlbumCount ? selectedInAlbumCount : "○"}</span>
              </div>
              <div className="album-orbit" aria-hidden="true"><span /></div>
              <p className="album-type">{album.releaseType === "ep" ? "EP" : "ALBUM"} · {album.trackIds.length} TRACKS</p>
              <h2>{album.title}</h2>
              {album.titleEn && album.titleEn !== album.title && <p className="album-en">{album.titleEn}</p>}
              <div className="album-actions">
                <button className="icon-button" type="button" aria-expanded={isExpanded} onClick={() => setExpanded(isExpanded ? expanded.filter((id) => id !== album.id) : [...expanded, album.id])}>
                  {isExpanded ? "收起歌曲" : "从这张专辑选歌"} {isExpanded ? "↑" : "↓"}
                </button>
              </div>
              {isExpanded && (
                <ol className="album-track-list">
                  {album.trackIds.map((id) => {
                    const track = getTrack(id);
                    const checked = selected.includes(id);
                    const seeded = starterTrackIdSet.has(id);
                    return (
                      <li key={id}>
                        <span>{track?.title}</span>
                        <button className="track-inline-button" type="button" onClick={() => toggleTrack(id)} aria-pressed={checked} disabled={seeded}>
                          {seeded ? "种子歌 · 已入围" : checked ? "已选 · 移出席位" : "加入自选席位"}
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
