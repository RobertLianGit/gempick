import discography from "@/data/gem-discography.json";
import type { Album, Track } from "@/src/types/content";

type RawTrack = {
  position: number;
  title: string;
  title_en?: string;
  description?: string;
  version?: string;
};

type RawRelease = {
  id: string;
  title: string;
  title_en?: string;
  release_type: string;
  release_date: string;
  language?: string[];
  introduction?: string;
  label?: string;
  tracks: RawTrack[];
  sources?: string[];
};

type RawStandaloneRelease = {
  year: number;
  title: string;
  english_title?: string;
  type: string;
  description?: string;
  work?: string;
};

const releases = discography.releases as RawRelease[];
const standaloneReleases = discography.standalone_and_featured_releases as RawStandaloneRelease[];

export const tracks: Track[] = releases.flatMap((release) =>
  release.tracks.map((track) => ({
    id: `${release.id}--${track.position}`,
    title: track.title,
    titleEn: track.title_en,
    albumId: release.id,
    albumTitle: release.title,
    releaseYear: Number(release.release_date.slice(0, 4)),
    language: release.language ?? [],
    summary: track.description ?? "这首作品收录于该发行版本。",
    albumIntroduction: release.introduction ?? "",
    label: release.label,
    version: track.version,
    sourceUrls: release.sources ?? [],
  })),
);

const standaloneTracks: Track[] = standaloneReleases.map((release, index) => ({
  id: `single--${release.year}--${String(index + 1).padStart(2, "0")}`,
  title: release.title,
  titleEn: release.english_title,
  albumId: `single--${release.year}--${String(index + 1).padStart(2, "0")}`,
  albumTitle: release.work ?? "独立发行作品",
  releaseYear: release.year,
  language: [],
  summary: release.description ?? "这首作品收录于独立发行作品索引。",
  albumIntroduction: release.work ?? "独立发行作品",
  sourceUrls: [],
}));

tracks.push(...standaloneTracks);

export const standaloneTrackCount = standaloneTracks.length;

export const albums: Album[] = releases.map((release) => ({
  id: release.id,
  title: release.title,
  titleEn: release.title_en,
  releaseType: release.release_type,
  releaseDate: release.release_date,
  releaseYear: Number(release.release_date.slice(0, 4)),
  introduction: release.introduction ?? "",
  label: release.label,
  trackIds: release.tracks.map((track) => `${release.id}--${track.position}`),
  sourceUrls: release.sources ?? [],
}));

export const tracksById = new Map(tracks.map((track) => [track.id, track]));
export const albumsById = new Map(albums.map((album) => [album.id, album]));

const starterTitles = [
  "回忆的沙漏",
  "A.I.N.Y. 爱你",
  "泡沫",
  "多远都要在一起",
  "来自天堂的魔鬼",
  "光年之外",
  "倒数",
  "句号",
  "新的心跳",
  "超能力",
];

export const starterTracks = starterTitles
  .map((title) => tracks.find((track) => track.title === title))
  .filter((track): track is Track => Boolean(track));

export const starterTrackIds = starterTracks.map((track) => track.id);

export function getTrack(trackId: string) {
  return tracksById.get(trackId);
}

export function getListeningUrl(track: Track) {
  return track.sourceUrls.find((url) => url.includes("music.apple.com")) ??
    `https://music.apple.com/cn/search?term=${encodeURIComponent(`邓紫棋 ${track.title}`)}`;
}

export function getFactSourceUrl(track: Track) {
  return track.sourceUrls.find((url) => !url.includes("music.apple.com")) ??
    track.sourceUrls[0] ??
    getListeningUrl(track);
}
