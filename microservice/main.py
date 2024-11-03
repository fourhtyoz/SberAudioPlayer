# app/main.py
import grpc
from concurrent import futures
import time
from fastapi import FastAPI
from pydub import AudioSegment
from pydub.playback import play
import sound_service_pb2
import sound_service_pb2_grpc

app = FastAPI()

# Implement the SoundService Servicer
class SoundService(sound_service_pb2_grpc.SoundServiceServicer):
    def PlaySound(self, request, context):
        file_name = request.file_name
        try:
            # Load and play the audio file
            audio = AudioSegment.from_file(file_name)
            play(audio)
            return sound_service_pb2.SoundResponse(message="Played successfully", success=True)
        except Exception as e:
            return sound_service_pb2.SoundResponse(message=str(e), success=False)

# gRPC Server Setup
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    sound_service_pb2_grpc.add_SoundServiceServicer_to_server(SoundService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("gRPC server started on port 50051")
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

# Run gRPC server in background
import threading
threading.Thread(target=serve, daemon=True).start()

# app/main.py (continued)

import sound_service_pb2_grpc

@app.post("/play-sound/")
async def play_sound(file_name: str):
    with grpc.insecure_channel("localhost:50051") as channel:
        stub = sound_service_pb2_grpc.SoundServiceStub(channel)
        response = stub.PlaySound(sound_service_pb2.SoundRequest(file_name=file_name))
        return {"message": response.message, "success": response.success}
