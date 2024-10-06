import { TableFooter, TableRow } from "@/components/ui/table";
import {
  cellWidthLg,
  cellWidthMd,
  cellWidthSm,
  cellWidthXl,
  TableTd,
} from "./RankingsTableUtils";
import { Player } from "@/types/playerTypes";

interface RankingsTableFooterProps {
  selectedPlayers: Player[];
  showSmartScores: boolean;
  showDraftColumns: boolean;
}

const RankingsTableFooter = ({
  selectedPlayers,
  showSmartScores,
  showDraftColumns,
}: RankingsTableFooterProps) => {
  return (
    <TableFooter style={{ scrollbarWidth: "none" }}>
      <TableRow className="h-10 hover:bg-slate-50">
        <TableTd width={cellWidthSm} />
        <TableTd width={cellWidthSm} />
        <TableTd className="w-56 min-w-56">Averages</TableTd>
        <TableTd width={cellWidthMd} />
        {showDraftColumns && (
          <TableTd width={cellWidthMd}>
            $
            {(
              selectedPlayers.reduce(
                (acc, player) => acc + player.auctionValuedAt,
                0
              ) / selectedPlayers.length
            ).toFixed(1)}
          </TableTd>
        )}
        <TableTd width={cellWidthLg} />
        <TableTd width={cellWidthSm}>
          {(
            selectedPlayers.reduce((acc, player) => acc + player.stats.gp, 0) /
            selectedPlayers.length
          ).toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(
            selectedPlayers.reduce((acc, player) => acc + player.stats.mpg, 0) /
            selectedPlayers.length
          ).toFixed(1)}
        </TableTd>
        <TableTd width={showSmartScores ? cellWidthMd : cellWidthXl}>
          {showSmartScores ? (
            <div>
              {(
                selectedPlayers.reduce(
                  (acc, player) => acc + player.nScores.fgImpact,
                  0
                ) / selectedPlayers.length
              ).toFixed(2)}
            </div>
          ) : (
            <div>
              {(
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.fgm,
                  0
                ) /
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.fga,
                  0
                )
              ).toFixed(2)}
              <span className="text-2xs ml-1">
                (
                {selectedPlayers
                  .reduce((acc, player) => acc + player.stats.fgm, 0)
                  .toFixed(1)}{" "}
                /{" "}
                {selectedPlayers
                  .reduce((acc, player) => acc + player.stats.fga, 0)
                  .toFixed(1)}
                )
              </span>
            </div>
          )}
        </TableTd>
        <TableTd width={showSmartScores ? cellWidthMd : cellWidthXl}>
          {showSmartScores ? (
            <div>
              {(
                selectedPlayers.reduce(
                  (acc, player) => acc + player.nScores.ftImpact,
                  0
                ) / selectedPlayers.length
              ).toFixed(2)}
            </div>
          ) : (
            <div>
              {(
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.ftm,
                  0
                ) /
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.fta,
                  0
                )
              ).toFixed(2)}
              <span className="text-2xs ml-1">
                (
                {selectedPlayers
                  .reduce((acc, player) => acc + player.stats.ftm, 0)
                  .toFixed(1)}{" "}
                /{" "}
                {selectedPlayers
                  .reduce((acc, player) => acc + player.stats.fta, 0)
                  .toFixed(1)}
                )
              </span>
            </div>
          )}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.nScores.tpm,
                  0
                ) / selectedPlayers.length
              ).toFixed(2)
            : (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.tpm,
                  0
                ) / selectedPlayers.length
              ).toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.nScores.pts,
                  0
                ) / selectedPlayers.length
              ).toFixed(2)
            : (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.pts,
                  0
                ) / selectedPlayers.length
              ).toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.nScores.reb,
                  0
                ) / selectedPlayers.length
              ).toFixed(2)
            : (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.reb,
                  0
                ) / selectedPlayers.length
              ).toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.nScores.ast,
                  0
                ) / selectedPlayers.length
              ).toFixed(2)
            : (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.ast,
                  0
                ) / selectedPlayers.length
              ).toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.nScores.stl,
                  0
                ) / selectedPlayers.length
              ).toFixed(2)
            : (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.stl,
                  0
                ) / selectedPlayers.length
              ).toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.nScores.blk,
                  0
                ) / selectedPlayers.length
              ).toFixed(2)
            : (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.blk,
                  0
                ) / selectedPlayers.length
              ).toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.nScores.to,
                  0
                ) / selectedPlayers.length
              ).toFixed(2)
            : (
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.to,
                  0
                ) / selectedPlayers.length
              ).toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(
            selectedPlayers.reduce(
              (acc, player) => acc + player.nScores.total,
              0
            ) / selectedPlayers.length
          ).toFixed(2)}
        </TableTd>
      </TableRow>
      <TableRow className="h-10 hover:bg-slate-50">
        <TableTd width={cellWidthSm} />
        <TableTd width={cellWidthSm} />
        <TableTd className="w-56 min-w-56">Totals</TableTd>
        <TableTd width={cellWidthMd} />
        {showDraftColumns && (
          <TableTd width={cellWidthMd}>
            $
            {selectedPlayers
              .reduce((acc, player) => acc + player.auctionValuedAt, 0)
              .toFixed(1)}
          </TableTd>
        )}
        <TableTd width={cellWidthLg} />
        <TableTd width={cellWidthSm}>
          {selectedPlayers.reduce((acc, player) => acc + player.stats.gp, 0)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {(
            selectedPlayers.reduce((acc, player) => acc + player.stats.mpg, 0) /
            selectedPlayers.length
          ).toFixed(1)}
        </TableTd>
        <TableTd width={showSmartScores ? cellWidthMd : cellWidthXl}>
          {showSmartScores ? (
            <div>
              {selectedPlayers
                .reduce((acc, player) => acc + player.nScores.fgImpact, 0)
                .toFixed(2)}
            </div>
          ) : (
            <div>
              {(
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.fgm,
                  0
                ) /
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.fga,
                  0
                )
              ).toFixed(2)}
              <span className="text-2xs ml-1">
                (
                {selectedPlayers
                  .reduce((acc, player) => acc + player.stats.fgm, 0)
                  .toFixed(1)}{" "}
                /{" "}
                {selectedPlayers
                  .reduce((acc, player) => acc + player.stats.fga, 0)
                  .toFixed(1)}
                )
              </span>
            </div>
          )}
        </TableTd>
        <TableTd width={showSmartScores ? cellWidthMd : cellWidthXl}>
          {showSmartScores ? (
            <div>
              {selectedPlayers
                .reduce((acc, player) => acc + player.nScores.ftImpact, 0)
                .toFixed(2)}
            </div>
          ) : (
            <div>
              {(
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.ftm,
                  0
                ) /
                selectedPlayers.reduce(
                  (acc, player) => acc + player.stats.fta,
                  0
                )
              ).toFixed(2)}
              <span className="text-2xs ml-1">
                (
                {selectedPlayers
                  .reduce((acc, player) => acc + player.stats.ftm, 0)
                  .toFixed(1)}{" "}
                /{" "}
                {selectedPlayers
                  .reduce((acc, player) => acc + player.stats.fta, 0)
                  .toFixed(1)}
                )
              </span>
            </div>
          )}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? selectedPlayers
                .reduce((acc, player) => acc + player.nScores.tpm, 0)
                .toFixed(2)
            : selectedPlayers
                .reduce((acc, player) => acc + player.stats.tpm, 0)
                .toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? selectedPlayers
                .reduce((acc, player) => acc + player.nScores.pts, 0)
                .toFixed(2)
            : selectedPlayers
                .reduce((acc, player) => acc + player.stats.pts, 0)
                .toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? selectedPlayers
                .reduce((acc, player) => acc + player.nScores.reb, 0)
                .toFixed(2)
            : selectedPlayers
                .reduce((acc, player) => acc + player.stats.reb, 0)
                .toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? selectedPlayers
                .reduce((acc, player) => acc + player.nScores.ast, 0)
                .toFixed(2)
            : selectedPlayers
                .reduce((acc, player) => acc + player.stats.ast, 0)
                .toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? selectedPlayers
                .reduce((acc, player) => acc + player.nScores.stl, 0)
                .toFixed(2)
            : selectedPlayers
                .reduce((acc, player) => acc + player.stats.stl, 0)
                .toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? selectedPlayers
                .reduce((acc, player) => acc + player.nScores.blk, 0)
                .toFixed(2)
            : selectedPlayers
                .reduce((acc, player) => acc + player.stats.blk, 0)
                .toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {showSmartScores
            ? selectedPlayers
                .reduce((acc, player) => acc + player.nScores.to, 0)
                .toFixed(2)
            : selectedPlayers
                .reduce((acc, player) => acc + player.stats.to, 0)
                .toFixed(1)}
        </TableTd>
        <TableTd width={cellWidthMd}>
          {selectedPlayers
            .reduce((acc, player) => acc + player.nScores.total, 0)
            .toFixed(2)}
        </TableTd>
      </TableRow>
    </TableFooter>
  );
};

export default RankingsTableFooter;
