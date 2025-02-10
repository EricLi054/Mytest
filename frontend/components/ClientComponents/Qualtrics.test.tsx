// Qualtrics.test.tsx

import { render } from '@testing-library/react';
import Qualtrics from './Qualtrics';

jest.mock('next/script', () => {
  const MockScript: React.FC<any> = ({ children }) => <div data-testid='mock-script'>{children}</div>;
  MockScript.displayName = 'NextScript';
  return MockScript;
});

describe('Qualtrics Component', () => {
  it('renders Qualtrics Script', () => {
    const { getByTestId } = render(<Qualtrics />);
    const mockScript = getByTestId('mock-script'); // Get the mocked script element
    expect(mockScript).toBeInTheDocument();
  });
});
