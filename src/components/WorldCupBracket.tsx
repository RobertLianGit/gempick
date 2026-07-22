import { BracketView } from "@/src/components/BracketView";
import { getTrack } from "@/src/data/catalog";
import { getMatchParticipants } from "@/src/lib/bracket";
import type { BracketState, TournamentMatch } from "@/src/types/bracket";

function CupMatch({ match, bracket }: { match: TournamentMatch; bracket: BracketState }) {
  const participants = getMatchParticipants(match, bracket);

  return (
    <article className={`world-cup-match ${match.winnerTrackId ? "world-cup-match-complete" : ""}`}>
      {participants.map((trackId, index) => {
        const winner = Boolean(trackId && trackId === match.winnerTrackId);
        return (
          <div className={winner ? "world-cup-entry world-cup-entry-winner" : "world-cup-entry"} key={`${match.id}-${index}`}>
            <span aria-hidden="true">{winner ? "✦" : "○"}</span>
            <strong title={trackId ? getTrack(trackId)?.title : undefined}>{trackId ? getTrack(trackId)?.title : "等待前一轮"}</strong>
          </div>
        );
      })}
    </article>
  );
}

function RegionLanes({
  bracket,
  label,
  side,
  rounds,
}: {
  bracket: BracketState;
  label: string;
  side: "left" | "right";
  rounds: TournamentMatch[][];
}) {
  const orderedRounds = side === "left" ? rounds : [...rounds].reverse();

  return (
    <section className={`world-cup-region world-cup-region-${side}`}>
      <header><span>{side === "left" ? "A" : "B"}</span><strong>{label}</strong></header>
      <div className="world-cup-lanes">
        {orderedRounds.map((matches) => (
          <div className="world-cup-lane" key={`${side}-${matches[0]?.roundIndex}`}>
            <p>{matches[0]?.roundLabel.replace(" Pick", "")}</p>
            <div className="world-cup-round-matches">
              {matches.map((match) => <CupMatch match={match} bracket={bracket} key={match.id} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WorldCupBracket({ bracket }: { bracket: BracketState }) {
  const mainMatches = bracket.matches.filter((match) => match.stage === "main");
  const rounds = [0, 1, 2].map((roundIndex) => mainMatches.filter((match) => match.roundIndex === roundIndex));
  const finalMatch = mainMatches.find((match) => match.roundIndex === 3);

  if (bracket.bracketSize !== 16 || rounds.some((round) => !round.length) || !finalMatch) {
    return <BracketView bracket={bracket} />;
  }

  const regionA = rounds.map((round) => round.slice(0, round.length / 2));
  const regionB = rounds.map((round) => round.slice(round.length / 2));
  const champion = finalMatch.winnerTrackId ? getTrack(finalMatch.winnerTrackId) : undefined;

  return (
    <div className="world-cup-board">
      <span className="world-cup-orbit world-cup-orbit-one" aria-hidden="true" />
      <span className="world-cup-orbit world-cup-orbit-two" aria-hidden="true" />
      <RegionLanes bracket={bracket} label="星轨 A 区" side="left" rounds={regionA} />
      <section className="world-cup-center">
        <p className="eyebrow">歌曲世界杯 · 决赛</p>
        <div className="world-cup-trophy" aria-hidden="true">✦</div>
        <strong className="world-cup-champion">{champion?.title ?? "等待冠军"}</strong>
        <span>我的最 Pick</span>
        <CupMatch match={finalMatch} bracket={bracket} />
      </section>
      <RegionLanes bracket={bracket} label="星轨 B 区" side="right" rounds={regionB} />
    </div>
  );
}
