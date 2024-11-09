import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import useIsMobile from './useIsMobile';


describe('useIsMobile hook', () => {
  beforeEach(() => {
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
  });

  const TestComponent = () => {
    const isMobile = useIsMobile();
    return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
  };

  test('should return "Desktop" when window width is greater than 768px', () => {
    render(<TestComponent />);
    
    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });

  test('should update state when window is resized', () => {
    render(<TestComponent />);
    
    expect(screen.getByText('Desktop')).toBeInTheDocument();
    
    act(() => {
        global.innerWidth = 600;
        global.dispatchEvent(new Event('resize'));
    })

    render(<TestComponent />);
    
    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });
});
