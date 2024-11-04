from fastapi import FastAPI, UploadFile, File, HTTPException
from queue import Queue
from typing import List, Dict
import grpc
from player_service import audio_pb2, audio_pb2_grpc


app = FastAPI()
audio_queue = Queue()
SOUND_EXECUTION_SERVICE_ADDRESS = "localhost:50051"


@app.post("/add-audio/")
async def add_audio_to_queue(file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    file_content = await file.read()
    audio_queue.put({"filename": file.filename, "content": file_content})

    response = {"message": "File added to queue successfully"}
    return response


@app.get('/get_current_queue/')
async def get_queue() -> List[Dict[str, str]]:
    queue_list = list(audio_queue.queue)
    response = []
    for item in queue_list:
        if item.get('filename'):
            response.append({'filename': item.get('filename')})
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
                print(f"Successfully started playback: {filename}")
            else:
                print(f"Failed to play audio: {response.message}")
        except grpc.RpcError as e:
            raise HTTPException(status_code=500, detail=f"gRPC error: {e}")

# # Main loop to process the queue
# async def process_queue():
#     while True:
#         if not audio_queue.empty():
#             filename = audio_queue.get()
#             await play_audio(filename)
#         else:
#             await asyncio.sleep(1)  # Wait before checking the queue again