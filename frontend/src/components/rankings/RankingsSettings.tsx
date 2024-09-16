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
import { STAT_KEYS } from "@/types/statTypes";
import { Switch } from "@/components/ui/switch";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
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
  const [showSettings, setShowSettings] = useState(true);
  return (
    <div className="my-4">
      <Collapsible defaultOpen={true} open={showSettings}>
        <CollapsibleTrigger>
          <div
            className="flex items-center cursor-pointer w-fit mb-4"
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
          <div className="flex flex-col-reverse lg:flex-row justify-between gap-6 lg:gap-0 overflow-scroll ml-6">
            <div className="flex flex-col gap-4 lg:gap-3 w-52">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <IconAdjustmentsFilled className="mr-1" size={18} />
                  <div className="font-medium">Smart Scores</div>
                  <Tooltip label='Show "Smart Scores" - a weighted product of z-scores and min-max normalization (influenced by user selected punts and total games played).'>
                    <IconInfoSquareRounded className="mx-1" size={14} />
                  </Tooltip>
                </div>
                <Switch
                  className="ml-2"
                  checked={showSmartScores}
                  onCheckedChange={() => setShowSmartScores(!showSmartScores)}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <IconHighlight className="mr-1" size={18} />
                  <div className="font-medium">Highlight Stats</div>
                </div>
                <Switch
                  className="ml-2"
                  checked={showHighlights}
                  onCheckedChange={() => setShowHighlights(!showHighlights)}
                />
              </div>
            </div>
            <div className="flex lg:flex-col gap-3">
              <div className="flex items-center">
                <IconAbacus className="mr-1" size={18} />
                <div className="font-medium">Punting</div>
                <Tooltip label="Select categories to punt. These categories will not be calculated in the rankings.">
                  <IconInfoSquareRounded className="mx-1" size={14} />
                </Tooltip>
              </div>
              <div className="flex">
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
                        size="sm"
                        className={cn(
                          "text-sm border rounded-none border-l-0",
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RankingsSettings;
