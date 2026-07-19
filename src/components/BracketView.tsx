import { getTrack } from "@/src/data/catalog";
import { getMatchParticipants } from "@/src/lib/bracket";
import type { BracketState, TournamentMatch } from "@/src/types/bracket";

function MatchNode({ match, bracket }: { match: TournamentMatch; bracket: BracketState }) {
  const participants = getMatchParticipants(match, bracket);
  return (
    <article className={`match-node ${match.winnerTrackId ? "match-node-complete" : ""}`}>
      <span className="match-number">第 {match.orderInRound + 1} 次相遇</span>
      {participants.map((trackId, index) => (
        <div className={trackId === match.winnerTrackId ? "match-entry match-winner" : "match-entry"} key={index}>
          <span>{trackId ? getTrack(trackId)?.title : "等待前一次 Pick"}</span>
          {trackId === match.winnerTrackId && <span aria-label="已被 Pick">✦</span>}
        </div>
      ))}
    </article>
  );
}

export function BracketView({ bracket, preview = false }: { bracket: BracketState; preview?: boolean }) {
  const groups = new Map<string, TournamentMatch[]>();
  bracket.matches.forEach((match) => {
    const key = `${match.roundIndex}:${match.roundLabel}`;
    const group = groups.get(key) ?? [];
    group.push(match);
    groups.set(key, group);
  });

  const entries = [...groups.entries()];
  const visible = preview ? entries.slice(0, bracket.qualifierCount ? 2 : 1) : entries;
  return (
    <div className="bracket-scroll">
      <div className="bracket-grid">
        {visible.map(([key, matches]) => (
          <section className="bracket-round" key={key}>
            <h3>{matches[0].roundLabel}</h3>
            <div className="round-matches">
              {matches.map((match) => <MatchNode match={match} bracket={bracket} key={match.id} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
