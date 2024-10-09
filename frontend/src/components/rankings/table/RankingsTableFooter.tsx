import { TableFooter, TableRow } from "@/components/ui/table";
import {
  cellWidthLg,
  cellWidthMd,
  cellWidthSm,
  cellWidthXl,
  TableTd,
} from "./RankingsTableUtils";
import { Player } from "@/types/playerTypes";
import { useMemo } from "react";

interface RankingsTableFooterProps {
  selectedPlayers: Set<Player>;
  showSmartScores: boolean;
  showDraftColumns: boolean;
}

const RankingsTableFooter = ({
  selectedPlayers,
  showSmartScores,
  showDraftColumns,
}: RankingsTableFooterProps) => {
  const stats = useMemo(() => {
    const stats = {
      auctionValuedAt: 0,
      gp: 0,
      mpg: 0,
      fgm: 0,
      fga: 0,
      ftm: 0,
      fta: 0,
      tpm: 0,
      pts: 0,
      reb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      to: 0,
      total: 0,
      fgImpact: 0,
      ftImpact: 0,
    };

    selectedPlayers.forEach((player) => {
      stats.auctionValuedAt += player.auctionValuedAt;
      stats.gp += player.stats.gp;
      stats.mpg += player.stats.mpg;
      stats.fgm += player.stats.fgm;
      stats.fga += player.stats.fga;
      stats.ftm += player.stats.ftm;
      stats.fta += player.stats.fta;
      stats.tpm += player.stats.tpm;
      stats.pts += player.stats.pts;
      stats.reb += player.stats.reb;
      stats.ast += player.stats.ast;
      stats.stl += player.stats.stl;
      stats.blk += player.stats.blk;
      stats.to += player.stats.to;
      stats.total += player.nScores.total;
      stats.fgImpact += player.nScores.fgImpact;
      stats.ftImpact += player.nScores.ftImpact;
    });

    return stats;
  }, [selectedPlayers]);

  const playerCount = selectedPlayers.size;

  return (
    <TableFooter style={{ scrollbarWidth: "none" }}>
      <TableRow className="h-10 hover:bg-slate-50">
        <TableTd width={cellWidthSm} />
        <TableTd width={cellWidthSm} />
        <TableTd className="w-52 min-w-52">Averages</TableTd>
        {showDraftColumns && (
          <TableTd width={cellWidthMd}>
            ${(stats.auctionValuedAt / playerCount).toFixed(1)}
          </TableTd>
        )}
        <TableTd width={cellWidthLg} />
        <TableTd width={cellWidthSm}>
          {(stats.gp / playerCount).toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.mpg / playerCount).toFixed(1)}
        </TableTd>
        <TableTd width={showSmartScores ? cellWidthMd : cellWidthXl}>
          {showSmartScores ? (
            <div>{(stats.fgImpact / playerCount).toFixed(2)}</div>
          ) : (
            <div>
              {(stats.fgm / stats.fga).toFixed(2)}
              <span className="text-2xs ml-1">
                ({stats.fgm.toFixed(1)} / {stats.fga.toFixed(1)})
              </span>
            </div>
          )}
        </TableTd>
        <TableTd width={showSmartScores ? cellWidthMd : cellWidthXl}>
          {showSmartScores ? (
            <div>{(stats.ftImpact / playerCount).toFixed(2)}</div>
          ) : (
            <div>
              {(stats.ftm / stats.fta).toFixed(2)}
              <span className="text-2xs ml-1">
                ({stats.ftm.toFixed(1)} / {stats.fta.toFixed(1)})
              </span>
            </div>
          )}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.tpm / playerCount).toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.pts / playerCount).toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.reb / playerCount).toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.ast / playerCount).toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.stl / playerCount).toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.blk / playerCount).toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.to / playerCount).toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.total / playerCount).toFixed(2)}
        </TableTd>
        <TableTd width={cellWidthLg} />
      </TableRow>
      <TableRow className="h-10 hover:bg-slate-50">
        <TableTd width={cellWidthSm} />
        <TableTd width={cellWidthSm} />
        <TableTd className="w-52 min-w-52">Totals</TableTd>
        {showDraftColumns && (
          <TableTd width={cellWidthMd}>
            ${stats.auctionValuedAt.toFixed(1)}
          </TableTd>
        )}
        <TableTd width={cellWidthLg} />
        <TableTd width={cellWidthSm}>{stats.gp}</TableTd>
        <TableTd width={cellWidthMd}>
          {(stats.mpg / playerCount).toFixed(1)}
        </TableTd>
        <TableTd width={showSmartScores ? cellWidthMd : cellWidthXl}>
          {showSmartScores ? (
            <div>{stats.fgImpact.toFixed(2)}</div>
          ) : (
            <div>
              {(stats.fgm / stats.fga).toFixed(2)}
              <span className="text-2xs ml-1">
                ({stats.fgm.toFixed(1)} / {stats.fga.toFixed(1)})
              </span>
            </div>
          )}
        </TableTd>
        <TableTd width={showSmartScores ? cellWidthMd : cellWidthXl}>
          {showSmartScores ? (
            <div>{stats.ftImpact.toFixed(2)}</div>
          ) : (
            <div>
              {(stats.ftm / stats.fta).toFixed(2)}
              <span className="text-2xs ml-1">
                ({stats.ftm.toFixed(1)} / {stats.fta.toFixed(1)})
              </span>
            </div>
          )}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {stats.tpm.toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {stats.pts.toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {stats.reb.toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {stats.ast.toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {stats.stl.toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {stats.blk.toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {stats.to.toFixed(showSmartScores ? 2 : 1)}
        </TableTd>
        <TableTd width={cellWidthMd}>{stats.total.toFixed(2)}</TableTd>
        <TableTd width={cellWidthLg} />
      </TableRow>
    </TableFooter>
  );
};

export default RankingsTableFooter;
