import { Avatar, AvatarGroup, HStack, Icon } from "@chakra-ui/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { LuArrowRight } from "react-icons/lu";
import { CommonIconButton } from "@/components/common/common-icon-button";
import {
  OptionItemGroup,
  OptionItemGroupProps,
} from "@/components/common/option-item";
import { TitleFullWithLogo } from "@/components/logo-title";
import { useLauncherConfig } from "@/contexts/config";
import { CoreContributorsList } from "@/pages/settings/contributors";

const AboutSettingsPage = () => {
  const { t } = useTranslation();
  const { config } = useLauncherConfig();
  const basicInfo = config.basicInfo;
  const router = useRouter();

  const aboutSettingGroups: OptionItemGroupProps[] = [
    {
      title: t("AboutSettingsPage.about.title"),
      items: [
        <TitleFullWithLogo key={0} />,
        {
          title: t("AboutSettingsPage.about.settings.version.title"),
          children: `${basicInfo.launcherVersion}${basicInfo.isPortable ? " (Portable)" : ""}`,
        },
        {
          title: t("AboutSettingsPage.about.settings.contributors.title"),
          children: (
            <HStack spacing={2.5}>
              <AvatarGroup size="xs" spacing={-2}>
                {CoreContributorsList.slice(0, 3).map((item) => (
                  <Avatar
                    key={item.username}
                    name={item.username}
                    src={`https://avatars.githubusercontent.com/${item.username}`}
                  />
                ))}
              </AvatarGroup>
              <Icon as={LuArrowRight} boxSize={3.5} mr="5px" />
            </HStack>
          ),
          isFullClickZone: true,
          onClick: () => router.push("/settings/contributors"),
        },
        {
          title: t("AboutSettingsPage.about.settings.reportIssue.title"),
          children: (
            <CommonIconButton
              label="https://github.com/UNIkeEN/SJMCL/issues"
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              h={18}
              onClick={() => {
                openUrl("https://github.com/UNIkeEN/SJMCL/issues");
              }}
            />
          ),
        },
        {
          title: t("AboutSettingsPage.about.settings.aboutSUESMC.title"),
          children: (
            <CommonIconButton
              label="https://www.suesmc.ltd/content/5/"
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              h={18}
              onClick={() => {
                openUrl("https://www.suesmc.ltd/content/5/");
              }}
            />
          ),
        },
      ],
    },
    {
      title: t("AboutSettingsPage.ack.title"),
      items: [
        {
          title: t("AboutSettingsPage.ack.settings.sjmcl.title"),
          description: t("AboutSettingsPage.ack.settings.sjmcl.description"),
          children: (
            <CommonIconButton
              label="https://github.com/UNIkeEN/SJMCL"
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              onClick={() => {
                openUrl("https://github.com/UNIkeEN/SJMCL");
              }}
            />
          ),
        },
        {
          title: t("AboutSettingsPage.ack.settings.skinview3d.title"),
          description: t(
            "AboutSettingsPage.ack.settings.skinview3d.description"
          ),
          children: (
            <CommonIconButton
              label="https://github.com/bs-community/skinview3d"
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              onClick={() => {
                openUrl("https://github.com/bs-community/skinview3d");
              }}
            />
          ),
        },
        {
          title: t("AboutSettingsPage.ack.settings.bmclapi.title"),
          description: t("AboutSettingsPage.ack.settings.bmclapi.description"),
          children: (
            <CommonIconButton
              label="https://bmclapidoc.bangbang93.com/"
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              onClick={() => {
                openUrl("https://bmclapidoc.bangbang93.com/");
              }}
            />
          ),
        },
        {
          title: t("AboutSettingsPage.ack.settings.hmcl.title"),
          description: t("AboutSettingsPage.ack.settings.hmcl.description"),
          children: (
            <CommonIconButton
              label="https://hmcl.huangyuhui.net/"
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              onClick={() => {
                openUrl("https://hmcl.huangyuhui.net/");
              }}
            />
          ),
        },
        {
          title: t("AboutSettingsPage.ack.settings.littleskin.title"),
          description: t(
            "AboutSettingsPage.ack.settings.littleskin.description"
          ),
          children: (
            <CommonIconButton
              label="https://github.com/LittleSkinChina"
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              onClick={() => {
                openUrl("https://github.com/LittleSkinChina");
              }}
            />
          ),
        },
        {
          title: t("AboutSettingsPage.ack.settings.sinter.title"),
          description: t("AboutSettingsPage.ack.settings.sinter.description"),
          children: (
            <CommonIconButton
              label="https://m.ui.cn/details/615564"
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              onClick={() => {
                openUrl("https://m.ui.cn/details/615564");
              }}
            />
          ),
        },
      ],
    },
    {
      title: t("AboutSettingsPage.legalInfo.title"),
      items: [
        {
          title: t("AboutSettingsPage.legalInfo.settings.copyright.title"),
          description: t(
            "AboutSettingsPage.legalInfo.settings.copyright.description"
          ),
          children: <></>,
        },
        {
          title: t("AboutSettingsPage.legalInfo.settings.userAgreement.title"),
          children: (
            <CommonIconButton
              label={t(
                "AboutSettingsPage.legalInfo.settings.userAgreement.url"
              )}
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              h={18}
              onClick={() => {
                openUrl(
                  t("AboutSettingsPage.legalInfo.settings.userAgreement.url")
                );
              }}
            />
          ),
        },
        {
          title: t(
            "AboutSettingsPage.legalInfo.settings.openSourceLicense.title"
          ),
          description: t(
            "AboutSettingsPage.legalInfo.settings.openSourceLicense.description"
          ),
          children: (
            <CommonIconButton
              label="https://github.com/UNIkeEN/SJMCL?tab=readme-ov-file#copyright"
              icon="external"
              withTooltip
              tooltipPlacement="bottom-end"
              size="xs"
              onClick={() => {
                openUrl(
                  "https://github.com/UNIkeEN/SJMCL?tab=readme-ov-file#copyright"
                );
              }}
            />
          ),
        },
      ],
    },
  ];

  return (
    <>
      {aboutSettingGroups.map((group, index) => (
        <OptionItemGroup title={group.title} items={group.items} key={index} />
      ))}
    </>
  );
};

export default AboutSettingsPage;
