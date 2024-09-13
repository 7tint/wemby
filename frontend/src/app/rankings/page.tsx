"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Box,
  Collapse,
  Container,
  Flex,
  Heading,
  Icon,
  Select,
  Skeleton,
  Spacer,
  Stack,
  Switch,
  Tooltip,
} from "@chakra-ui/react";
import {
  IconAdjustmentsFilled,
  IconCaretDown,
  IconCaretRight,
  IconHighlight,
  IconInfoSquareRounded,
} from "@tabler/icons-react";
import { getPlayers } from "@/api/players";
import { Player } from "@/types/playerTypes";
import { getNStats, normalizeScores } from "@/data/const";
import calculateMinMax from "@/data/minmax";
import calculateZScores from "@/data/zScore";
import RankingsTable from "@/components/RankingsTable";

interface RankingsSettingsProps {
  showSmartScores: boolean;
  setShowSmartScores: (value: boolean) => void;
  showHighlights: boolean;
  setShowHighlights: (value: boolean) => void;
}

const RankingsSettings = ({
  showSmartScores,
  setShowSmartScores,
  showHighlights,
  setShowHighlights,
}: RankingsSettingsProps) => {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <Box my={8}>
      <Flex
        align="center"
        cursor="pointer"
        onClick={() => {
          setShowSettings(!showSettings);
        }}
      >
        <Icon
          as={showSettings ? IconCaretDown : IconCaretRight}
          mr={1}
          boxSize={5}
        />
        <Heading size="md">Settings</Heading>
      </Flex>
      <Collapse in={showSettings}>
        <Flex direction="column" my={3} gap={2}>
          <Flex align="center" ml={6}>
            <Switch
              colorScheme="cyan"
              isChecked={showSmartScores}
              onChange={() => setShowSmartScores(!showSmartScores)}
            />
            <Icon mx={2} as={IconAdjustmentsFilled} boxSize={5} />
            <Box fontWeight={600}>Smart Scores</Box>
            <Tooltip label='Show "Smart Scores" - a fine-tuned combination of z-scores and min-max normalization that is used to rank players.'>
              <Icon mx={1} as={IconInfoSquareRounded} boxSize={4} />
            </Tooltip>
          </Flex>
          <Flex align="center" ml={6}>
            <Switch
              colorScheme="cyan"
              isChecked={showHighlights}
              onChange={() => setShowHighlights(!showHighlights)}
            />
            <Icon mx={2} as={IconHighlight} boxSize={5} />
            <Box fontWeight={600}>Highlight Stats</Box>
          </Flex>
        </Flex>
      </Collapse>
    </Box>
  );
};

const RankingsPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedYear, setSelectedYear] = useState(1);

  // Chakra component states
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSmartScores, setShowSmartScores] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);

  useEffect(() => {
    const getPlayersData = async () => {
      const { players, projCategories, pastCategories } = await getPlayers();
      const zScoresProj = calculateZScores(players, projCategories, false);
      const minmaxScoresProj = calculateMinMax(players, projCategories, false);
      const zScoresPast = calculateZScores(players, pastCategories, true);
      const minmaxScoresPast = calculateMinMax(players, pastCategories, true);

      // TODO: Let user choose weights
      players.forEach((player) => {
        const projZScores = zScoresProj.get(player.id) || null;
        const projMinMax = minmaxScoresProj.get(player.id) || null;
        if (projZScores && projMinMax) {
          player.projectionNScores = normalizeScores({
            fgImpact: 1 * projZScores.fgImpact + 8 * projMinMax.fgImpact,
            ftImpact: 1 * projZScores.ftImpact + 8 * projMinMax.ftImpact,
            tpm: 1 * projZScores.tpm + 8 * projMinMax.tpm,
            pts: 1 * projZScores.pts + 8 * projMinMax.pts,
            reb: 1 * projZScores.reb + 8 * projMinMax.reb,
            ast: 1 * projZScores.ast + 8 * projMinMax.ast,
            stl: 1 * projZScores.stl + 8 * projMinMax.stl,
            blk: 1 * projZScores.blk + 8 * projMinMax.blk,
            to: 0.25 * projZScores.to + 8 * projMinMax.to,
            total: 1 * projZScores.total + 8 * projMinMax.total,
          });
        }

        const pastZScores = zScoresPast.get(player.id) || null;
        const pastMinMax = minmaxScoresPast.get(player.id) || null;
        if (pastZScores && pastMinMax) {
          player.pastYearNScores = normalizeScores({
            fgImpact: 1 * pastZScores.fgImpact + 6 * pastMinMax.fgImpact,
            ftImpact: 1 * pastZScores.ftImpact + 6 * pastMinMax.ftImpact,
            tpm: 1 * pastZScores.tpm + 6 * pastMinMax.tpm,
            pts: 1 * pastZScores.pts + 6 * pastMinMax.pts,
            reb: 1 * pastZScores.reb + 6 * pastMinMax.reb,
            ast: 1 * pastZScores.ast + 6 * pastMinMax.ast,
            stl: 1 * pastZScores.stl + 6 * pastMinMax.stl,
            blk: 1 * pastZScores.blk + 6 * pastMinMax.blk,
            to: 0.25 * pastZScores.to + 6 * pastMinMax.to,
            total: 1 * pastZScores.total + 6 * pastMinMax.total,
          });
        } else {
          player.pastYearNScores = null;
        }
      });
      setPlayers(players);
    };
    getPlayersData();
  }, []);

  const playersToDisplay = useMemo(() => {
    const usePastYearStats = selectedYear !== 1;

    if (players.length > 0) {
      return players
        .filter((player) => {
          if (usePastYearStats && !player.pastYearStats) return false;
          if (!usePastYearStats && !player.projections) return false;
          return true;
        })
        .filter((player) => getNStats(player, usePastYearStats))
        .sort((a, b) => {
          const aTotal = getNStats(a, usePastYearStats)?.total || 0;
          const bTotal = getNStats(b, usePastYearStats)?.total || 0;
          return bTotal - aTotal;
        });
    }
    return [];
  }, [selectedYear, players]);

  useEffect(() => {
    if (playersToDisplay.length > 0) setIsLoaded(true);
  }, [playersToDisplay]);

  return (
    <Container maxW="container.2xl" px={12} my={12}>
      <Flex justify="space-between" my={8}>
        <Heading size="lg">Player Rankings</Heading>
        <Spacer />
        <Select
          width="auto"
          placeholder="Select year for rankings"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(parseInt(e.target.value));
            setIsLoaded(false);
          }}
        >
          <option value={1}>2024-2025 Projections</option>
          <option value={2}>2023-2024 Stats</option>
        </Select>
      </Flex>
      <RankingsSettings
        showSmartScores={showSmartScores}
        setShowSmartScores={setShowSmartScores}
        showHighlights={showHighlights}
        setShowHighlights={setShowHighlights}
      />
      <Stack spacing={4}>
        {Array.from({ length: 100 }).map((_, i) =>
          isLoaded ? (
            <Fragment key={i}></Fragment>
          ) : (
            <Skeleton
              key={i}
              height={12}
              startColor="gray.50"
              endColor="gray.200"
            />
          )
        )}
        <Skeleton isLoaded={isLoaded} startColor="gray.50" endColor="gray.100">
          <Box shadow="md">
            <RankingsTable
              players={playersToDisplay}
              usePastYearStats={selectedYear === 2}
              showSmartScores={showSmartScores}
              showHighlights={showHighlights}
            />
          </Box>
        </Skeleton>
      </Stack>
    </Container>
  );
};

export default RankingsPage;
