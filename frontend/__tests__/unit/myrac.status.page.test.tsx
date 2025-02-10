import { render, screen } from '@testing-library/react';
import Status from '@/app/myrac/status/page';
import { MyRACThemeProvider } from '@/theme';
import getStatusInformation from '@/graphql/getStatusInformation';
import { type StatusInformation } from '@/types/backendTypes/statusInformation';

jest.mock('../../graphql/getStatusInformation', () => jest.fn());

describe('myRAC Status', () => {
  it('renders status page', async () => {
    const mockInfo: StatusInformation[] = [
      {
        name: 'Person v2',
        status: 'HEALTHY'
      },
      {
        name: 'Finance',
        status: 'DOWN'
      }
    ];
    jest.mocked(getStatusInformation).mockReturnValueOnce(Promise.resolve(mockInfo));
    render(
      <MyRACThemeProvider>
        <>{await Status()}</>
      </MyRACThemeProvider>
    );

    expect(screen.getByText('Person v2')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Down')).toBeInTheDocument();
  });
  it('throws error with no response status page', async () => {
    jest.mocked(getStatusInformation).mockReturnValueOnce(Promise.resolve(null));

    render(
      <MyRACThemeProvider>
        <>{await Status()}</>
      </MyRACThemeProvider>
    );

    expect(screen.getByText('Unable to check system status')).toBeInTheDocument();
  });
});
