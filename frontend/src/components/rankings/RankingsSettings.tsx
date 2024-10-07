import { useState } from "react";
import {
  IconAbacus,
  IconAdjustmentsFilled,
  IconCaretDown,
  IconCaretRight,
  IconHighlight,
  IconInfoSquareRounded,
} from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STAT_KEYS } from "@/utils/consts";

interface RankingsSettingsProps {
  showSmartScores: boolean;
  setShowSmartScores: (value: boolean) => void;
  showHighlights: boolean;
  setShowHighlights: (value: boolean) => void;
  punts: Set<string>;
  setPunts: (value: Set<string>) => void;
}

const RankingsSettings = ({
  showSmartScores,
  setShowSmartScores,
  showHighlights,
  setShowHighlights,
  punts,
  setPunts,
}: RankingsSettingsProps) => {
  const [showSettings, setShowSettings] = useState(true);
  return (
    <div className="my-4">
      <Collapsible defaultOpen={true} open={showSettings}>
        <CollapsibleTrigger>
          <div
            className="flex items-center cursor-pointer w-fit mb-2"
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
          <div className="flex flex-col xl:flex-row gap-3 xl:gap-12 ml-6 overflow-scroll hide-scrollbar">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <IconAbacus className="mr-1" size={18} />
                <div className="font-medium">Punting</div>
                <Tooltip label="Select categories to punt. These categories will not be calculated in the rankings.">
                  <IconInfoSquareRounded className="mx-1" size={14} />
                </Tooltip>
              </div>
              <div className="flex gap-0">
                {STAT_KEYS.map((key, i) => {
                  let label: string = key.toUpperCase();
                  if (key === "fg") label = "FG%";
                  if (key === "ft") label = "FT%";
                  if (key === "tpm") label = "3PM";
                  return (
                    <Button
                      key={label}
                      variant={punts.has(key) ? "violet" : "secondary"}
                      size="sm"
                      className={cn(
                        "text-sm border rounded-none border-l-0 w-14",
                        i === 0 ? "rounded-l-md " : "",
                        i === STAT_KEYS.length - 1 ? "rounded-r-md " : "",
                        i === 0 ? "border-l " : ""
                      )}
                      color={punts.has(key) ? "purple" : "slate"}
                      onClick={() => {
                        if (punts.has(key)) punts.delete(key);
                        else punts.add(key);
                        setPunts(new Set(punts));
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-10">
              <div className="flex items-center">
                <IconAdjustmentsFilled className="mr-1" size={18} />
                <div className="font-medium">Smart Scores</div>
                <Tooltip label='Show "Smart Scores" - a weighted product of z-scores and min-max normalization (influenced by user selected punts and total games played).'>
                  <IconInfoSquareRounded className="mx-1" size={14} />
                </Tooltip>
                <Switch
                  className="ml-2"
                  checked={showSmartScores}
                  onCheckedChange={() => setShowSmartScores(!showSmartScores)}
                />
              </div>
              <div className="flex items-center">
                <IconHighlight className="mr-1" size={18} />
                <div className="font-medium">Highlight Stats</div>
                <Switch
                  className="ml-2"
                  checked={showHighlights}
                  onCheckedChange={() => setShowHighlights(!showHighlights)}
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RankingsSettings;
