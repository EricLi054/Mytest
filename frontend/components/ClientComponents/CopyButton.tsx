'use client';

import { IconButton, Stack, tooltipClasses, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { StyledTooltip } from '../StyledComponents/Tooltip.styled';
import { logEvent } from '@/utilities/analyticsTagging';

export interface CopyButtonProps {
  text: string | undefined;
  isOpen?: boolean;
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // TODO: Error handling
    console.error(err);
  }
};

export const TOOLTIP_TIMEOUT_INTERVAL_SECONDS = 1;

function CopyButton({ text, isOpen = false }: CopyButtonProps) {
  const [open, setOpen] = useState(isOpen);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleTooltipClose = () => {
    if (tooltipTimeoutRef) {
      clearTimeout(tooltipTimeoutRef.current);
      setOpen(false);
    }
  };

  const handleTooltipOpen = () => {
    setOpen(true);
    tooltipTimeoutRef.current = setTimeout(() => {
      handleTooltipClose();
    }, TOOLTIP_TIMEOUT_INTERVAL_SECONDS * 1000);
  };

  return (
    <Stack direction='row'>
      <StyledTooltip
        PopperProps={{
          disablePortal: true
        }}
        slotProps={{
          popper: {
            sx: {
              [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]: {
                marginLeft: '8px'
              }
            }
          }
        }}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title='Copied!'
        placement='right'
        aria-label='copied'
      >
        <IconButton
          color='inherit'
          size='small'
          aria-label='copy to clipboard'
          sx={{
            padding: 0,
            '&:hover': {
              bgcolor: 'transparent'
            }
          }}
          onClick={async () => {
            handleTooltipOpen();
            await copyToClipboard(text ?? '');
            logEvent('Digital card - Copy member number');
          }}
        >
          <Typography fontWeight='400' marginRight='.25rem' lineHeight={1}>
            {text}
          </Typography>
          <FontAwesomeIcon size='sm' icon='copy' />
        </IconButton>
      </StyledTooltip>
    </Stack>
  );
}

export default CopyButton;
