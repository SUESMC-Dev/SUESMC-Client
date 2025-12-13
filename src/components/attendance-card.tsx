import { Card, Spinner, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalData } from "@/contexts/global-data";
import { PlayerType } from "@/enums/account";
import { useThemedCSSStyle } from "@/hooks/themed-css";
import { AttendanceData } from "@/models/attendance";
import { AccountService } from "@/services/account";
import styles from "@/styles/launch.module.css";

export const AttendanceCard = () => {
  const { t, i18n } = useTranslation();
  const { selectedPlayer } = useGlobalData();
  const router = useRouter();
  const themedStyles = useThemedCSSStyle();
  const [attendanceTime, setAttendanceTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkAndFetch = async () => {
      if (
        !selectedPlayer ||
        selectedPlayer.playerType !== PlayerType.ThirdParty
      ) {
        setVisible(false);
        return;
      }
      const attendanceUrl =
        selectedPlayer.authServer?.features?.clubAttendanceUrl;
      if (!attendanceUrl) {
        setVisible(false);
        return;
      }
      setVisible(true);
      setLoading(true);
      try {
        const response = await AccountService.fetchAttendanceData(
          attendanceUrl,
          selectedPlayer.accessToken || "",
          i18n.language
        );
        if (response.status === "success") {
          const json: AttendanceData = response.data;
          if (json.code === 0 && json.data?.time?.weekTotal) {
            setAttendanceTime(json.data.time.weekTotal);
          }
        }
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      } finally {
        setLoading(false);
      }
    };
    checkAndFetch();
  }, [selectedPlayer, i18n.language]);
  if (!visible) return null;
  return (
    <Card
      className={
        styles["selected-user-card"] + " " + themedStyles.card["card-back"]
      }
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
