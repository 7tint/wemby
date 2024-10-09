"use client";

import { useEffect, useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { getPlayers } from "@/api/players";
import calculateMinMax from "@/data/minmax";
import calculateZScores from "@/data/zScore";
import { normalizeScores, totalCategories } from "@/data/stats";
import { Team } from "@/types/teamTypes";
import { Player } from "@/types/playerTypes";
import BaseLayout from "@/components/ui/base";
import { Skeleton } from "@/components/ui/skeleton";
import RankingsFilters from "@/components/rankings/RankingsFilters";
import RankingsSettings from "@/components/rankings/RankingsSettings";
import RankingsTable from "@/components/rankings/table/RankingsTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CustomTableState } from "@/components/rankings/table/customStates";

const RankingsPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectPlayerIds, setSelectPlayerIds] = useState<RowSelectionState>({});
  const [selectedYear, setSelectedYear] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Settings states
  const [customSettings, setCustomSettings] = useState<CustomTableState>({
    showSmartScores: false,
    showHighlights: true,
  });
  const [punts, setPunts] = useState<Set<string>>(new Set());

  // Filters states
  const [positions, setPositions] = useState<string[]>([]);
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    const getPlayersData = async () => {
      let year = "2024";
      if (selectedYear === 2) year = "2023";

      const { players, categoryStatsTotal, categoryStatsPer } =
        await getPlayers(year);
      const zScores = calculateZScores(players, categoryStatsTotal);
      const minmaxScores = calculateMinMax(players, categoryStatsPer);
      let totalNScore = 0;

      players.forEach((player) => {
        if (!player.stats) return;
        const zScore = zScores.get(player.id) || null;
        const minMax = minmaxScores.get(player.id) || null;
        if (zScore && minMax) {
          const nScores = normalizeScores({
            fgImpact: 1 * zScore.fgImpact + 8 * minMax.fgImpact,
            ftImpact: 1 * zScore.ftImpact + 8 * minMax.ftImpact,
            tpm: 1 * zScore.tpm + 8 * minMax.tpm,
            pts: 1 * zScore.pts + 8 * minMax.pts,
            reb: 1 * zScore.reb + 8 * minMax.reb,
            ast: 1 * zScore.ast + 8 * minMax.ast,
            stl: 1 * zScore.stl + 8 * minMax.stl,
            blk: 1 * zScore.blk + 8 * minMax.blk,
            to: 0.25 * zScore.to + 8 * minMax.to,
            total: 0,
          });
          const total = totalCategories(nScores, new Set());
          player.nScores = {
            ...nScores,
            total,
          };
          if (total > 0) totalNScore += total;
        }
      });

      const auctionRatio = (12 * 200) / totalNScore;
      players.forEach((player) => {
        const auctionValuedAt = player.nScores.total * auctionRatio;
        if (auctionValuedAt < 1) player.auctionValuedAt = 1;
        else player.auctionValuedAt = Math.round(auctionValuedAt * 10) / 10;
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
      <div className="pl-2 md:pl-1.5 lg:pl-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between my-8">
          <h1 className="text-2xl font-semibold pl-1 md:pl-0">
            Player Rankings
          </h1>
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
          showSmartScores={customSettings.showSmartScores}
          setShowSmartScores={(value) =>
            setCustomSettings({ ...customSettings, showSmartScores: value })
          }
          showHighlights={customSettings.showHighlights}
          setShowHighlights={(value) =>
            setCustomSettings({ ...customSettings, showHighlights: value })
          }
          punts={punts}
          setPunts={setPunts}
        />
        <RankingsFilters
          positions={positions}
          setPositions={setPositions}
          team={team}
          setTeam={setTeam}
        />
      </div>
      <Separator className="my-6" />
      {selectPlayerIds &&
        Object.keys(selectPlayerIds).length > 0 &&
        isLoaded && (
          <RankingsTable
            players={players.filter((player) => selectPlayerIds[player.id])}
            isCurrentSeason={selectedYear === 1}
            showSmartScores={customSettings.showSmartScores}
            setShowSmartScores={() =>
              setCustomSettings({
                ...customSettings,
                showSmartScores: !customSettings.showSmartScores,
              })
            }
            showHighlights={customSettings.showHighlights}
            setShowHighlights={() =>
              setCustomSettings({
                ...customSettings,
                showHighlights: !customSettings.showHighlights,
              })
            }
            punts={punts}
            positions={[]}
            team={null}
            selectPlayerIds={selectPlayerIds}
            setSelectPlayerIds={setSelectPlayerIds}
            totalsMode
          />
        )}
      {isLoaded ? (
        <div className="my-6">
          <RankingsTable
            players={players}
            isCurrentSeason={selectedYear === 1}
            showSmartScores={customSettings.showSmartScores}
            setShowSmartScores={() =>
              setCustomSettings({
                ...customSettings,
                showSmartScores: !customSettings.showSmartScores,
              })
            }
            showHighlights={customSettings.showHighlights}
            setShowHighlights={() =>
              setCustomSettings({
                ...customSettings,
                showHighlights: !customSettings.showHighlights,
              })
            }
            punts={punts}
            positions={positions}
            team={team}
            selectPlayerIds={selectPlayerIds}
            setSelectPlayerIds={setSelectPlayerIds}
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
