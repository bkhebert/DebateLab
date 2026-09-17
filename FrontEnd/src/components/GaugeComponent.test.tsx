import { render, screen, act } from '@testing-library/react';
import GaugeComponent from './GaugeComponent';

// GaugeComponent animates its ring fill via setInterval, 1 unit/100ms, up to
// floor(percentage * 0.75), then displays floor(<that value> / 0.75). Using
// fake timers so the test doesn't take multiple real seconds per case.
describe('GaugeComponent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('animates up to and displays a percentage that round-trips cleanly', () => {
    render(<GaugeComponent percentage={40} />);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.getByText('40 %')).toBeInTheDocument();
  });

  it('stops animating once the target is reached (no runaway interval)', () => {
    render(<GaugeComponent percentage={40} />);

    act(() => {
      jest.advanceTimersByTime(4000);
    });
    const textAtTarget = screen.getByText('40 %').textContent;

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText('40 %').textContent).toBe(textAtTarget);
  });

  it('KNOWN BUG: the display math does not round-trip for every input', () => {
    // floor(floor(10 * 0.75) / 0.75) = floor(7 / 0.75) = 9, not 10. Pinned
    // here (per the Phase 1 audit) so a future fix to this formula is a
    // deliberate, visible change rather than a silent behavior shift.
    render(<GaugeComponent percentage={10} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('9 %')).toBeInTheDocument();
    expect(screen.queryByText('10 %')).not.toBeInTheDocument();
  });
});
