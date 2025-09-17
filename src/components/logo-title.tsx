import { BoxProps, HStack, Heading, Highlight, Image } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import styles from "@/styles/logo-title.module.css";

interface LogoTitleProps extends BoxProps {}

export const TitleShort: React.FC<LogoTitleProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Heading size="md" className={styles.title} {...props}>
      {t("LogoTitle.heading.short.text1")}
      {t("LogoTitle.heading.short.space")}
      <Highlight
        query={t("LogoTitle.heading.short.query")}
        styles={{ color: "blue.600", userSelect: "none" }}
      >
        {t("LogoTitle.heading.short.text2")}
      </Highlight>
    </Heading>
  );
};

export const TitleFull: React.FC<LogoTitleProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Heading size="md" className={styles.title} {...props}>
      {t("LogoTitle.heading.full.text1")}
      {t("LogoTitle.heading.full.space")}
      <Highlight
        query={t("LogoTitle.heading.full.query")}
        styles={{ color: "blue.600", userSelect: "none" }}
      >
        {t("LogoTitle.heading.full.text2")}
      </Highlight>
    </Heading>
  );
};

export const TitleFullWithLogo: React.FC<LogoTitleProps> = (props) => {
  return (
    <HStack>
      <Image src="/images/icons/Logo_128x128.png" alt="Logo" boxSize="36px" />
      <TitleFull {...props} />
    </HStack>
  );
};
