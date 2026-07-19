"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getMusicPlatformLabel,
  getMusicPlatformUrl,
  isMusicPlatform,
  MUSIC_PLATFORMS,
  MUSIC_PLATFORM_STORAGE_KEY,
  type MusicPlatform,
} from "@/src/lib/music-platform";
import type { Track } from "@/src/types/content";

type MusicPlatformContextValue = {
  platform?: MusicPlatform;
  platformLabel?: string;
  listen: (track: Track) => void;
  openSettings: () => void;
};

const MusicPlatformContext = createContext<MusicPlatformContextValue | null>(null);

export function MusicPlatformProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = useState<MusicPlatform>();
  const [chooserOpen, setChooserOpen] = useState(false);
  const [pendingTrack, setPendingTrack] = useState<Track>();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(MUSIC_PLATFORM_STORAGE_KEY);
      if (isMusicPlatform(saved)) setPlatform(saved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const value = useMemo<MusicPlatformContextValue>(() => ({
    platform,
    platformLabel: platform ? getMusicPlatformLabel(platform) : undefined,
    listen(track) {
      if (platform) {
        window.open(getMusicPlatformUrl(platform, track), "_blank", "noopener,noreferrer");
        return;
      }
      setPendingTrack(track);
      setChooserOpen(true);
    },
    openSettings() {
      setPendingTrack(undefined);
      setChooserOpen(true);
    },
  }), [platform]);

  function choosePlatform(nextPlatform: MusicPlatform) {
    window.localStorage.setItem(MUSIC_PLATFORM_STORAGE_KEY, nextPlatform);
    setPlatform(nextPlatform);
    setChooserOpen(false);
    if (pendingTrack) {
      window.open(getMusicPlatformUrl(nextPlatform, pendingTrack), "_blank", "noopener,noreferrer");
      setPendingTrack(undefined);
    }
  }

  return (
    <MusicPlatformContext.Provider value={value}>
      {children}
      {chooserOpen && (
        <div className="music-platform-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setChooserOpen(false);
        }}>
          <section className="music-platform-dialog" role="dialog" aria-modal="true" aria-labelledby="music-platform-title">
            <button className="dialog-close" type="button" aria-label="关闭听歌平台选择" onClick={() => setChooserOpen(false)}>×</button>
            <p className="eyebrow">只需要选择一次</p>
            <h2 id="music-platform-title">你习惯在哪里听歌？</h2>
            <p className="music-platform-intro">选好后，网站里的所有试听入口都会直接带你去这个平台。偏好只保存在当前浏览器，不会上传。</p>
            <div className="music-platform-options">
              {MUSIC_PLATFORMS.map((candidate) => (
                <button className={`music-platform-option ${platform === candidate.id ? "music-platform-option-active" : ""}`} type="button" onClick={() => choosePlatform(candidate.id)} key={candidate.id}>
                  <span aria-hidden="true">♪</span>
                  <span><strong>{candidate.label}</strong><small>{candidate.description}</small></span>
                  {platform === candidate.id && <em>当前使用</em>}
                </button>
              ))}
            </div>
            <small className="music-platform-note">本站不会读取你的音乐账号，也不会在站内播放音频。</small>
          </section>
        </div>
      )}
    </MusicPlatformContext.Provider>
  );
}

function useMusicPlatform() {
  const context = useContext(MusicPlatformContext);
  if (!context) throw new Error("MusicPlatformProvider is missing");
  return context;
}

export function MusicListenButton({
  track,
  className = "listen-button",
  title = "去音乐平台听听",
  note = "不太熟悉？先去听听，再回来选择；进度还在 ↗",
}: {
  track: Track;
  className?: string;
  title?: string;
  note?: string;
}) {
  const { listen, platformLabel } = useMusicPlatform();
  return (
    <button className={className} type="button" onClick={() => listen(track)}>
      <span aria-hidden="true">♪</span>
      <span>
        <strong>{platformLabel ? `${title} · ${platformLabel}` : title}</strong>
        {note && <small>{note}</small>}
      </span>
    </button>
  );
}

export function MusicPlatformSettings() {
  const { platformLabel, openSettings } = useMusicPlatform();
  return (
    <button className="footer-platform-button" type="button" onClick={openSettings}>
      {platformLabel ? `听歌平台：${platformLabel}` : "选择听歌平台"}
    </button>
  );
}
