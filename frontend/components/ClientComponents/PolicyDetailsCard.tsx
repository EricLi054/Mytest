'use client';

import { Box, Button, Grid, IconButton, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
import {
  getProductTypeIcon,
  theme,
  DesktopH3,
  BodyCopy,
  RacwaCardNotification,
  MobileH3,
  RacwaTooltip
} from '@racwa/react-components';
import { useMemo, useState } from 'react';
import DropdownButton from './DropdownButton';
import { faCaretDown, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from '@racwa/styles';
import convertStringToElements from '../../utilities/convertStringToElements';
import { type GAProps } from '../../types/cmsTypes/GAProps';
import { logEvent } from '@/utilities/analyticsTagging';
import Link from 'next/link';

interface PolicyDetailsCardProps {
  data: PolicyDetailsCardContent;
}

export interface PolicyDetailsCardContent {
  title?: string;
  subtitle?: string;
  subtitleSecondary?: string;
  registrationNumber?: string;
  type?: string;
  alerts?: Alert[];
  policyItems?: PolicyItem[];
  actions?: Action[];
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  width: '100%',
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  [theme.breakpoints.up('sm')]: {
    maxWidth: theme.spacing(120),
    padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
    borderRadius: 4
  }
}));

const StyledIcon = styled(Grid)(({ theme }) => ({
  width: theme.spacing(7),
  '& svg': {
    width: '100%',
    height: '100%'
  },
  [theme.breakpoints.up('sm')]: {
    width: theme.spacing(9)
  }
}));

const StyledRegoNumber = styled('span')(({ theme }) => ({
  backgroundColor: colors.racGrayLight,
  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  borderRadius: '3px'
}));

interface Action {
  label?: string;
  subLabel?: string;
  link?: string;
  type?: 'primary' | 'secondary' | 'info';
  subActions?: Action[];
  analytics?: GAProps;
}
interface Tooltip {
  title: string;
  message: string;
}
interface DropdownLink {
  label: string;
  subLabel: string;
  link: string;
  analytics?: GAProps;
}

// Define a conversion function to convert Action[] to DropdownLink[]
const convertToDropdownLinks = (actions: Action[]): DropdownLink[] => {
  return actions.map((action) => ({
    label: action.label ?? '',
    subLabel: action.subLabel ?? '',
    link: action.link ?? '', // Assuming the link property in Action maps to the href property in DropdownLink
    analytics: action.analytics ?? { description: '' } // Assuming the analytics property in Action maps to the analytics property in DropdownLink
  }));
};

interface Alert {
  severity: 'info' | 'warning' | 'error';
  message: string;
}

interface PolicyItem {
  label: string;
  value: string;
  bundledAmount?: BundledAmount;
  paymentMethod?: PaymentMethod;
  paymentFrequency?: PaymentFrequency;
  tooltip?: Tooltip;
}

interface BundledAmount {
  label: string;
  title: string;
  message: string;
  bundledProducts: BundledProduct[];
}

interface BundledProduct {
  productName: string;
  asset: string;
}

interface PaymentMethod {
  title: string;
  type: string;
  bsb?: string;
  accountNumber?: string;
  cardNumber?: string;
  cardExpiry?: string;
  linkText?: string;
  link?: string;
}

interface PaymentFrequency {
  title: string;
  preMessage?: string;
  frequency?: string;
  message?: string;
  linkText?: string;
  link?: string;
}

const PropertyTooltip = ({ tooltip }: { tooltip: Tooltip }) => {
  const [open, setOpen] = useState(false);

  return (
    <RacwaTooltip
      {...tooltip}
      message={convertStringToElements(tooltip.message, { fontWeight: 'medium', fontSize: 'medium' }, tooltip?.title)}
      open={open}
      onClick={() => {
        setOpen(true);
        logEvent(`Tooltip - ${tooltip.title}`);
      }}
      onClickClose={() => {
        setOpen(false);
      }}
      onClickAway={() => {
        setOpen(false);
      }}
    >
      <IconButton size='small' aria-label='show tooltip' style={{ padding: 0, marginLeft: 4, alignSelf: 'center' }}>
        <FontAwesomeIcon
          style={{
            color: colors.linkBlue
          }}
          icon={faInfoCircle}
        />
      </IconButton>
    </RacwaTooltip>
  );
};

const createPaymentMethodMessage = (paymentMethod: PaymentMethod) => {
  return (
    <Grid container direction='column' gap={1.5}>
      {paymentMethod.bsb && (
        <Grid item>
          <Typography variant='body1' fontSize={'medium'}>
            BSB
          </Typography>
          <Typography variant='body1' fontSize={'medium'} fontWeight={'medium'}>
            {paymentMethod.bsb}
          </Typography>
        </Grid>
      )}
      {paymentMethod.accountNumber && (
        <Grid item>
          <Typography variant='body1' fontSize={'medium'}>
            Bank account no.
          </Typography>
          <Typography variant='body1' fontSize={'medium'} fontWeight={'medium'}>
            {paymentMethod.accountNumber}
          </Typography>
        </Grid>
      )}
      {paymentMethod.cardNumber && (
        <Grid item>
          <Typography variant='body1' fontSize={'medium'}>
            Card number
          </Typography>
          <Typography variant='body1' fontSize={'medium'} fontWeight={'medium'}>
            {paymentMethod.cardNumber}
          </Typography>
        </Grid>
      )}
      {paymentMethod.cardExpiry && (
        <Grid item>
          <Typography variant='body1' fontSize={'medium'}>
            Card expiry
          </Typography>
          <Typography variant='body1' fontSize={'medium'} fontWeight={'medium'}>
            {paymentMethod.cardExpiry}
          </Typography>
        </Grid>
      )}
      {paymentMethod.link ? (
        <Link href={paymentMethod.link} style={{ color: colors.linkBlue }}>
          <Typography variant='body1' fontSize={'medium'} fontWeight={'medium'}>
            {paymentMethod.linkText}
          </Typography>
        </Link>
      ) : null}
    </Grid>
  );
};

const createPaymentFrequencyMessage = (paymentFrequency: PaymentFrequency) => {
  return (
    <Grid container direction='column' gap={1.5}>
      <Typography variant='body1' fontSize={'medium'} fontWeight={'medium'} gutterBottom>
        {paymentFrequency.message}
      </Typography>
      {paymentFrequency.link ? (
        <Link href={paymentFrequency.link} style={{ color: colors.linkBlue }}>
          <Typography variant='body1' fontSize={'medium'} fontWeight={'medium'}>
            {paymentFrequency.linkText}
          </Typography>
        </Link>
      ) : null}
    </Grid>
  );
};

const createBundledAmountMessage = (bundledAmount: BundledAmount) => {
  return (
    <>
      <Typography variant='body1' fontSize={'medium'} fontWeight={'medium'} gutterBottom>
        {bundledAmount.message}
      </Typography>
      {bundledAmount.bundledProducts && (
        <ul style={{ fontSize: '14px' }}>
          {bundledAmount.bundledProducts?.map((bundledProduct: BundledProduct, index: number) => {
            return (
              <li key={index}>
                {bundledProduct.productName}
                <br />
                {bundledProduct.asset}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

const WordTooltip = ({
  policyCardTitle,
  tooltipTitle,
  tooltipContent,
  label,
  preMessage,
  ariaLabel,
  startPadding = 4
}: {
  policyCardTitle: string;
  tooltipTitle: string;
  tooltipContent: string | React.ReactNode;
  label: string;
  preMessage?: string;
  ariaLabel: string;
  startPadding?: number;
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  return (
    <>
      {preMessage && <span style={{ paddingLeft: 4 }}>{preMessage}</span>}
      <RacwaTooltip
        title={tooltipTitle}
        message={tooltipContent}
        open={open}
        onClick={() => {
          setOpen(true);
          logEvent(`Tooltip - ${tooltipTitle} - ${label} - ${policyCardTitle}`);
        }}
        onClickClose={() => {
          setOpen(false);
        }}
        onClickAway={() => {
          setOpen(false);
        }}
      >
        <IconButton
          size='small'
          aria-label={ariaLabel}
          style={{
            background: 'none',
            padding: 0,
            lineHeight: theme.typography.body1.lineHeight,
            fontFamily: theme.typography.body1.fontFamily
          }}
        >
          <span
            aria-label={ariaLabel}
            aria-labelledby='none'
            style={{
              color: colors.linkBlue,
              cursor: 'pointer',
              textDecoration: 'underline',
              paddingLeft: startPadding
            }}
          >
            {label}
            <FontAwesomeIcon size='xs' icon={faCaretDown} style={{ paddingLeft: 4 }} />
          </span>
        </IconButton>
      </RacwaTooltip>
    </>
  );
};

const PolicyItemComponent = ({ policyItem, policyCardTitle }: { policyItem: PolicyItem; policyCardTitle: string }) => {
  return (
    <Grid item>
      <BodyCopy>{policyItem.label}</BodyCopy>
      <BodyCopy fontWeight='medium' display='flex' alignItems='baseline'>
        <span>{policyItem.value}</span>
        {policyItem.tooltip ? <PropertyTooltip tooltip={policyItem.tooltip} /> : null}
        {policyItem.bundledAmount ? (
          <WordTooltip
            policyCardTitle={policyCardTitle}
            tooltipTitle={policyItem.bundledAmount.title}
            tooltipContent={createBundledAmountMessage(policyItem.bundledAmount)}
            label={policyItem.bundledAmount.label}
            ariaLabel='show bundled payment tooltip'
            startPadding={policyItem.value ? 8 : 0}
          />
        ) : null}
        {policyItem.paymentMethod ? (
          <WordTooltip
            policyCardTitle={policyCardTitle}
            tooltipTitle={policyItem.paymentMethod.title}
            tooltipContent={createPaymentMethodMessage(policyItem.paymentMethod)}
            label={policyItem.paymentMethod.type}
            ariaLabel='show payment method tooltip'
          />
        ) : null}
        {policyItem.paymentFrequency ? (
          <WordTooltip
            policyCardTitle={policyCardTitle}
            tooltipTitle={policyItem.paymentFrequency.title}
            tooltipContent={createPaymentFrequencyMessage(policyItem.paymentFrequency)}
            label={policyItem.paymentFrequency.frequency ?? 'Frequency'}
            preMessage={policyItem.paymentFrequency.preMessage ?? 'paying'}
            ariaLabel='show payment frequency tooltip'
          />
        ) : null}
      </BodyCopy>
    </Grid>
  );
};

function CardContent(data: PolicyDetailsCardContent) {
  const mobileQuery = theme.breakpoints.down('md');
  const isMobile = useMediaQuery(mobileQuery);

  const productIcon = useMemo(() => {
    return <StyledIcon>{getProductTypeIcon(data.type ? data.type : '')}</StyledIcon>;
  }, [data.type]);

  const policyHeader = useMemo(() => {
    const HeaderComponent = isMobile ? MobileH3 : DesktopH3;
    return (
      <Grid item flex={isMobile ? 1 : undefined}>
        {data.title ? <HeaderComponent>{data.title}</HeaderComponent> : null}
        {data.subtitle ? (
          <BodyCopy fontWeight={'medium'}>
            <span style={{ paddingRight: 8 }}>{data.subtitle} </span>
            {data.registrationNumber ? <StyledRegoNumber>{data.registrationNumber}</StyledRegoNumber> : ''}
          </BodyCopy>
        ) : null}
        {data.subtitleSecondary ? (
          <BodyCopy fontSize={'medium'} fontWeight={'light'}>
            {data.subtitleSecondary}
          </BodyCopy>
        ) : null}
      </Grid>
    );
  }, [data.title, data.subtitle, data.subtitleSecondary, data.registrationNumber, isMobile]);

  const actions = useMemo(() => {
    const policyCardTitle = data.title ?? '';
    return (
      <Grid item flex={isMobile ? undefined : '1 0 0'}>
        <Grid
          container
          direction={isMobile ? 'column' : 'row'}
          justifyContent={isMobile ? undefined : 'flex-end'}
          gap={2}
          flexWrap={isMobile ? undefined : 'nowrap'}
        >
          {data.actions?.map((action: Action, index: number) => {
            const width = isMobile ? '100%' : data.actions?.length === 1 ? theme.spacing(49) : theme.spacing(23.5);
            if (action.subActions && action.subActions.length > 0) {
              return (
                <DropdownButton
                  primaryLabel={`${action.label as string} - ${policyCardTitle}`}
                  menuItems={convertToDropdownLinks(action.subActions)}
                  sx={{ minWidth: width }}
                  key={index}
                  color={action.type || undefined}
                >
                  {action.label}
                </DropdownButton>
              );
            } else {
              return (
                <Button
                  color={action.type || undefined}
                  href={action.link}
                  sx={{ width }}
                  key={index}
                  onClick={() => {
                    logEvent(action.analytics?.description ?? '');
                  }}
                >
                  {action.label}
                </Button>
              );
            }
          })}
        </Grid>
      </Grid>
    );
  }, [data.actions, data.title, isMobile]);

  const alerts = useMemo(() => {
    if (!data.alerts || data.alerts.length === 0) return null;
    return (
      <Grid container direction={'column'} gap={3} width={{ xs: '100%', sm: 'auto' }}>
        {data.alerts?.map((alert: Alert, index: number) => {
          return (
            <RacwaCardNotification
              key={index}
              severity={alert.severity}
              title={convertStringToElements(alert.message, { fontWeight: 400 }, data.title)}
            />
          );
        })}
      </Grid>
    );
  }, [data.alerts, data.title]);

  const policyData = useMemo(() => {
    if (!data.policyItems || data.policyItems.length === 0) return null;

    const column1 = data.policyItems.slice(0, Math.ceil(data.policyItems.length / 2));
    const column2 = data.policyItems.slice(Math.ceil(data.policyItems.length / 2));

    const policyCardTitle = data.title ?? '';

    return (
      <Grid container direction={{ xs: 'column', md: 'row' }} rowSpacing={2.5} columnSpacing={3}>
        <Grid container item direction='column' xs={6} rowSpacing={2.5} columnSpacing={3}>
          {column1?.map((policyItem: PolicyItem) => {
            return (
              <PolicyItemComponent policyCardTitle={policyCardTitle} policyItem={policyItem} key={policyItem.value} />
            );
          })}
        </Grid>
        <Grid container item direction='column' xs={6} rowSpacing={2.5} columnSpacing={3}>
          {column2?.map((policyItem: PolicyItem) => {
            return (
              <PolicyItemComponent policyCardTitle={policyCardTitle} policyItem={policyItem} key={policyItem.value} />
            );
          })}
        </Grid>
      </Grid>
    );
  }, [data.policyItems, data.title]);

  if (isMobile) {
    return (
      <Grid container direction='column' gap={3}>
        <Grid item container direction='row' justifyContent={'space-between'}>
          {policyHeader}
          {productIcon}
        </Grid>
        {alerts}
        {policyData}
        {actions}
      </Grid>
    );
  }

  return (
    <Grid container direction={'row'} width={'100%'} alignItems={'flex-start'} gap={3} flexWrap={'nowrap'}>
      {productIcon}
      <Grid item container flexGrow={1} direction='column' rowGap={3} width='auto'>
        <Grid container direction='row' gap={3} flexWrap={'nowrap'}>
          {policyHeader}
          {actions}
        </Grid>
        {alerts}
        {policyData}
      </Grid>
    </Grid>
  );
}

export default function PolicyDetailsCard(props: PolicyDetailsCardProps) {
  const { data } = props;

  return <StyledBox>{CardContent(data)}</StyledBox>;
}
