import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Queue from "./Queue";
import { api } from "../utils/api";
import alertify from 'alertifyjs';


jest.mock('alertifyjs', () => ({
    success: jest.fn(),
    error: jest.fn(),
  }));

jest.mock('../utils/api', () => ({
    api: {
      post: jest.fn(),
      get: jest.fn(),
    },
  }));

describe("Queue Component", () => {
    let mockWebSocket;
    beforeEach(() => {
        jest.clearAllMocks();
        api.get.mockResolvedValue({});

        mockWebSocket = {
            onmessage: null,
            onerror: null,
            close: jest.fn(),
        };

        global.WebSocket = jest.fn(() => mockWebSocket);

    });

    test("displays 'Пока в очереди ничего нет' when queue is empty", () => {
        render(<Queue />);
        
        expect(screen.getByText("Пока в очереди ничего нет")).toBeInTheDocument();
    });

    test("updates queue when a WebSocket message is received", async () => {
        const queueData = [{ filename: "audio1.mp3", user: "user1" }];
        
        render(<Queue />);

        act(() => {
            mockWebSocket.onmessage({ data: JSON.stringify(queueData) });
        });

        await waitFor(() => {
            expect(screen.getByText("Название: audio1.mp3")).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText("Загрузил: user1")).toBeInTheDocument();
        });
    });

    test("displays error message when WebSocket sends an error message", async () => {
        render(<Queue />);

        const errorMessage = "Ошибка при загрузке";
        
        act(() => {
            mockWebSocket.onmessage({ data: JSON.stringify({ error: errorMessage }) });
        });

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        })
    });

    test("plays audio queue and updates item states", async () => {
        const queueData = [
            { filename: "audio1.mp3", user: "user1" },
            { filename: "audio2.mp3", user: "user2" },
        ];
        
        render(<Queue />);

        act(() => {
            mockWebSocket.onmessage({ data: JSON.stringify(queueData) });
        });

        const playButton = screen.getByText("Воспроизвести очередь");
        fireEvent.click(playButton);

        expect(alertify.success).toHaveBeenCalledWith("Начало воспроизведения очереди");
        
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/play-audio/?filename=audio1.mp3");
        })
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/play-audio/?filename=audio2.mp3");
        })
        await waitFor(() => {
            expect(alertify.error).not.toHaveBeenCalled();
        })
    });

    test("shows error alert if audio playback fails", async () => {
        api.get.mockRejectedValue({ response: { data: { detail: "Playback error" } } });
        
        const queueData = [{ filename: "audio1.mp3", user: "user1" }];
        
        render(<Queue />);

        act(() => {
            mockWebSocket.onmessage({ data: JSON.stringify(queueData) });
        });

        const playButton = screen.getByText("Воспроизвести очередь");
        fireEvent.click(playButton);

        await waitFor(() => {
            expect(alertify.error).toHaveBeenCalledWith("Ошибка воспроизведения audio1.mp3: Playback error");
        });
    });
});
