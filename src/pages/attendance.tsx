import {
  Alert,
  AlertIcon,
  Box,
  Skeleton as ChakraSkeleton,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  SkeletonProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { LuArrowRight } from "react-icons/lu";
import { CommonIconButton } from "@/components/common/common-icon-button";
import { OptionItemGroup } from "@/components/common/option-item";
import { Section } from "@/components/common/section";
import { SwitchButton } from "@/components/common/switch-button";
import PlayersView from "@/components/players-view";
import { useGlobalData } from "@/contexts/global-data";
import { useSharedModals } from "@/contexts/shared-modal";
import { PlayerType } from "@/enums/account";
import { AccountServiceError } from "@/enums/service-error";
import { Player } from "@/models/account";
import { AttendanceData } from "@/models/attendance";
import { AccountService } from "@/services/account";
import { generatePlayerDesc } from "@/utils/account";
import { base64ImgSrc } from "@/utils/string";

const StatusBanner = ({
  status,
}: {
  status: AttendanceData["data"]["time"]["status"];
}) => {
  const getStatus = (iconName: string) => {
    switch (iconName) {
      case "check":
      case "check-circle":
        return "success";
      case "info":
      case "info-circle":
        return "info";
      case "exclamation":
      case "exclamation-circle":
        return "warning";
      default:
        return "info";
    }
  };
  if (!status) return null;
  return (
    <Alert status={getStatus(status.icon)} fontSize="xs-sm" borderRadius="md">
      <AlertIcon />
      {status.message}
    </Alert>
  );
};

const Skeleton = (props: SkeletonProps) => (
  <ChakraSkeleton height="13px" marginY="3px" {...props} />
);

const AttendancePage = () => {
  const { t, i18n } = useTranslation();
  const { selectedPlayer, getPlayerList } = useGlobalData();
  const { openSharedModal } = useSharedModals();
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [playerList, setPlayerList] = useState<Player[]>([]);
  useEffect(() => {
    setPlayerList(getPlayerList() || []);
  }, [getPlayerList]);

  const refreshData = () => {
    setLoading(true);
    if (
      selectedPlayer &&
      selectedPlayer.playerType === PlayerType.ThirdParty &&
      !selectedPlayer.authServer?.features?.clubAttendanceUrl
    ) {
      handleRefreshPlayer();
      return;
    }
    fetchData();
  };

  const handleRefreshPlayer = useCallback(() => {
    if (!selectedPlayer) {
      return;
    }
    AccountService.refreshPlayer(selectedPlayer.id).then((response) => {
      if (response.status === "success") {
        getPlayerList(true);
      } else if (response.raw_error === AccountServiceError.Expired) {
        setIsExpired(true);
        setError(t("AttendancePage.error.expired"));
        openSharedModal("relogin", {
          player: selectedPlayer,
          onSuccess: () => getPlayerList(true),
        });
        setLoading(false);
      } else {
        setError(response.message);
        setLoading(false);
      }
    });
  }, [selectedPlayer, getPlayerList, t, openSharedModal]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsExpired(false);
    if (
      !selectedPlayer ||
      selectedPlayer.playerType !== PlayerType.ThirdParty ||
      !selectedPlayer.authServer?.features?.clubAttendanceUrl
    ) {
      setData(null);
      setError(t("AttendancePage.error.notAvailable"));
      setLoading(false);
      return;
    }
    try {
      const response = await AccountService.fetchAttendanceData(
        selectedPlayer.authServer.features.clubAttendanceUrl,
        selectedPlayer.accessToken || "",
        i18n.language
      );
      if (response.status === "success") {
        const json: AttendanceData = response.data;
        setData(json);
      } else {
        if (
          response.raw_error === "EXPIRED" ||
          response.details === "EXPIRED"
        ) {
          handleRefreshPlayer();
        } else {
          setError(
            t("AttendancePage.error.fetchFailed", {
              message: response.message,
            })
          );
        }
      }
    } catch (err) {
      setError(t("AttendancePage.error.unknown"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedPlayer, i18n.language, t, handleRefreshPlayer]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { info, term, time, table } = data?.data || {};
  const termStatusPlaceholders = [
    {
      title: <Skeleton width="84px" />,
      description: <ChakraSkeleton height="12px" marginY="2px" width="216px" />,
      prefixElement: <ChakraSkeleton height="32px" width="32px" />,
      children: (
        <ChakraSkeleton height="24px" width="24px" borderRadius="6px" />
      ),
    },
    <ChakraSkeleton height="40px" key="placeHolder" borderRadius="6px" />,
    {
      title: <Skeleton width="52px" />,
      children: <Skeleton width="96px" />,
    },
    {
      title: <Skeleton width="52px" />,
      children: <Skeleton width="64px" />,
    },
  ];

  const onlineTimePlaceholders = [
    <ChakraSkeleton height="40px" key="placeHolder" borderRadius="6px" />,
    {
      title: <Skeleton width="96px" />,
      children: <Skeleton width="48px" />,
    },
    {
      title: <Skeleton width="96px" />,
      description: <Skeleton width="288px" />,
      children: (
        <ChakraSkeleton height="24px" width="24px" borderRadius="6px" />
      ),
    },
  ];

  const termStatusItems = [
    {
      title: selectedPlayer
        ? selectedPlayer.name
        : t("AttendancePage.error.noSelectedPlayer"),
      description:
        (selectedPlayer && generatePlayerDesc(selectedPlayer, true)) || "",
      prefixElement: selectedPlayer ? (
        <Image
          boxSize="32px"
          objectFit="cover"
          src={base64ImgSrc(selectedPlayer.avatar)}
          alt={selectedPlayer.name}
        />
      ) : (
        <Box width="32px" height="32px" bg="blackAlpha.200" />
      ),
      children: (
        <Box position="absolute" right={4}>
          <SwitchButton
            tooltip={t("LaunchPage.SwitchButton.tooltip.switchPlayer")}
            aria-label="switch-player"
            variant="subtle"
            placement="bottom-end"
            popoverContent={
              <PlayersView
                players={playerList}
                selectedPlayer={selectedPlayer}
                viewType="list"
                withMenu={false}
              />
            }
            onClick={() => {}}
          />
        </Box>
      ),
    },
    ...(term
      ? [
          <Alert
            status={info?.registered && term.passed ? "success" : "info"}
            fontSize="xs-sm"
            borderRadius="md"
            key="termStatus"
          >
            <AlertIcon />
            {term.message}
          </Alert>,
          info?.registered && {
            title: t("AttendancePage.currentTerm"),
            children:
              t("AttendancePage.termInfo", {
                start: term.start,
                end: term.end,
              }) +
              (term.exempt
                ? t("AttendancePage.excluding", {
                    exempt: term.exempt,
                  })
                : ""),
          },
          info?.registered && {
            title: t("AttendancePage.attendanceProgress"),
            children: `${term.attended} / ${term.require}`,
          },
        ]
      : []),
  ].filter(Boolean);

  const onlineTimeItems = [
    error && (
      <Alert status="warning" fontSize="xs-sm" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    ),
    time?.status && <StatusBanner status={time.status} />,
    isExpired && {
      title: t("AttendancePage.button.relogin"),
      children: <Icon as={LuArrowRight} boxSize={3.5} mr="5px" />,
      isFullClickZone: true,
      onClick: () =>
        openSharedModal("relogin", {
          player: selectedPlayer,
          onSuccess: () => getPlayerList(true),
        }),
    },
    time && {
      title: t("AttendancePage.weekOnlineTime"),
      children: time.weekTotal,
    },
    selectedPlayer?.authServer?.features.clubAttendancePage && {
      title: t("AttendancePage.button.page"),
      description: t("AttendancePage.button.pageDescription"),
      children: (
        <CommonIconButton
          label={selectedPlayer.authServer.features.clubAttendancePage}
          icon="external"
          withTooltip
          tooltipPlacement="bottom-end"
          size="xs"
          onClick={() =>
            selectedPlayer?.authServer?.features.clubAttendancePage &&
            openUrl(selectedPlayer.authServer.features.clubAttendancePage)
          }
        />
      ),
    },
  ].filter(Boolean);

  return (
    <Grid templateColumns="1fr" gap={4} h="100%">
      <GridItem className="content-full-y">
        <VStack align="stretch" spacing={4}>
          <Section
            title={t("AttendancePage.title")}
            withBackButton
            headExtra={
              <HStack spacing={2}>
                <CommonIconButton
                  aria-label="refresh"
                  variant="subtle"
                  icon="refresh"
                  size="xs"
                  onClick={refreshData}
                  isLoading={loading}
                  disabled={
                    isExpired ||
                    !selectedPlayer ||
                    selectedPlayer.playerType !== PlayerType.ThirdParty
                  }
                />
              </HStack>
            }
          >
            {!data && !error ? (
              <VStack align="stretch" spacing={4}>
                <Grid templateColumns={{ base: "repeat(2, 1fr)" }} gap={4}>
                  <GridItem>
                    <VStack align="stretch" spacing={4}>
                      <OptionItemGroup
                        titleExtra={
                          <ChakraSkeleton
                            width="60px"
                            height="15px"
                            marginY="3px"
                          />
                        }
                        items={termStatusPlaceholders}
                      />
                    </VStack>
                  </GridItem>
                  <GridItem>
                    <VStack align="stretch" spacing={4}>
                      <OptionItemGroup
                        titleExtra={
                          <ChakraSkeleton
                            width="60px"
                            height="15px"
                            marginY="3px"
                          />
                        }
                        items={onlineTimePlaceholders}
                      />
                    </VStack>
                  </GridItem>
                </Grid>
                <OptionItemGroup
                  titleExtra={
                    <ChakraSkeleton width="180px" height="15px" marginY="3px" />
                  }
                  items={[
                    ...[1, 2, 3, 4, 5, 6, 7, 8].map(() => ({
                      title: <Skeleton width="96px" />,
                      description: (
                        <ChakraSkeleton
                          width="32px"
                          height="12px"
                          marginY="2px"
                        />
                      ),
                      children: <Skeleton width="48px" />,
                    })),
                  ]}
                />
              </VStack>
            ) : (
              <VStack align="stretch" spacing={4}>
                <Grid templateColumns={{ base: "repeat(2, 1fr)" }} gap={4}>
                  <GridItem>
                    <VStack align="stretch" spacing={4}>
                      <OptionItemGroup
                        title={t("AttendancePage.termStatus")}
                        items={termStatusItems}
                      />
                    </VStack>
                  </GridItem>
                  <GridItem>
                    <VStack align="stretch" spacing={4}>
                      <OptionItemGroup
                        title={t("AttendancePage.onlineTime")}
                        items={onlineTimeItems}
                      />
                    </VStack>
                  </GridItem>
                </Grid>
                {table && (
                  <OptionItemGroup
                    title={t("AttendancePage.serverLoginLog")}
                    items={
                      table.length > 0
                        ? table.map((x) => ({
                            title: `${x.sessionStart} - ${x.sessionEnd}`,
                            description: t("AttendancePage.afkTime", {
                              afkTime: x.afkTime,
                            }),
                            children: `${x.sessionTime}`,
                          }))
                        : [
                            <Text textAlign="center" key="noRecord">
                              {t("AttendancePage.noRecord")}
                            </Text>,
                          ]
                    }
                  />
                )}
              </VStack>
            )}
          </Section>
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default AttendancePage;
