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
} from "@chakra-ui/react";
import {
  IconAdjustmentsFilled,
  IconCaretDown,
  IconCaretRight,
  IconHighlight,
} from "@tabler/icons-react";
import { getPlayers } from "@/api/players";
import { Player } from "@/types/playerTypes";
import { getNStats } from "@/data/const";
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
      const players = await getPlayers();
      const zScoresProj = calculateZScores(players, false);
      const minmaxScoresProj = calculateMinMax(players, false);
      const zScoresPast = calculateZScores(players, true);
      const minmaxScoresPast = calculateMinMax(players, true);

      players.forEach((player) => {
        const projZScores = zScoresProj.get(player.id) || null;
        const projMinMax = minmaxScoresProj.get(player.id) || null;
        if (projZScores && projMinMax) {
          player.projectionNScores = {
            fg: 1 * projZScores.fg + 5 * projMinMax.fg,
            ft: 1 * projZScores.ft + 5 * projMinMax.ft,
            tpm: 1 * projZScores.tpm + 5 * projMinMax.tpm,
            pts: 1 * projZScores.pts + 5 * projMinMax.pts,
            reb: 1 * projZScores.reb + 5 * projMinMax.reb,
            ast: 1 * projZScores.ast + 5 * projMinMax.ast,
            stl: 1 * projZScores.stl + 5 * projMinMax.stl,
            blk: 1 * projZScores.blk + 5 * projMinMax.blk,
            to: 1 * projZScores.to + 5 * projMinMax.to,
            total: 1 * projZScores.total + 5 * projMinMax.total,
          };
        }

        const pastZScores = zScoresPast.get(player.id) || null;
        const pastMinMax = minmaxScoresPast.get(player.id) || null;
        if (pastZScores && pastMinMax) {
          player.pastYearNScores = {
            fg: 1 * pastZScores.fg + 5 * pastMinMax.fg,
            ft: 1 * pastZScores.ft + 5 * pastMinMax.ft,
            tpm: 1 * pastZScores.tpm + 5 * pastMinMax.tpm,
            pts: 1 * pastZScores.pts + 5 * pastMinMax.pts,
            reb: 1 * pastZScores.reb + 5 * pastMinMax.reb,
            ast: 1 * pastZScores.ast + 5 * pastMinMax.ast,
            stl: 1 * pastZScores.stl + 5 * pastMinMax.stl,
            blk: 1 * pastZScores.blk + 5 * pastMinMax.blk,
            to: 1 * pastZScores.to + 5 * pastMinMax.to,
            total: 1 * pastZScores.total + 5 * pastMinMax.total,
          };
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
