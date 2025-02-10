import { getComponent } from '@/graphql/getComponent';
import ButtonContainer from './ButtonContainer';
import { render, screen } from '@testing-library/react';

jest.mock('../../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));
jest.mock('../../../utilities/getAccessToken', () => jest.fn());
jest.mock('../../../utilities/auth/ensureServerSession', () => jest.fn());
jest.mock('../../../graphql/getContactDetailsMetadata', () => jest.fn());
jest.mock('../../../graphql/getNameMetadata', () => jest.fn());

jest.mock('../ComponentSwitcher', () => {
  const ComponentSwitcher = (props: { component: any }) => (
    <div>
      {props.component.__typename}-{props.component.sys.id}
    </div>
  );
  return ComponentSwitcher;
});

const mockData = {
  stackTogether: true,
  itemsPerRow: 2,
  largeWidth: 95,
  columnBreakpoint: 'sm',
  gap: 1,
  contentItemsCollection: {
    items: [
      {
        __typename: 'Button',
        sys: {
          id: 1
        }
      },
      {
        __typename: 'Button',
        sys: {
          id: 2
        }
      }
    ]
  }
};

describe('Button Container', () => {
  it('no data returns null', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(null));
    const result = await ButtonContainer({ data: { sys: { id: '1' } } });
    expect(result).toBeNull();
  });
  it('renders multiple items', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(mockData));
    render(<>{await ButtonContainer({ data: { sys: { id: '1' } } })}</>);
    expect(screen.getByText('Button-1')).toBeInTheDocument();
    expect(screen.getByText('Button-2')).toBeInTheDocument();
  });
});
