import {
  Box,
  IconButton,
  IconButtonProps,
  PlacementWithLogical,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { cloneElement, useState } from "react";
import { LuArrowLeftRight } from "react-icons/lu";
import { useLauncherConfig } from "@/contexts/config";

export interface SwitchButtonProps extends Omit<IconButtonProps, "onClick"> {
  tooltip: string;
  onClick: () => void;
  popoverContent: React.ReactElement;
  placement: PlacementWithLogical;
}

export const SwitchButton: React.FC<SwitchButtonProps> = ({
  tooltip,
  popoverContent,
  onClick,
  placement,
  ...props
}) => {
  const { config } = useLauncherConfig();
  const quickSwitch = config.general.functionality.launchPageQuickSwitch;
  const { isOpen, onToggle, onClose } = useDisclosure();

  const [tooltipDisabled, setTooltipDisabled] = useState(false);

  // To use Popover and Tooltip together, refer to: https://github.com/chakra-ui/chakra-ui/issues/2843
  // However, when the Popover is closed, the Tooltip will wrongly show again.
  // To prevent this, we temporarily disable the Tooltip using a timeout.
  const handleClose = () => {
    setTooltipDisabled(true);
    onClose();
    setTimeout(() => setTooltipDisabled(false), 200);
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={handleClose}
      placement={placement}
      gutter={12} // add more gutter to show clear space from the launch button's shadow
    >
      <Tooltip
        label={tooltip}
        placement={placement}
        isDisabled={tooltipDisabled}
      >
        <Box>
          {/* anchor for Tooltip */}
          <PopoverTrigger>
            <IconButton
              size="xs"
              icon={<LuArrowLeftRight />}
              {...props}
              onClick={() => {
                quickSwitch ? onToggle() : onClick();
              }}
            />
          </PopoverTrigger>
        </Box>
      </Tooltip>
      <PopoverContent maxH="3xs" overflow="auto">
        <PopoverBody p={0}>
          {cloneElement(popoverContent, {
            // Delay close after selecting an item for better UX.
            onSelectCallback: () => setTimeout(handleClose, 100),
          })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
