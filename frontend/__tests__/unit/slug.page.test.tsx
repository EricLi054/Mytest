import { render, screen } from '@testing-library/react';
import getData from '@/graphql/getData';
import { ThemeProvider, createTheme } from '@mui/material';
import { themeOptions } from '@racwa/react-components';
import Slug from '@/app/[...slug]/page';
import { getCrmId } from '../../utilities/getCrmId';
import { notFound, redirect } from 'next/navigation';
import { getAccessToken } from '@/utilities/getAccessToken';
import { errorPage } from '@/utilities/errorPage';
import { NON_MEMBER_TYPE } from '@/types/backendTypes/personInformation';
import getADB2CAccount from '@/graphql/getADB2CAccount';

jest.mock('../../graphql/getData', () => jest.fn());
jest.mock('../../utilities/getAccessToken', () => ({
  getAccessToken: jest.fn()
}));
jest.mock('../../utilities/getCrmId', () => ({
  getCrmId: jest.fn()
}));
jest.mock('../../utilities/auth/ensureServerSession', () => jest.fn());
jest.mock('../../graphql/getContactDetailsMetadata', () => jest.fn());
jest.mock('../../graphql/getNameMetadata', () => jest.fn());
jest.mock('../../graphql/getPerson', () => jest.fn());
jest.mock('../../graphql/getUnmaskedAddress', () => jest.fn());
jest.mock('../../graphql/getADB2CAccount', () => jest.fn());

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  notFound: jest.fn()
}));

jest.mock('../../app/[...slug]/LandingPage', () => {
  const LandingPage = ({ pageData }: { pageData: any }) => <div>{pageData.__typename}</div>;
  return LandingPage;
});

jest.mock('../../app/[...slug]/StandardErrorPage', () => {
  const StandardErrorPage = ({ pageData }: { pageData: any }) => <div>{pageData.__typename}</div>;
  return StandardErrorPage;
});

const mockLandingPage = {
  data: {
    page: {
      items: [
        {
          __typename: 'LandingPage'
        }
      ]
    }
  }
};

const mockStandardErrorPage = {
  data: {
    page: {
      items: [
        {
          __typename: 'StandardErrorPage'
        }
      ]
    }
  }
};

const mockData = {
  data: {
    page: {
      items: [
        {
          noLinkRedirect: '/find-my-products'
        }
      ]
    }
  }
};

const mockNotFoundData = {
  data: {
    page: null
  }
};

const mockMissingPersonData = {
  person: {
    firstName: null
  },
  data: null
};

const mockLapsedPersonData = {
  person: {
    firstName: 'John',
    membershipType: NON_MEMBER_TYPE
  },
  data: {}
};

describe('Slug Page', () => {
  it('redirects to product linking page with no crmid', async () => {
    jest.mocked(getCrmId).mockReturnValue(Promise.resolve(undefined)); // no crmid
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify(mockData)] }));
    jest.mocked(getADB2CAccount).mockReturnValue(Promise.resolve({ crmId: '' })); // no crmid in adb2c
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{await Slug({ params: { slug: ['myrac'] } })}</>
      </ThemeProvider>
    );
    expect(jest.mocked(redirect)).toHaveBeenCalledWith('/find-my-products');
  });

  it('redirects to sign in page after product linking', async () => {
    jest.mocked(getCrmId).mockReturnValue(Promise.resolve(undefined)); // no crmid
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify(mockData)] }));
    jest.mocked(getADB2CAccount).mockReturnValue(Promise.resolve({ crmId: '1234' })); // has crmid in adb2c
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{await Slug({ params: { slug: ['myrac'] } })}</>
      </ThemeProvider>
    );
    expect(jest.mocked(redirect)).toHaveBeenCalledWith('/signIn?callbackUrl=/myrac&refresh=true');
  });

  it('redirects to not found', async () => {
    jest
      .mocked(getData)
      .mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify(mockNotFoundData)] }));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{await Slug({ params: { slug: ['myrac'] } })}</>
      </ThemeProvider>
    );
    expect(jest.mocked(notFound)).toHaveBeenCalled();
  });

  it('Logs and throws an error if no data returned', async () => {
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(undefined));
    console.error = jest.fn();

    await expect(Slug({ params: { slug: ['myrac'] } })).rejects.toThrow('No data returned from CMS');

    expect(console.error).toHaveBeenCalledWith('Error: [...slug]/page.tsx Slug: myrac');
  });

  it('redirects to not found when personName data is missing', async () => {
    jest.mocked(getCrmId).mockReturnValue(Promise.resolve('someCrmId')); // crmid is available
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify(mockData)] }));
    jest.mocked(getAccessToken).mockReturnValueOnce(Promise.resolve('{ "crmid": "crmid" }'));
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(mockMissingPersonData)); // mock the person name data response

    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{await Slug({ params: { slug: ['myrac'] } })}</>
      </ThemeProvider>
    );

    expect(jest.mocked(redirect)).toHaveBeenCalledWith(errorPage.somethingWentWrong);
  });

  it('redirects to lapsed when membership is lapsed', async () => {
    jest.mocked(getCrmId).mockReturnValue(Promise.resolve('someCrmId')); // crmid is available
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify(mockData)] }));
    jest.mocked(getAccessToken).mockReturnValueOnce(Promise.resolve('{ "crmid": "crmid" }'));
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(mockLapsedPersonData)); // mock the person name data response

    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{await Slug({ params: { slug: ['myrac'] } })}</>
      </ThemeProvider>
    );

    expect(jest.mocked(redirect)).toHaveBeenCalledWith(errorPage.membershipLapsed);
  });

  it('renders a landing page', async () => {
    jest
      .mocked(getData)
      .mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify(mockLandingPage)] }));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{await Slug({ params: { slug: ['myrac'] } })}</>
      </ThemeProvider>
    );
    expect(screen.getByText('LandingPage')).toBeInTheDocument();
  });

  it('renders a standard error page', async () => {
    jest
      .mocked(getData)
      .mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify(mockStandardErrorPage)] }));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{await Slug({ params: { slug: ['error'] } })}</>
      </ThemeProvider>
    );
    expect(screen.getByText('StandardErrorPage')).toBeInTheDocument();
  });
});
