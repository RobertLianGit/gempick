import { describe, expect, it } from "vitest";
import {
  createBracket,
  decideMatch,
  getChampionTrackId,
  getCurrentMatch,
  getMatchParticipants,
  getRankingTiers,
  getTournamentShape,
  uniqueTrackIds,
} from "../lib/bracket";

function ids(count: number) {
  return Array.from({ length: count }, (_, index) => `track-${index + 1}`);
}

describe("tournament shape", () => {
  it.each([
    [16, 16, 0, 15],
    [17, 16, 1, 16],
    [20, 16, 4, 19],
    [32, 32, 0, 31],
    [33, 32, 1, 32],
    [43, 32, 11, 42],
    [64, 64, 0, 63],
    [65, 64, 1, 64],
    [100, 64, 36, 99],
    [128, 128, 0, 127],
  ])("creates the expected shape for %i tracks", (count, bracketSize, qualifiers, totalMatches) => {
    expect(getTournamentShape(count)).toEqual({ bracketSize, qualifierCount: qualifiers, totalMatches });
    const bracket = createBracket(ids(count), "fixed-seed", "2026-07-19T00:00:00.000Z");
    expect(bracket.bracketSize).toBe(bracketSize);
    expect(bracket.qualifierCount).toBe(qualifiers);
    expect(bracket.matches).toHaveLength(totalMatches);
  });

  it("rejects fewer than 16 or more than 128 unique tracks", () => {
    expect(() => createBracket(ids(15), "seed")).toThrow();
    expect(() => createBracket(ids(129), "seed")).toThrow();
  });

  it("deduplicates IDs before validating", () => {
    const input = [...ids(16), "track-1", "track-2"];
    expect(uniqueTrackIds(input)).toHaveLength(16);
    expect(createBracket(input, "seed").selectedTrackIds).toHaveLength(16);
  });
});

describe("bracket progression", () => {
  it("is reproducible for the same tracks and seed", () => {
    const first = createBracket(ids(43), "purple-orbit", "2026-07-19T00:00:00.000Z");
    const second = createBracket(ids(43), "purple-orbit", "2026-07-19T00:00:00.000Z");
    expect(first.matches).toEqual(second.matches);
  });

  it.each([16, 17, 20, 32, 33, 43, 64, 65, 100, 128])("finishes a %i-track tournament without a dead end", (count) => {
    let bracket = createBracket(ids(count), `seed-${count}`, "2026-07-19T00:00:00.000Z");
    let decisions = 0;
    while (getCurrentMatch(bracket)) {
      const match = getCurrentMatch(bracket)!;
      const [winner] = getMatchParticipants(match, bracket);
      expect(winner).toBeTruthy();
      bracket = decideMatch(bracket, match.id, winner!);
      decisions += 1;
    }
    expect(decisions).toBe(count - 1);
    expect(getChampionTrackId(bracket)).toBeTruthy();
    expect(bracket.matches.every((match) => match.winnerTrackId)).toBe(true);
  });

  it.each([
    [16, [1, 1, 2, 4, 8]],
    [17, [1, 1, 2, 4, 8, 1]],
  ])("creates honest ranking tiers for %i tracks", (count, expectedTierSizes) => {
    let bracket = createBracket(ids(count), `ranking-${count}`, "2026-07-19T00:00:00.000Z");
    while (getCurrentMatch(bracket)) {
      const match = getCurrentMatch(bracket)!;
      const [winner] = getMatchParticipants(match, bracket);
      bracket = decideMatch(bracket, match.id, winner!);
    }
    const tiers = getRankingTiers(bracket);
    expect(tiers.map((tier) => tier.trackIds.length)).toEqual(expectedTierSizes);
    expect(tiers.flatMap((tier) => tier.trackIds)).toHaveLength(count);
    expect(new Set(tiers.flatMap((tier) => tier.trackIds))).toHaveLength(count);
    expect(tiers.at(-1)?.endRank).toBe(count);
  });
});
