import { useState } from "react";
import { IconCaretDown, IconCaretRight } from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RankingsSettingsProps {}

const RankingsFilters = ({}: RankingsSettingsProps) => {
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
          <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-0 overflow-scroll ml-6"></div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RankingsFilters;
