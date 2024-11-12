import grpc
from queue import Queue
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware

# Проблема с путями для ci/cd и в докере
import os
backend_cicd = os.getenv('backend_cicd')
if backend_cicd:
    from . import audio_pb2, audio_pb2_grpc
else:
    import audio_pb2, audio_pb2_grpc


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://frontend:3000", 
                   "http://localhost:3000",
                   "http://0.0.0.0:3000", 
                   "http://127.0.0.1:3000",
                   "http://player:8001", 
                   "http://localhost:8001",
                   "http://0.0.0.0:8001",
                   "http://127.0.0.1:8001",
                   "http://sounds:50051", 
                   "http://localhost:50051",
                   "http://0.0.0.0:50051", 
                   "http://127.0.0.1:50051"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
audio_queue = Queue()
SOUND_EXECUTION_SERVICE_ADDRESS = "sounds:50051"


@app.post("/add-audio/")
async def add_audio_to_queue(user: str = Form(...), file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Неправильный тип файла")

    file_content = await file.read()
    audio_queue.put({'filename': file.filename, 'content': file_content, 'user': user})

    response = {"message": "Файл был успешно добавлен в очередь"}
    return response


@app.post('/delete-audio/')
async def play_audio(index: str):
    global audio_queue
    new_queue = Queue()
    current_queue = list(audio_queue.queue)
    try:
        index = int(index)
        current_queue.pop(index)
        for item in current_queue:
            new_queue.put(item)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Не удалось удалить #{index}')

    audio_queue = new_queue
    response = {"message": f"#{index} файл был удален из очереди"}
    return response


@app.get('/get_current_queue/')
async def get_queue():
    queue_list = list(audio_queue.queue)
    response = []
    for item in queue_list:
        if item.get('filename'):
            response.append({'filename': item.get('filename'), 'user':  item.get('user')})
    return response


@app.get('/play-audio/')
async def play_audio(filename: str):
    async with grpc.aio.insecure_channel(SOUND_EXECUTION_SERVICE_ADDRESS) as channel:
        stub = audio_pb2_grpc.SoundExecutionServiceStub(channel)
        request = audio_pb2.AudioRequest(filename=filename)
        try:
            response = await stub.PlayAudio(request)
            print('response', response)
            if response.success:
                print(f"Успешное начало воспроизведения: {filename}")
                response = f"Успешное начало воспроизведения: {filename}"
                return response
            else:
                print(f"Не удалось воспроизвести файл: {response.message}")
                response = f"Не удалось воспроизвести файл: {response.message}"
                return response
        except grpc.RpcError as e:
            raise HTTPException(status_code=500, detail=f"gRPC error: {e}")
