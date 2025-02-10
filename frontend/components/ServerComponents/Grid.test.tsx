import { getComponent } from '@/graphql/getComponent';
import Grid from './Grid';
import { render, screen } from '@testing-library/react';

jest.mock('../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));
jest.mock('../../utilities/getAccessToken', () => jest.fn());
jest.mock('../../utilities/auth/ensureServerSession', () => jest.fn());
jest.mock('../../graphql/getContactDetailsMetadata', () => jest.fn());
jest.mock('../../graphql/getNameMetadata', () => jest.fn());

jest.mock('./GridItem', () => {
  const GridItem = (props: { data: any }) => (
    <div>
      {props.data.__typename}-{props.data.sys.id}
    </div>
  );
  return GridItem;
});

jest.mock('./ButtonContainer/ButtonContainer', () => {
  const ButtonContainer = (props: { data: any }) => (
    <div>
      {props.data.__typename}-{props.data.sys.id}
    </div>
  );
  return ButtonContainer;
});

const mockData = {
  contentItemsCollection: {
    items: [
      {
        __typename: 'GridItem',
        sys: {
          id: 1
        }
      },
      {
        __typename: 'ButtonContainer',
        sys: {
          id: 2
        }
      }
    ]
  }
};

describe('Grid', () => {
  it('no data returns null', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(null));
    const result = await Grid({ data: { sys: { id: '1' } } });
    expect(result).toBeNull();
  });
  it('renders 1 of each item', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(mockData));
    render(<>{await Grid({ data: { sys: { id: '1' } } })}</>);
    expect(screen.getByText('GridItem-1')).toBeInTheDocument();
    expect(screen.getByText('ButtonContainer-2')).toBeInTheDocument();
  });
});
