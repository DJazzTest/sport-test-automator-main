import { render, screen, fireEvent } from '@testing-library/react';
import { CreateTest } from './CreateTest';

describe('CreateTest', () => {
  it('renders the default test name', () => {
    render(<CreateTest onCreateNew={vi.fn()} />);
    expect(screen.getByDisplayValue('Animation Test Suite')).toBeInTheDocument();
  });

  it('allows entering a custom test name', () => {
    render(<CreateTest onCreateNew={vi.fn()} />);
    const input = screen.getByDisplayValue('Animation Test Suite');
    fireEvent.change(input, { target: { value: 'My Custom Test' } });
    expect(screen.getByDisplayValue('My Custom Test')).toBeInTheDocument();
  });
});
