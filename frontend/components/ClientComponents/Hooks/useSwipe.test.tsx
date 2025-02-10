import { render, screen, fireEvent } from '@testing-library/react';
import useSwipe, { type SwipeInput } from './useSwipe';

describe('useSwipe', () => {
  let onSwipedLeft: jest.Mock;
  let onSwipedRight: jest.Mock;
  let onSwipedUp: jest.Mock;
  let onSwipedDown: jest.Mock;
  let swipeInput: SwipeInput;

  beforeEach(() => {
    onSwipedLeft = jest.fn();
    onSwipedRight = jest.fn();
    onSwipedUp = jest.fn();
    onSwipedDown = jest.fn();

    swipeInput = {
      onSwipedLeft,
      onSwipedRight,
      onSwipedUp,
      onSwipedDown
    };
  });

  const SwipeableComponent = ({ swipeInput }: { swipeInput: SwipeInput }) => {
    const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(swipeInput);
    return (
      <div
        style={{ height: '500px', width: '500px' }}
        data-testid='test-div'
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    );
  };

  it('should call onSwipedLeft when swiped left', () => {
    render(<SwipeableComponent swipeInput={swipeInput} />);
    const div = screen.getByTestId('test-div');

    fireEvent.touchStart(div, { targetTouches: [{ clientX: 100, clientY: 1 }] });
    fireEvent.touchMove(div, { targetTouches: [{ clientX: 40, clientY: 1 }] });
    fireEvent.touchEnd(div);

    expect(onSwipedLeft).toHaveBeenCalled();
    expect(onSwipedRight).not.toHaveBeenCalled();
    expect(onSwipedUp).not.toHaveBeenCalled();
    expect(onSwipedDown).not.toHaveBeenCalled();
  });

  it('should call onSwipedRight when swiped right', () => {
    render(<SwipeableComponent swipeInput={swipeInput} />);
    const div = screen.getByTestId('test-div');

    fireEvent.touchStart(div, { targetTouches: [{ clientX: 40, clientY: 1 }] });
    fireEvent.touchMove(div, { targetTouches: [{ clientX: 100, clientY: 1 }] });
    fireEvent.touchEnd(div);

    expect(onSwipedRight).toHaveBeenCalled();
    expect(onSwipedLeft).not.toHaveBeenCalled();
    expect(onSwipedUp).not.toHaveBeenCalled();
    expect(onSwipedDown).not.toHaveBeenCalled();
  });

  it('should call onSwipedUp when swiped up', () => {
    render(<SwipeableComponent swipeInput={swipeInput} />);
    const div = screen.getByTestId('test-div');

    fireEvent.touchStart(div, { targetTouches: [{ clientX: 1, clientY: 100 }] });
    fireEvent.touchMove(div, { targetTouches: [{ clientX: 1, clientY: 40 }] });
    fireEvent.touchEnd(div);

    expect(onSwipedUp).toHaveBeenCalled();
    expect(onSwipedLeft).not.toHaveBeenCalled();
    expect(onSwipedRight).not.toHaveBeenCalled();
    expect(onSwipedDown).not.toHaveBeenCalled();
  });

  it('should call onSwipedDown when swiped down', () => {
    render(<SwipeableComponent swipeInput={swipeInput} />);
    const div = screen.getByTestId('test-div');

    fireEvent.touchStart(div, { targetTouches: [{ clientX: 1, clientY: 40 }] });
    fireEvent.touchMove(div, { targetTouches: [{ clientX: 1, clientY: 100 }] });
    fireEvent.touchEnd(div);

    expect(onSwipedDown).toHaveBeenCalled();
    expect(onSwipedLeft).not.toHaveBeenCalled();
    expect(onSwipedRight).not.toHaveBeenCalled();
    expect(onSwipedUp).not.toHaveBeenCalled();
  });
});
