"use client";

import { useEffect, useState } from "react";
import {
  IconAbacus,
  IconAdjustmentsFilled,
  IconCaretDown,
  IconCaretRight,
  IconHighlight,
  IconInfoSquareRounded,
} from "@tabler/icons-react";
import { getPlayers } from "@/api/players";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import RankingsTable from "@/components/rankings/RankingsTable";
import { normalizeScores } from "@/data/stats";
import calculateMinMax from "@/data/minmax";
import calculateZScores from "@/data/zScore";
import { Player } from "@/types/playerTypes";
import { STAT_KEYS } from "@/types/statTypes";
import { Switch } from "@/components/ui/switch";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface RankingsSettingsProps {
  showSmartScores: boolean;
  setShowSmartScores: (value: boolean) => void;
  showHighlights: boolean;
  setShowHighlights: (value: boolean) => void;
  punts: string[];
  setPunts: (value: string[]) => void;
}

const RankingsSettings = ({
  showSmartScores,
  setShowSmartScores,
  showHighlights,
  setShowHighlights,
  punts,
  setPunts,
}: RankingsSettingsProps) => {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="my-8">
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>
          <div
            className="flex items-center cursor-pointer w-fit"
            onClick={() => {
              setShowSettings(!showSettings);
            }}
          >
            {showSettings ? (
              <IconCaretDown className="mr-1" size={18} />
            ) : (
              <IconCaretRight className="mr-1" size={18} />
            )}
            <h2 className="text-lg font-medium">Settings</h2>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-0 overflow-scroll ml-6 my-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Switch
                  checked={showSmartScores}
                  onChange={() => setShowSmartScores(!showSmartScores)}
                />
                <IconAdjustmentsFilled className="ml-3 mr-1" size={18} />
                <div className="font-medium">Smart Scores</div>
                <Tooltip label='Show "Smart Scores" - a fine-tuned combination of z-scores and min-max normalization that is used to rank players.'>
                  <IconInfoSquareRounded className="mx-1" size={14} />
                </Tooltip>
              </div>
              <div className="flex items-center">
                <Switch
                  checked={showHighlights}
                  onChange={() => setShowHighlights(!showHighlights)}
                />
                <IconHighlight className="ml-3 mr-1" size={18} />
                <div className="font-medium">Highlight Stats</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <IconAbacus className="mr-1" size={18} />
                <div className="font-medium">Punting</div>
                <Tooltip label="Select categories to punt. These categories will not be calculated in the rankings.">
                  <IconInfoSquareRounded className="mx-1" size={14} />
                </Tooltip>
                <div className="flex ml-3">
                  <div className="flex gap-0">
                    {STAT_KEYS.map((key, i) => {
                      let label: string = key.toUpperCase();
                      if (key === "fg") label = "FG%";
                      if (key === "ft") label = "FT%";
                      if (key === "tpm") label = "3PM";
                      return (
                        <Button
                          key={label}
                          variant={punts.includes(key) ? "violet" : "secondary"}
                          className={cn(
                            "border rounded-none border-l-0",
                            i === 0 ? "rounded-l-md " : "",
                            i === 8 ? "rounded-r-md " : "",
                            i === 0 ? "border-l " : ""
                          )}
                          color={punts.includes(key) ? "purple" : "slate"}
                          onClick={() => {
                            if (punts.includes(key)) {
                              setPunts(punts.filter((cat) => cat !== key));
                            } else {
                              setPunts([...punts, key]);
                            }
                          }}
                        >
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

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
    <div className="mx-auto my-12 px-4 md:px-8 lg:px-12">
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
      {isLoaded ? (
        <RankingsTable
          players={players}
          usePastYearStats={selectedYear === 2}
          showSmartScores={showSmartScores}
          showHighlights={showHighlights}
          punts={punts}
        />
      ) : (
        Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} className="h-10 mb-4" />
        ))
      )}
    </div>
  );
};

export default RankingsPage;
