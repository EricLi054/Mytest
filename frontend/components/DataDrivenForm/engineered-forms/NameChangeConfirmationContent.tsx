import { GALink } from '@/components/ClientComponents/GALink';
import { logEvent, logFieldTouched } from '@/utilities/analyticsTagging';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { RacwaCardNotification } from '@racwa/react-components';
import { useEffect, useMemo, useState } from 'react';

const nameChangeOptions = {
  correctTheSpelling: 'Correct the spelling',
  changeFromANickname: 'Change from a nickname',
  somethingElse: 'Something else'
};

const baseEventText = 'Name section - Your first name is important';

const NameChangeConfirmationContent = ({
  onConfirm,
  onCancel,
  logNameChangeEvent
}: {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  logNameChangeEvent: (event: string) => Promise<void>;
}) => {
  const [option, setOption] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    logEvent(`${baseEventText} - Popup`);
  }, []);

  const handleSelectionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    logFieldTouched(`${baseEventText} - What would you like to do with your first name`);
    setError(false);
    setOption(e.target.value);
    logEvent(`${baseEventText} - ${e.target.value}`);
    await logNameChangeEvent(`selected option - ${e.target.value}`);
    if (e.target.value === nameChangeOptions.somethingElse) {
      logEvent(`${baseEventText} - Sorry, you can't do this online`);
    }
  };

  const confirm = async () => {
    logEvent(`${baseEventText} - Update name`);
    setError(false);
    if (option) {
      await logNameChangeEvent(`confirmed with option - ${option}`);
      await onConfirm();
    } else {
      logEvent(`${baseEventText} - Please select an option`);
      setError(true);
    }
  };

  const cancel = async () => {
    logEvent(`${baseEventText} - Cancel`);
    await logNameChangeEvent(`cancelled with option - ${option}`);
    onCancel();
  };

  const alert = useMemo(() => {
    if (option === nameChangeOptions.somethingElse) {
      return (
        <RacwaCardNotification title="Sorry, you can't do this online" severity='error'>
          <Grid container direction='column' gap={2} sx={{ '& p': { fontSize: 16 } }}>
            <Typography variant='body1'>
              Please call us on{' '}
              <GALink
                href='tel:131703'
                googleAnalyticsDescription={`${baseEventText} - Sorry, you can't do this online - 13 17 03`}
              >
                13 17 03
              </GALink>{' '}
              so we can help you.
            </Typography>
            <Typography variant='body1'>
              Or read our{' '}
              <GALink
                href='/myrac/help'
                target='__blank'
                googleAnalyticsDescription={`${baseEventText} - Sorry, you can't do this online - FAQs`}
              >
                frequently asked questions
              </GALink>
              .
            </Typography>
          </Grid>
        </RacwaCardNotification>
      );
    } else {
      return (
        <RacwaCardNotification title='Please note' severity='warning'>
          You can&apos;t transfer your policies or products to someone else.
        </RacwaCardNotification>
      );
    }
  }, [option]);

  return (
    <Grid container direction='column' gap={2}>
      <FormControl error={error} sx={{ margin: 0 }}>
        <FormLabel id='name-change-reason-label'>
          <Typography variant='body1'>
            <strong>What would you like to do with your first name?</strong>
          </Typography>
        </FormLabel>
        <RadioGroup
          aria-label='name-change-reason'
          name='name-change-reason'
          value={option}
          onChange={handleSelectionChange}
        >
          {Object.entries(nameChangeOptions).map(([key, value]) => (
            <FormControlLabel
              key={key}
              value={value}
              control={<Radio sx={{ paddingY: 1, paddingRight: 1.5 }} />}
              label={
                <Typography variant='body1' fontSize={16}>
                  {value}
                </Typography>
              }
            />
          ))}
        </RadioGroup>
        {error && <FormHelperText>Please select an option</FormHelperText>}
      </FormControl>
      {alert}
      <Grid container direction={{ xs: 'column', md: 'row-reverse' }} rowGap={3} columnSpacing={2} paddingTop={1}>
        <Grid item xs={6}>
          <Button color='primary' onClick={confirm} disabled={option === nameChangeOptions.somethingElse} fullWidth>
            Update name
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button onClick={cancel} fullWidth>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NameChangeConfirmationContent;
