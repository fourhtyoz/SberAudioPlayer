import pytest
from io import BytesIO
from player_service.main import app
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import grpc


@pytest.fixture()
def client():
    with TestClient(app) as client:
        yield client

# ADD
def test_add_audio_to_queue(client):
    audio_file = BytesIO(b"dummy audio content")
    audio_file.name = "test_audio.mp3"
    
    response = client.post(
        "/add-audio/",
        files={"file": ("test_audio.mp3", audio_file, "audio/mpeg")},
        data={"user": "test_user"}
    )
    
    assert response.status_code == 200
    assert response.json() == {"message": "Файл был успешно добавлен в очередь"}


def test_invalid_file_type(client):
    text_file = BytesIO(b"dummy text content")
    text_file.name = "test_file.txt"

    response = client.post(
        "/add-audio/",
        files={"file": ("test_file.txt", text_file, "text/plain")},
        data={"user": "test_user"}
    )
    
    assert response.status_code == 400
    assert response.json() == {"detail": "Неправильный тип файла"}


def test_missing_file(client):
    response = client.post("/add-audio/", data={"user": "test_user"})
    
    assert response.status_code == 422
    assert "file" in response.json()["detail"][0]["loc"]

# GET
def test_get_current_queue(client):
    response = client.get('/get_current_queue/')
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]['filename'] == 'test_audio.mp3'
    assert response.json()[0]['user'] == 'test_user'

# DELETE
def test_delete_audio(client):
    response = client.post('/delete-audio/?index=0')

    assert response.status_code == 200
    assert response.json().get('message') == '#0 файл был удален из очереди'


def test_delete_audio_invalid_index(client):
    index = 'invalid'
    response = client.post(f'/delete-audio/?index={index}')

    assert response.status_code == 400
    assert response.json().get('message') == None
    assert response.json().get('detail') == f'Не удалось удалить #{index}'


def test_delete_audio_out_of_range(client):
    index = 10
    response = client.post(f'/delete-audio/?index={index}')

    assert response.status_code == 400
    assert response.json().get('message') == None
    assert response.json().get('detail') == f'Не удалось удалить #{index}'


def test_delete_audio_empty_queue(client):
    index = 0
    response = client.post(f'/delete-audio/?index={index}')

    assert response.status_code == 400
    assert response.json().get('message') == None
    assert response.json().get('detail') == f'Не удалось удалить #{index}'

# GRPC
@patch('player_service.audio_pb2_grpc.SoundExecutionServiceStub')
def test_play_audio_success(mock_stub, client):
    mock_response = AsyncMock()
    mock_response.success = True
    mock_response.message = "File playing successfully"

    mock_stub.return_value.PlayAudio = AsyncMock(return_value=mock_response)

    filename = 'test_audio.mp3'
    response = client.get(f'/play-audio/?filename={filename}')

    assert response.status_code == 200
    assert 'Успешное начало воспроизведения' in response.text


@patch('player_service.audio_pb2_grpc.SoundExecutionServiceStub')
def test_play_audio_failure(mock_stub, client):
    mock_response = AsyncMock()
    mock_response.success = False
    mock_response.message = "Failed to play audio"

    mock_stub.return_value.PlayAudio = AsyncMock(return_value=mock_response)

    filename = 'test_audio.mp3'
    response = client.get(f'/play-audio/?filename={filename}')

    assert response.status_code == 200
    assert 'Не удалось воспроизвести файл' in response.text


@patch('player_service.audio_pb2_grpc.SoundExecutionServiceStub')
def test_play_audio_grpc_error(mock_stub, client):
    mock_stub.return_value.PlayAudio.side_effect = grpc.RpcError("gRPC error")

    filename = 'test_audio.mp3'
    response = client.get(f'/play-audio/?filename={filename}')

    assert response.status_code == 500
    assert 'gRPC error' in response.json()['detail']
