import type { Track } from "@/src/types/content";

export const MUSIC_PLATFORM_STORAGE_KEY = "gempick:music-platform:v1";

export type MusicPlatform = "qq" | "apple" | "netease" | "kugou";

export const MUSIC_PLATFORMS: Array<{
  id: MusicPlatform;
  label: string;
  description: string;
}> = [
  { id: "qq", label: "QQ 音乐", description: "在 QQ 音乐中搜索并试听" },
  { id: "apple", label: "Apple Music", description: "优先打开对应发行页" },
  { id: "netease", label: "网易云音乐", description: "在网易云音乐中搜索并试听" },
  { id: "kugou", label: "酷狗音乐", description: "在酷狗音乐中搜索并试听" },
];

export function isMusicPlatform(value: string | null): value is MusicPlatform {
  return MUSIC_PLATFORMS.some((platform) => platform.id === value);
}

export function getMusicPlatformLabel(platform: MusicPlatform) {
  return MUSIC_PLATFORMS.find((candidate) => candidate.id === platform)?.label ?? "音乐平台";
}

export function getMusicPlatformUrl(platform: MusicPlatform, track: Track) {
  const query = `邓紫棋 ${track.title}`;
  const encodedQuery = encodeURIComponent(query);

  switch (platform) {
    case "qq":
      return `https://y.qq.com/n/ryqq/search?w=${encodedQuery}&t=song`;
    case "netease":
      return `https://music.163.com/#/search/m/?s=${encodedQuery}&type=1`;
    case "kugou":
      return `https://www.kugou.com/yy/html/search.html#searchType=song&searchKeyWord=${encodedQuery}`;
    case "apple":
      return track.sourceUrls.find((url) => url.includes("music.apple.com")) ??
        `https://music.apple.com/cn/search?term=${encodedQuery}`;
  }
}
