export type MatchSlot =
  | { kind: "track"; trackId: string }
  | { kind: "winner"; matchId: string };

export type TournamentMatch = {
  id: string;
  stage: "qualifier" | "main";
  roundIndex: number;
  roundLabel: string;
  orderInRound: number;
  slots: [MatchSlot, MatchSlot];
  winnerTrackId?: string;
  decidedAt?: string;
};

export type BracketState = {
  schemaVersion: 1;
  bracketId: string;
  seed: string;
  selectedTrackIds: string[];
  bracketSize: number;
  qualifierCount: number;
  matches: TournamentMatch[];
  createdAt: string;
  updatedAt: string;
};

export type SavedState = {
  schemaVersion: 1;
  selectedTrackIds: string[];
  starterSeeded?: boolean;
  bracket?: BracketState;
  updatedAt: string;
};
