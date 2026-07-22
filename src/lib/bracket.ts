import type {
  BracketState,
  MatchSlot,
  TournamentMatch,
} from "@/src/types/bracket";
import { createSeededRandom, seededShuffle } from "./seeded-random";

export const PICK_FIELD_SIZE = 16;
export const MIN_TRACKS = PICK_FIELD_SIZE;
export const MAX_TRACKS = 128;

export function uniqueTrackIds(trackIds: string[]) {
  return [...new Set(trackIds)];
}

export function largestPowerOfTwoAtMost(value: number) {
  if (value < 1) return 0;
  return 2 ** Math.floor(Math.log2(value));
}

export function getTournamentShape(trackCount: number) {
  const bracketSize = largestPowerOfTwoAtMost(trackCount);
  return {
    bracketSize,
    qualifierCount: trackCount - bracketSize,
    totalMatches: Math.max(0, trackCount - 1),
  };
}

export function getRoundLabel(entrantCount: number) {
  if (entrantCount === 2) return "决赛 Pick";
  if (entrantCount === 4) return "4 强 Pick";
  if (entrantCount === 8) return "8 强 Pick";
  if (entrantCount === 16) return "16 强 Pick";
  return `${entrantCount} 首阶段`;
}

function createId(prefix: string, index: number) {
  return `${prefix}-${String(index + 1).padStart(3, "0")}`;
}

export function createBracket(
  inputTrackIds: string[],
  seed: string,
  now = new Date().toISOString(),
): BracketState {
  const selectedTrackIds = uniqueTrackIds(inputTrackIds);
  if (selectedTrackIds.length < MIN_TRACKS || selectedTrackIds.length > MAX_TRACKS) {
    throw new Error(`候选歌曲数量必须在 ${MIN_TRACKS} 到 ${MAX_TRACKS} 之间。`);
  }

  const random = createSeededRandom(seed);
  const shuffled = seededShuffle(selectedTrackIds, random);
  const { bracketSize, qualifierCount } = getTournamentShape(shuffled.length);
  const matches: TournamentMatch[] = [];
  const mainEntrants: MatchSlot[] = [];

  for (let index = 0; index < qualifierCount; index += 1) {
    const matchId = createId("q", index);
    matches.push({
      id: matchId,
      stage: "qualifier",
      roundIndex: -1,
      roundLabel: "附加 Pick",
      orderInRound: index,
      slots: [
        { kind: "track", trackId: shuffled[index * 2] },
        { kind: "track", trackId: shuffled[index * 2 + 1] },
      ],
    });
    mainEntrants.push({ kind: "winner", matchId });
  }

  shuffled.slice(qualifierCount * 2).forEach((trackId) => {
    mainEntrants.push({ kind: "track", trackId });
  });

  let previousSlots = seededShuffle(mainEntrants, random);
  let roundIndex = 0;
  while (previousSlots.length > 1) {
    const currentRound: TournamentMatch[] = [];
    for (let index = 0; index < previousSlots.length; index += 2) {
      const matchId = `r${roundIndex + 1}-${String(index / 2 + 1).padStart(3, "0")}`;
      const match: TournamentMatch = {
        id: matchId,
        stage: "main",
        roundIndex,
        roundLabel: getRoundLabel(previousSlots.length),
        orderInRound: index / 2,
        slots: [previousSlots[index], previousSlots[index + 1]],
      };
      currentRound.push(match);
      matches.push(match);
    }
    previousSlots = currentRound.map((match) => ({
      kind: "winner" as const,
      matchId: match.id,
    }));
    roundIndex += 1;
  }

  return {
    schemaVersion: 1,
    bracketId: `lastsong-${seed}`,
    seed,
    selectedTrackIds,
    bracketSize,
    qualifierCount,
    matches,
    createdAt: now,
    updatedAt: now,
  };
}

export function resolveSlot(slot: MatchSlot, bracket: BracketState) {
  if (slot.kind === "track") return slot.trackId;
  return bracket.matches.find((match) => match.id === slot.matchId)?.winnerTrackId;
}

export function getMatchParticipants(match: TournamentMatch, bracket: BracketState) {
  return match.slots.map((slot) => resolveSlot(slot, bracket)) as [
    string | undefined,
    string | undefined,
  ];
}

export function getCurrentMatch(bracket: BracketState) {
  return bracket.matches.find((match) => {
    if (match.winnerTrackId) return false;
    return getMatchParticipants(match, bracket).every(Boolean);
  });
}

export function decideMatch(
  bracket: BracketState,
  matchId: string,
  winnerTrackId: string,
  now = new Date().toISOString(),
) {
  const match = bracket.matches.find((candidate) => candidate.id === matchId);
  if (!match) throw new Error("找不到这次 Pick。");
  if (match.winnerTrackId) throw new Error("这次 Pick 已经完成。");
  const participants = getMatchParticipants(match, bracket);
  if (!participants.includes(winnerTrackId)) throw new Error("被 Pick 的歌曲不在本次相遇中。");

  return {
    ...bracket,
    matches: bracket.matches.map((candidate) =>
      candidate.id === matchId
        ? { ...candidate, winnerTrackId, decidedAt: now }
        : candidate,
    ),
    updatedAt: now,
  };
}

export function undoLastDecision(bracket: BracketState, now = new Date().toISOString()) {
  let targetIndex = -1;
  for (let index = bracket.matches.length - 1; index >= 0; index -= 1) {
    if (bracket.matches[index].winnerTrackId) {
      targetIndex = index;
      break;
    }
  }
  if (targetIndex < 0) return bracket;
  return {
    ...bracket,
    matches: bracket.matches.map((match, index) =>
      index === targetIndex
        ? { ...match, winnerTrackId: undefined, decidedAt: undefined }
        : match,
    ),
    updatedAt: now,
  };
}

export function getCompletedMatchCount(bracket: BracketState) {
  return bracket.matches.filter((match) => match.winnerTrackId).length;
}

export type PickRegion = "星轨 A 区" | "星轨 B 区" | "决赛" | "附加阶段";

export function getMatchRegion(match: TournamentMatch): PickRegion {
  if (match.stage === "qualifier") return "附加阶段";
  if (match.roundIndex >= 3) return "决赛";

  // 固定 16 强的每一轮都由左右两个分区各自推进，直到决赛相遇。
  const matchesPerRegion = 2 ** Math.max(0, 2 - match.roundIndex);
  return match.orderInRound < matchesPerRegion ? "星轨 A 区" : "星轨 B 区";
}

export function getChampionTrackId(bracket: BracketState) {
  const finalMatch = bracket.matches.at(-1);
  return finalMatch?.winnerTrackId;
}

export function getChampionRoute(bracket: BracketState, championTrackId: string) {
  return bracket.matches
    .filter((match) => match.winnerTrackId === championTrackId)
    .map((match) => {
      const participants = getMatchParticipants(match, bracket);
      return {
        match,
        opponentTrackId: participants.find((trackId) => trackId !== championTrackId),
      };
    });
}

export type RankingTier = {
  startRank: number;
  endRank: number;
  trackIds: string[];
  stageLabel: string;
};

export function getRankingTiers(bracket: BracketState): RankingTier[] {
  const championTrackId = getChampionTrackId(bracket);
  if (!championTrackId || bracket.matches.some((match) => !match.winnerTrackId)) return [];

  const tiers: RankingTier[] = [{
    startRank: 1,
    endRank: 1,
    trackIds: [championTrackId],
    stageLabel: "最 Pick",
  }];
  let nextRank = 2;

  const mainRoundIndexes = [...new Set(
    bracket.matches.filter((match) => match.stage === "main").map((match) => match.roundIndex),
  )].sort((left, right) => right - left);

  mainRoundIndexes.forEach((roundIndex) => {
    const roundMatches = bracket.matches.filter((match) => match.stage === "main" && match.roundIndex === roundIndex);
    const trackIds = roundMatches.flatMap((match) => {
      const participants = getMatchParticipants(match, bracket);
      const loser = participants.find((trackId) => trackId && trackId !== match.winnerTrackId);
      return loser ? [loser] : [];
    });
    if (!trackIds.length) return;
    tiers.push({
      startRank: nextRank,
      endRank: nextRank + trackIds.length - 1,
      trackIds,
      stageLabel: roundMatches[0].roundLabel,
    });
    nextRank += trackIds.length;
  });

  const qualifierTrackIds = bracket.matches
    .filter((match) => match.stage === "qualifier")
    .flatMap((match) => {
      const participants = getMatchParticipants(match, bracket);
      const loser = participants.find((trackId) => trackId && trackId !== match.winnerTrackId);
      return loser ? [loser] : [];
    });

  if (qualifierTrackIds.length) {
    tiers.push({
      startRank: nextRank,
      endRank: nextRank + qualifierTrackIds.length - 1,
      trackIds: qualifierTrackIds,
      stageLabel: "附加 Pick",
    });
  }

  return tiers;
}

export function generateSeed() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}
