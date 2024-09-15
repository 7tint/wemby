"use client";

import { useEffect, useState } from "react";
import { getPlayers } from "@/api/players";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import RankingsSettings from "@/components/rankings/RankingsSettings";
import RankingsTable from "@/components/rankings/table/RankingsTable";
import { normalizeScores } from "@/data/stats";
import calculateMinMax from "@/data/minmax";
import calculateZScores from "@/data/zScore";
import { Player } from "@/types/playerTypes";
import RankingsFilters from "@/components/rankings/RankingsFilters";

const RankingsPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Settings states
  const [showSmartScores, setShowSmartScores] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [punts, setPunts] = useState<string[]>([]);

  useEffect(() => {
    const getPlayersData = async () => {
      const { players, projCategories, pastCategories } = await getPlayers();
      const zScoresProj = calculateZScores(players, projCategories, false);
      const minmaxScoresProj = calculateMinMax(players, projCategories, false);
      const zScoresPast = calculateZScores(players, pastCategories, true);
      const minmaxScoresPast = calculateMinMax(players, pastCategories, true);

      players.forEach((player) => {
        const projZScores = zScoresProj.get(player.id) || null;
        const projMinMax = minmaxScoresProj.get(player.id) || null;
        if (projZScores && projMinMax) {
          const projNScores = normalizeScores({
            fgImpact: 1 * projZScores.fgImpact + 8 * projMinMax.fgImpact,
            ftImpact: 1 * projZScores.ftImpact + 8 * projMinMax.ftImpact,
            tpm: 1 * projZScores.tpm + 8 * projMinMax.tpm,
            pts: 1 * projZScores.pts + 8 * projMinMax.pts,
            reb: 1 * projZScores.reb + 8 * projMinMax.reb,
            ast: 1 * projZScores.ast + 8 * projMinMax.ast,
            stl: 1 * projZScores.stl + 8 * projMinMax.stl,
            blk: 1 * projZScores.blk + 8 * projMinMax.blk,
            to: 0.25 * projZScores.to + 8 * projMinMax.to,
          });
          player.projectionNScores = projNScores;
        }
        const pastZScores = zScoresPast.get(player.id) || null;
        const pastMinMax = minmaxScoresPast.get(player.id) || null;
        if (pastZScores && pastMinMax) {
          const pastNScores = normalizeScores({
            fgImpact: 1 * pastZScores.fgImpact + 6 * pastMinMax.fgImpact,
            ftImpact: 1 * pastZScores.ftImpact + 6 * pastMinMax.ftImpact,
            tpm: 1 * pastZScores.tpm + 6 * pastMinMax.tpm,
            pts: 1 * pastZScores.pts + 6 * pastMinMax.pts,
            reb: 1 * pastZScores.reb + 6 * pastMinMax.reb,
            ast: 1 * pastZScores.ast + 6 * pastMinMax.ast,
            stl: 1 * pastZScores.stl + 6 * pastMinMax.stl,
            blk: 1 * pastZScores.blk + 6 * pastMinMax.blk,
            to: 0.25 * pastZScores.to + 6 * pastMinMax.to,
          });
          player.pastYearNScores = pastNScores;
        } else {
          player.pastYearNScores = null;
        }
      });
      setPlayers(players);
    };
    getPlayersData();
  }, []);

  useEffect(() => {
    if (players.length > 0) setIsLoaded(true);
  }, [players]);

  return (
    <div className="mx-auto mt-16 mb-12 px-4 md:px-8 lg:px-12">
      <div className="flex justify-between my-8">
        <h1 className="text-2xl font-semibold">Player Rankings</h1>
        <div className="w-auto">
          <Select
            defaultValue={selectedYear.toString()}
            onValueChange={(value) => {
              setSelectedYear(parseInt(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year for rankings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="1">
                2024-2025 Projections
              </SelectItem>
              <SelectItem className="cursor-pointer" value="2">
                2023-2024 Stats
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <RankingsSettings
        showSmartScores={showSmartScores}
        setShowSmartScores={setShowSmartScores}
        showHighlights={showHighlights}
        setShowHighlights={setShowHighlights}
        punts={punts}
        setPunts={setPunts}
      />
      <RankingsFilters />
      {isLoaded ? (
        <div className="mt-8">
          <RankingsTable
            players={players}
            usePastYearStats={selectedYear === 2}
            showSmartScores={showSmartScores}
            showHighlights={showHighlights}
            punts={punts}
          />
        </div>
      ) : (
        Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} className="h-10 mb-4" />
        ))
      )}
    </div>
  );
};

export default RankingsPage;
