import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PlayingAnimation from './PlayingAnimation';


describe('AudioAnimation Component', () => {
  test('renders without crashing', () => {
    render(<PlayingAnimation />);
    
    expect(screen.getByTitle('Воспроизводится')).toBeInTheDocument();
    expect(screen.getByTitle('Воспроизводится').querySelectorAll('.bar')).toHaveLength(5);
  });

  test('has correct styles applied', () => {
    render(<PlayingAnimation />);

    screen.getByTitle('Воспроизводится').querySelectorAll('.bar').forEach(bar => {
      expect(bar).toHaveStyle('animation: bounce 0.5s ease infinite alternate');
      expect(bar).toHaveStyle('background-color: #4caf50');
      expect(bar).toHaveStyle('border-radius: 2px');
    });
  });

  test('has the correct title and container structure', () => {
    render(<PlayingAnimation />);
    
    expect(screen.getByTitle('Воспроизводится')).toHaveClass('audio-visualizer');
    expect(screen.getByTitle('Воспроизводится')).toBeInTheDocument();
  });
});
