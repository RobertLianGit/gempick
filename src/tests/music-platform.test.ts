import { describe, expect, it } from "vitest";
import { getMusicPlatformUrl } from "../lib/music-platform";
import type { Track } from "../types/content";

const track: Track = {
  id: "test--1",
  title: "泡沫",
  albumId: "xposed",
  albumTitle: "Xposed",
  releaseYear: 2012,
  language: ["Mandarin"],
  summary: "测试",
  albumIntroduction: "测试",
  sourceUrls: ["https://music.apple.com/cn/album/xposed/541862703"],
};

describe("music platform links", () => {
  it("uses the exact Apple Music release when available", () => {
    expect(getMusicPlatformUrl("apple", track)).toBe(track.sourceUrls[0]);
  });

  it.each([
    ["qq", "y.qq.com"],
    ["netease", "music.163.com"],
    ["kugou", "www.kugou.com"],
  ] as const)("creates a %s search link", (platform, domain) => {
    const url = getMusicPlatformUrl(platform, track);
    expect(url).toContain(domain);
    expect(decodeURIComponent(url)).toContain("邓紫棋 泡沫");
  });

  it("falls back to Apple Music search for a track without a release URL", () => {
    expect(getMusicPlatformUrl("apple", { ...track, sourceUrls: [] })).toContain("music.apple.com/cn/search");
  });
});
