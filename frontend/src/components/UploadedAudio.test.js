import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadedAudio from './UploadedAudio';
import { api } from '../utils/api';
import alertify from 'alertifyjs';


jest.mock('alertifyjs', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../utils/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('UploadedAudio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders file info and delete button', () => {
    render(<UploadedAudio index={0} filename="test.mp3" user="Test User" disabled={false} isPlaying={false} />);

    expect(screen.getByText('Название: test.mp3')).toBeInTheDocument();
    expect(screen.getByText('Загрузил: Test User')).toBeInTheDocument();
    expect(screen.getByText('Удалить')).toBeInTheDocument();
  });

  test('displays PlayingAnimation when isPlaying is true', () => {
    render(<UploadedAudio index={0} filename="test.mp3" user="Test User" disabled={false} isPlaying={true} />);

    expect(screen.getByTitle('Воспроизводится')).toBeInTheDocument();
  });

  test('calls api.post and shows success message when file is deleted successfully', async () => {
    const mockFile = "test.mp3";
    const mockUser = "Test User";
    
    api.post.mockResolvedValueOnce({ status: 200 });

    render(<UploadedAudio index={0} filename={mockFile} user={mockUser} disabled={false} isPlaying={false} />);

    fireEvent.click(screen.getByText('Удалить'));

    await waitFor(() => {
      expect(alertify.success).toHaveBeenCalledWith(`Файл ${mockFile} был удален из очереди`);
    });
  });

  test('shows error message when API request fails', async () => {
    const mockFile = "test.mp3";
    const mockUser = "Test User";
    
    api.post.mockRejectedValueOnce({ response: { data: { detail: 'Error' } } });

    render(<UploadedAudio index={0} filename={mockFile} user={mockUser} disabled={false} isPlaying={false} />);

    fireEvent.click(screen.getByText('Удалить'));

    await waitFor(() => {
      expect(alertify.error).toHaveBeenCalledWith(`Ошибка при удалении файл ${mockFile} из очереди: Error`);
    });
  });

  test('does not trigger the delete function when the button is disabled', () => {
    const mockFile = "test.mp3";
    const mockUser = "Test User";
    
    api.post.mockResolvedValueOnce({ status: 200 });

    render(<UploadedAudio index={0} filename={mockFile} user={mockUser} disabled={true} isPlaying={false} />);
    
    fireEvent.click(screen.getByText('Удалить'));
    
    expect(api.post).not.toHaveBeenCalled();
  });
});
