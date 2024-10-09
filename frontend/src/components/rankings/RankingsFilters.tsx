import { IconBallBasketball, IconShirtSport } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Team, TEAM_ABBREVS } from "@/types/teamTypes";
import {
  PLAYER_POSITIONS,
  getTeamAbbreviation,
  getTeamName,
} from "@/utils/consts";

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
  return (
    <div className="my-6 text-slate-700">
      <h2 className="text-lg text-foreground font-medium mb-3">Filters</h2>
      <div className="flex flex-col 2xl:flex-row gap-3 2xl:gap-12 overflow-scroll hide-scrollbar">
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
                    i === PLAYER_POSITIONS.length - 1 ? "rounded-r-md " : "",
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
                {TEAM_ABBREVS.filter((team) => team !== "NBA").map((team) => (
                  <SelectItem
                    key={team}
                    className="cursor-pointer"
                    value={getTeamName(team)}
                  >
                    {getTeamName(team)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingsFilters;
