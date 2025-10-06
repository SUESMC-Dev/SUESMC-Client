import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useTranslation } from "react-i18next";
import { LuExternalLink } from "react-icons/lu";
import MarkdownContainer from "@/components/common/markdown-container";
import { useLauncherConfig } from "@/contexts/config";
import { VersionMetaInfo } from "@/models/config";

interface NotifyNewVersionModalProps extends Omit<ModalProps, "children"> {
  newVersion: VersionMetaInfo;
}

const NotifyNewVersionModal: React.FC<NotifyNewVersionModalProps> = ({
  newVersion,
  ...props
}) => {
  const { t } = useTranslation();
  const { config } = useLauncherConfig();
  const primaryColor = config.appearance.theme.primaryColor;
  const handleDownloadUpdate = () => {
    openUrl(`https://client.suesmc.ltd/`);
    props.onClose();
  };

  return (
    <Modal scrollBehavior="inside" size="xl" {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${t("NotifyNewVersionModal.title")} - ${newVersion.version}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <MarkdownContainer>{newVersion.releaseNotes || ""}</MarkdownContainer>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={props.onClose}>
            {t("General.cancel")}
          </Button>
          <Button
            variant="solid"
            colorScheme={primaryColor}
            rightIcon={<LuExternalLink />}
            onClick={handleDownloadUpdate}
          >
            {t("General.download")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NotifyNewVersionModal;
