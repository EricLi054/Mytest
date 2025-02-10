import PolicyDetailsCard, { type PolicyDetailsCardContent } from '@/components/ClientComponents/PolicyDetailsCard';

export default {
  title: 'Components/Client Components/Policy Details Card',
  component: PolicyDetailsCard,
  tags: ['autodocs']
};

export const Complete = () => {
  const data: PolicyDetailsCardContent = {
    title: 'This is a title',
    type: 'RSA',
    subtitle: 'This is a subtitle',
    policyItems: [
      {
        label: 'Policy Number',
        value: '123456789'
      },
      {
        label: 'Start Date',
        value: '01/01/2021'
      },
      {
        label: 'End Date',
        value: '01/01/2022'
      },
      {
        label: 'Example label',
        value: 'Some example data'
      }
    ],
    actions: [
      {
        type: 'primary',
        label: 'Primary',
        link: ''
      },
      {
        type: 'secondary',
        label: 'Secondary',
        link: ''
      },
      {
        label: 'Default',
        link: ''
      }
    ],
    alerts: [
      {
        severity: 'warning',
        message: 'This is a warning box'
      },
      {
        severity: 'info',
        message: 'This is an info box'
      },
      {
        severity: 'error',
        message: 'This is an error box'
      }
    ]
  };
  return <PolicyDetailsCard data={data} />;
};

export const RSA = () => {
  const data: PolicyDetailsCardContent = {
    title: 'Roadside Assistance',
    type: 'RSA',
    subtitle: 'Classic',
    policyItems: [
      {
        label: 'Policy Number',
        value: '123456789'
      },
      {
        label: 'Start Date',
        value: '01/01/2021'
      },
      {
        label: 'End Date',
        value: '01/01/2022'
      }
    ],
    actions: [
      {
        type: 'primary',
        label: 'View Policy',
        link: ''
      },
      {
        type: 'secondary',
        label: 'Manage',
        link: ''
      }
    ],
    alerts: [
      {
        severity: 'warning',
        message: 'To update your vehicle details, call us on 13 17 03 or visit a member service centre'
      }
    ]
  };
  return <PolicyDetailsCard data={data} />;
};

export const Rewards = () => {
  const data: PolicyDetailsCardContent = {
    title: 'Rewards',
    type: 'REWARDS',
    policyItems: [
      {
        label: 'Expires',
        value: '30 Jun 2024'
      }
    ],
    actions: [
      {
        type: 'secondary',
        label: 'View membership',
        link: ''
      },
      {
        type: 'primary',
        label: 'Manage',
        link: ''
      }
    ]
  };
  return <PolicyDetailsCard data={data} />;
};

export const Insurance = () => {
  const data: PolicyDetailsCardContent = {
    title: 'Home Insurance',
    subtitle: '25 York Street SUBIACO, WA 6008',
    type: 'HGP',
    policyItems: [
      {
        label: 'Amount due',
        value: '$652.26'
      },
      {
        label: 'Policy no.',
        value: 'HGP317327567'
      },
      {
        label: 'Cover',
        value: 'Building/Contents'
      },
      {
        label: 'Due on',
        value: '13 May 2023'
      }
    ],
    actions: [
      {
        type: 'primary',
        label: 'Pay now',
        link: ''
      },
      {
        label: 'Manage',
        link: ''
      }
    ],
    alerts: [
      {
        severity: 'warning',
        message: 'You have a payment owing'
      }
    ]
  };
  return <PolicyDetailsCard data={data} />;
};

export const Finance = () => {
  const data: PolicyDetailsCardContent = {
    title: 'Personal Loan',
    subtitle: 'Unsecured',
    type: 'PERSONAL LOAN',
    policyItems: [
      {
        label: 'Balance owed',
        value: '$6,063.82'
      },
      {
        label: 'Interest',
        value: '13% p.a.'
      },
      {
        label: 'Account Name',
        value: 'F. Button'
      },
      {
        label: 'Interest',
        value: '13% p.a.'
      },
      {
        label: 'Next payment',
        value: '$86.97 on 02 Nov 2024 '
      },
      {
        label: 'Account no.',
        value: '6543121'
      }
    ],
    actions: [
      {
        type: 'secondary',
        label: 'View account',
        link: ''
      }
    ],
    alerts: [
      {
        severity: 'info',
        message: 'View your account to log in and check your loan'
      }
    ]
  };
  return <PolicyDetailsCard data={data} />;
};

export const FinanceQuote = () => {
  const data: PolicyDetailsCardContent = {
    title: 'Unsecured Loan Quote',
    subtitle: 'Vehicle',
    type: 'PERSONAL LOAN',
    policyItems: [
      {
        label: 'Payments',
        value: '$130.17 paying fortnightly'
      },
      {
        label: 'Quote Amount',
        value: '$8,000.00 over 3 years @ 12.25% interest P.A.'
      },
      {
        label: 'Expires',
        value: '22 June 2024'
      },
      {
        label: 'Name',
        value: 'F. Button'
      }
    ],
    actions: [
      {
        type: 'primary',
        label: 'Apply Now',
        link: ''
      }
    ]
  };
  return <PolicyDetailsCard data={data} />;
};
