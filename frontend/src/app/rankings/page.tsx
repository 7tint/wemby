"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Select,
  Skeleton,
  Spacer,
  Stack,
  Switch,
  Tooltip,
} from "@chakra-ui/react";
import {
  IconAbacus,
  IconAdjustmentsFilled,
  IconCaretDown,
  IconCaretRight,
  IconHighlight,
  IconInfoSquareRounded,
} from "@tabler/icons-react";
import { getPlayers } from "@/api/players";
import RankingsTable from "@/components/RankingsTable";
import { normalizeScores } from "@/data/stats";
import calculateMinMax from "@/data/minmax";
import calculateZScores from "@/data/zScore";
import { Player } from "@/types/playerTypes";
import { STAT_KEYS } from "@/types/statTypes";

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
  const [showSettings, setShowSettings] = useState(false);
  return (
    <Box my={8}>
      <Flex
        align="center"
        cursor="pointer"
        width="fit-content"
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
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          gap={{ base: 4, lg: 0 }}
          overflow="scroll"
          ml={6}
          my={3}
        >
          <Flex direction="column" gap={2}>
            <Flex align="center">
              <Switch
                colorScheme="purple"
                isChecked={showSmartScores}
                onChange={() => setShowSmartScores(!showSmartScores)}
              />
              <Icon ml={2} mr={1.5} as={IconAdjustmentsFilled} boxSize={5} />
              <Box fontWeight={600}>Smart Scores</Box>
              <Tooltip
                placement="top"
                label='Show "Smart Scores" - a fine-tuned combination of z-scores and min-max normalization that is used to rank players.'
              >
                <Icon mx={1} as={IconInfoSquareRounded} boxSize={4} />
              </Tooltip>
            </Flex>
            <Flex align="center">
              <Switch
                colorScheme="purple"
                isChecked={showHighlights}
                onChange={() => setShowHighlights(!showHighlights)}
              />
              <Icon ml={2} mr={1.5} as={IconHighlight} boxSize={5} />
              <Box fontWeight={600}>Highlight Stats</Box>
            </Flex>
          </Flex>
          <Flex gap={3} align="center">
            <Flex align="center">
              <Icon mr={1.5} as={IconAbacus} boxSize={5} />
              <Box fontWeight={600}>Punting</Box>
              <Tooltip
                placement="top"
                label="Select categories to punt. These categories will not be calculated in the rankings."
              >
                <Icon mx={1} as={IconInfoSquareRounded} boxSize={4} />
              </Tooltip>
            </Flex>
            <HStack spacing={0}>
              <HStack spacing={0}>
                {STAT_KEYS.map((key, i) => {
                  let label: string = key.toUpperCase();
                  if (key === "fg") label = "FG%";
                  if (key === "ft") label = "FT%";
                  if (key === "tpm") label = "3PM";
                  return (
                    <Button
                      key={label}
                      borderWidth={1}
                      borderRadius={i === 0 ? "md" : 0}
                      borderRightRadius={i === 8 ? "md" : 0}
                      borderLeftRadius={i === 0 ? "md" : 0}
                      borderLeftWidth={i === 0 ? 1 : 0}
                      colorScheme={punts.includes(key) ? "purple" : "gray"}
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
              </HStack>
            </HStack>
          </Flex>
        </Flex>
      </Collapse>
    </Box>
  );
};

const RankingsPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Settings states
  const [showSmartScores, setShowSmartScores] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [punts, setPunts] = useState<string[]>([]);

  useEffect(() => {
    const getPlayersData = async () => {
      const { players, projCategories, pastCategories } = await getPlayers();
      const zScoresProj = calculateZScores(players, projCategories, false);
      const minmaxScoresProj = calculateMinMax(players, projCategories, false);
      const zScoresPast = calculateZScores(players, pastCategories, true);
      const minmaxScoresPast = calculateMinMax(players, pastCategories, true);

      players.forEach((player) => {
        const projZScores = zScoresProj.get(player.id) || null;
        const projMinMax = minmaxScoresProj.get(player.id) || null;
        if (projZScores && projMinMax) {
          const projNScores = normalizeScores({
            fgImpact: 1 * projZScores.fgImpact + 8 * projMinMax.fgImpact,
            ftImpact: 1 * projZScores.ftImpact + 8 * projMinMax.ftImpact,
            tpm: 1 * projZScores.tpm + 8 * projMinMax.tpm,
            pts: 1 * projZScores.pts + 8 * projMinMax.pts,
            reb: 1 * projZScores.reb + 8 * projMinMax.reb,
            ast: 1 * projZScores.ast + 8 * projMinMax.ast,
            stl: 1 * projZScores.stl + 8 * projMinMax.stl,
            blk: 1 * projZScores.blk + 8 * projMinMax.blk,
            to: 0.25 * projZScores.to + 8 * projMinMax.to,
          });
          player.projectionNScores = projNScores;
        }
        const pastZScores = zScoresPast.get(player.id) || null;
        const pastMinMax = minmaxScoresPast.get(player.id) || null;
        if (pastZScores && pastMinMax) {
          const pastNScores = normalizeScores({
            fgImpact: 1 * pastZScores.fgImpact + 6 * pastMinMax.fgImpact,
            ftImpact: 1 * pastZScores.ftImpact + 6 * pastMinMax.ftImpact,
            tpm: 1 * pastZScores.tpm + 6 * pastMinMax.tpm,
            pts: 1 * pastZScores.pts + 6 * pastMinMax.pts,
            reb: 1 * pastZScores.reb + 6 * pastMinMax.reb,
            ast: 1 * pastZScores.ast + 6 * pastMinMax.ast,
            stl: 1 * pastZScores.stl + 6 * pastMinMax.stl,
            blk: 1 * pastZScores.blk + 6 * pastMinMax.blk,
            to: 0.25 * pastZScores.to + 6 * pastMinMax.to,
          });
          player.pastYearNScores = pastNScores;
        } else {
          player.pastYearNScores = null;
        }
      });
      setPlayers(players);
    };
    getPlayersData();
  }, []);

  useEffect(() => {
    if (players.length > 0) setIsLoaded(true);
  }, [players]);

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
        punts={punts}
        setPunts={setPunts}
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
              players={players}
              usePastYearStats={selectedYear === 2}
              setIsLoaded={setIsLoaded}
              showSmartScores={showSmartScores}
              showHighlights={showHighlights}
              punts={punts}
            />
          </Box>
        </Skeleton>
      </Stack>
    </Container>
  );
};

export default RankingsPage;
