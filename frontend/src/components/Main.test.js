import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Main from './Main';


jest.mock('./Login', () => () => <div>Mocked Login Component</div>);
jest.mock('./AudioDropzone', () => () => <div>Mocked AudioDropzone Component</div>);
jest.mock('./Queue', () => () => <div>Mocked Queue Component</div>);

describe('Main Component', () => {
  test('renders Login component when user is not authenticated', () => {
    render(<Main isAuthenticated={false} login={jest.fn()} />);

    expect(screen.getByText('Чтобы воспользоваться сервисом, необходимо войти или зарегистрироваться')).toBeInTheDocument();
    expect(screen.getByText('Mocked Login Component')).toBeInTheDocument();
  });

  test('renders AudioDropzone and Queue components when user is authenticated', () => {
    render(<Main isAuthenticated={true} login={jest.fn()} />);

    expect(screen.getByText('Mocked AudioDropzone Component')).toBeInTheDocument();
    expect(screen.getByText('Mocked Queue Component')).toBeInTheDocument();
    expect(screen.queryByText('Чтобы воспользоваться сервисом, необходимо войти или зарегистрироваться')).toBeNull();
  });
});
