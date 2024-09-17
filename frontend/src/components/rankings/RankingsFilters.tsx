import { useState } from "react";
import {
  IconBallBasketball,
  IconCaretDown,
  IconCaretRight,
} from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PLAYER_POSITIONS } from "@/types/playerTypes";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface RankingsSettingsProps {
  positions: string[];
  setPositions: (value: string[]) => void;
}

const RankingsFilters = ({
  positions,
  setPositions,
}: RankingsSettingsProps) => {
  const [showFilters, setShowFilters] = useState(true);
  return (
    <div className="my-6">
      <Collapsible defaultOpen={true} open={showFilters}>
        <CollapsibleTrigger>
          <div
            className="flex items-center cursor-pointer w-fit mb-4"
            onClick={() => {
              setShowFilters(!showFilters);
            }}
          >
            {showFilters ? (
              <IconCaretDown className="mr-1" size={18} />
            ) : (
              <IconCaretRight className="mr-1" size={18} />
            )}
            <h2 className="text-lg font-medium">Filters</h2>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-12 overflow-scroll ml-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <IconBallBasketball className="mr-1" size={18} />
                <div className="font-medium">Position</div>
              </div>
              <div className="flex">
                <div className="flex gap-0">
                  {PLAYER_POSITIONS.map((key, i) => {
                    return (
                      <Button
                        key={key}
                        variant={
                          positions.includes(key) ? "violet" : "secondary"
                        }
                        size="sm"
                        className={cn(
                          "text-sm border rounded-none border-l-0 w-14",
                          i === 0 ? "rounded-l-md " : "",
                          i === PLAYER_POSITIONS.length - 1
                            ? "rounded-r-md "
                            : "",
                          i === 0 ? "border-l " : ""
                        )}
                        color={positions.includes(key) ? "purple" : "slate"}
                        onClick={() => {
                          if (positions.includes(key)) {
                            setPositions(
                              positions.filter((pos) => pos !== key)
                            );
                          } else {
                            setPositions([...positions, key]);
                          }
                        }}
                      >
                        {key}
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

export default RankingsFilters;
