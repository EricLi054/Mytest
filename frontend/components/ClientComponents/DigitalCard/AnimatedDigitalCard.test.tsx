import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimatedDigitalCard from './AnimatedDigitalCard';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import useSwipe from '../Hooks/useSwipe';

jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

jest.mock('../Hooks/useSwipe');

const person: PersonInformation = {
  title: 'Mr',
  firstName: 'John',
  surname: 'Doe',
  tier: 'Blue',
  cardColour: 'Blue',
  racId: '12345678',
  membershipCardNumber: '1234567890123456'
};

describe('AnimatedDigitalCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AnimatedDigitalCard person={person} />);
    expect(screen.getByText('Show barcode')).toBeInTheDocument();
  });

  it('toggles barcode visibility on click', () => {
    render(<AnimatedDigitalCard person={person} />);

    const toggleButton = screen.getByText('Show barcode');

    fireEvent.click(toggleButton);
    expect(screen.getByText('Hide barcode')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide barcode'));
    expect(screen.getByText('Show barcode')).toBeInTheDocument();
  });

  it('toggle barcode visibility on swipe when membershipCardNumber is defined', () => {
    const swipeHandlers = {
      onTouchEnd: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchStart: jest.fn()
    };

    jest.mocked(useSwipe).mockReturnValue(swipeHandlers);

    render(<AnimatedDigitalCard person={person} />);

    simulateSwipe(screen.getByTestId('flippable-card'), 40, 1, 100, 1);

    expect(swipeHandlers.onTouchStart).toHaveBeenCalled();
    expect(swipeHandlers.onTouchMove).toHaveBeenCalled();
    expect(swipeHandlers.onTouchEnd).toHaveBeenCalled();
  });

  it('does not toggle barcode visibility on swipe when membershipCardNumber is undefined', () => {
    const swipeHandlers = {
      onTouchEnd: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchStart: jest.fn()
    };

    jest.mocked(useSwipe).mockReturnValue(swipeHandlers);

    render(<AnimatedDigitalCard person={{ ...person, membershipCardNumber: undefined }} />);

    simulateSwipe(screen.getByTestId('flippable-card'), 40, 1, 100, 1);

    expect(swipeHandlers.onTouchStart).not.toHaveBeenCalled();
    expect(swipeHandlers.onTouchMove).not.toHaveBeenCalled();
    expect(swipeHandlers.onTouchEnd).not.toHaveBeenCalled();
  });
});

const simulateSwipe = (element: HTMLElement, startX: number, startY: number, endX: number, endY: number) => {
  fireEvent.touchStart(element, { targetTouches: [{ clientX: startX, clientY: startY }] });
  fireEvent.touchMove(element, { targetTouches: [{ clientX: endX, clientY: endY }] });
  fireEvent.touchEnd(element);
};
