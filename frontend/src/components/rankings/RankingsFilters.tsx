import { useState } from "react";
import {
  IconBallBasketball,
  IconCaretDown,
  IconCaretRight,
  IconShirtSport,
} from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  getTeamAbbreviation,
  getTeamName,
  Team,
  TEAM_ABBREVS,
} from "@/types/teamTypes";
import { PLAYER_POSITIONS } from "@/types/playerTypes";

interface RankingsSettingsProps {
  positions: string[];
  setPositions: (value: string[]) => void;
  team: Team | null;
  setTeam: (value: Team | null) => void;
}

const RankingsFilters = ({
  positions,
  setPositions,
  team,
  setTeam,
}: RankingsSettingsProps) => {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="my-4">
      <Collapsible defaultOpen={true} open={showFilters}>
        <CollapsibleTrigger>
          <div
            className="flex items-center cursor-pointer w-fit mb-3"
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
          <div className="flex flex-col xl:flex-row gap-3 xl:gap-12 overflow-scroll ml-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <IconBallBasketball className="mr-1" size={18} />
                <div className="font-medium">Position</div>
              </div>
              <div className="flex gap-0">
                {PLAYER_POSITIONS.map((key, i) => {
                  return (
                    <Button
                      key={key}
                      variant={positions.includes(key) ? "violet" : "secondary"}
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
                          setPositions(positions.filter((pos) => pos !== key));
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
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <IconShirtSport className="mr-1" size={18} />
                <div className="font-medium">Pro Team</div>
              </div>
              <div className="w-auto">
                <Select
                  defaultValue={team ? getTeamName(team) : "All Teams"}
                  onValueChange={(value) => {
                    const team = value as string;
                    setTeam(
                      team === "All Teams" ? null : getTeamAbbreviation(team)
                    );
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="All Teams">
                      All Teams
                    </SelectItem>
                    {TEAM_ABBREVS.filter((team) => team !== "NBA").map(
                      (team) => (
                        <SelectItem
                          key={team}
                          className="cursor-pointer"
                          value={getTeamName(team)}
                        >
                          {getTeamName(team)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RankingsFilters;
