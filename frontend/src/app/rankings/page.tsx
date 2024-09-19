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
import BaseLayout from "@/components/ui/base";
import { Team } from "@/types/teamTypes";

const RankingsPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Settings states
  const [showSmartScores, setShowSmartScores] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [punts, setPunts] = useState<string[]>([]);

  // Filters states
  const [positions, setPositions] = useState<string[]>([]);
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    const getPlayersData = async () => {
      let year = "2024";
      if (selectedYear === 2) year = "2023";

      const { players, categoryStatsTotal, categoryStatsPer } =
        await getPlayers(year);
      const zScoresProj = calculateZScores(players, categoryStatsTotal);
      const minmaxScoresProj = calculateMinMax(players, categoryStatsPer);

      players.forEach((player) => {
        if (!player.stats) return;
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
          player.nScores = projNScores;
        }
      });
      setPlayers(players);
    };
    getPlayersData();
  }, [selectedYear]);

  useEffect(() => {
    if (players.length > 0) setIsLoaded(true);
  }, [players]);

  return (
    <BaseLayout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between my-8">
        <h1 className="text-2xl font-semibold pl-1 md:pl-0">Player Rankings</h1>
        <div className="w-auto mt-4 md:mt-0">
          <Select
            defaultValue={selectedYear.toString()}
            onValueChange={(value) => {
              setIsLoaded(false);
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
      <RankingsFilters
        positions={positions}
        setPositions={setPositions}
        team={team}
        setTeam={setTeam}
      />
      {isLoaded ? (
        <div className="mt-6">
          <RankingsTable
            players={players}
            showDraftColumns={selectedYear === 1}
            showSmartScores={showSmartScores}
            showHighlights={showHighlights}
            punts={punts}
            positions={positions}
            team={team}
          />
        </div>
      ) : (
        Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} className="h-10 mb-4" />
        ))
      )}
    </BaseLayout>
  );
};

export default RankingsPage;
