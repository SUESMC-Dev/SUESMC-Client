import { Card, Spinner, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalData } from "@/contexts/global-data";
import { PlayerType } from "@/enums/account";
import { AccountServiceError } from "@/enums/service-error";
import { AttendanceData } from "@/models/attendance";
import { AccountService } from "@/services/account";
import cardStyles from "@/styles/card.module.css";
import styles from "@/styles/launch.module.css";

// keep the card up to date while the launcher stays open
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

export const AttendanceCard = () => {
  const { t, i18n } = useTranslation();
  const { selectedPlayer, getPlayerList } = useGlobalData();
  const router = useRouter();
  const [attendanceTime, setAttendanceTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  // whether the login session has been renewed for the current fetching round,
  // to avoid refreshing repeatedly when the request keeps failing
  const sessionRefreshTriedRef = useRef(false);
  // whether a request is in flight, used to skip duplicated refreshes
  const fetchingRef = useRef(false);

  // read the latest global data helpers without making them effect dependencies,
  // otherwise renewing the player list would retrigger the fetching endlessly
  const getPlayerListRef = useRef(getPlayerList);
  useEffect(() => {
    getPlayerListRef.current = getPlayerList;
  }, [getPlayerList]);

  const playerId = selectedPlayer?.id;
  const playerType = selectedPlayer?.playerType;
  const attendanceUrl = selectedPlayer?.authServer?.features?.clubAttendanceUrl;

  const fetchAttendance = useCallback(
    async (force = false) => {
      if (!playerId || playerType !== PlayerType.ThirdParty || !attendanceUrl) {
        setVisible(false);
        setAttendanceTime(null);
        return;
      }
      setVisible(true);
      if (!force && fetchingRef.current) {
        return;
      }
      fetchingRef.current = true;
      setLoading(true);
      try {
        let response = await AccountService.fetchAttendanceData(
          attendanceUrl,
          playerId,
          i18n.language
        );

        // The access token may have expired, renew the session and retry. The
        // request itself always uses the token stored in the backend, so the
        // retry picks up the renewed token automatically.
        if (
          response.status === "error" &&
          response.raw_error === AccountServiceError.Expired &&
          !sessionRefreshTriedRef.current
        ) {
          sessionRefreshTriedRef.current = true;
          const refreshResponse = await AccountService.refreshPlayer(playerId);
          if (refreshResponse.status === "success") {
            getPlayerListRef.current(true);
            response = await AccountService.fetchAttendanceData(
              attendanceUrl,
              playerId,
              i18n.language
            );
          }
        }

        if (response.status === "success") {
          const json: AttendanceData = response.data;
          if (json.code === 0 && json.data?.time?.weekTotal) {
            setAttendanceTime(json.data.time.weekTotal);
          }
        }
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    },
    [playerId, playerType, attendanceUrl, i18n.language]
  );

  useEffect(() => {
    // a new player or locale starts a new fetching round
    sessionRefreshTriedRef.current = false;
    fetchAttendance(true);

    const refresh = () => {
      fetchAttendance();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    const timer = window.setInterval(refresh, AUTO_REFRESH_INTERVAL);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchAttendance]);

  if (!visible) return null;
  return (
    <Card
      className={styles["selected-user-card"] + " " + cardStyles["card-back"]}
      cursor="pointer"
      onClick={() => router.push("/attendance")}
      sx={{
        width: "auto !important",
        minWidth: "100px",
      }}
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing={1}>
        <Text fontSize="xs" fontWeight="bold">
          {t("AttendanceCard.title")}
        </Text>
        <Text fontSize="md">
          {attendanceTime || ""}
          {loading && <Spinner size="sm" />}
        </Text>
      </VStack>
    </Card>
  );
};
