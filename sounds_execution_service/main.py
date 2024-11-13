import os
import grpc
from concurrent import futures
import audio_pb2, audio_pb2_grpc
import time


AUDIO_FILES_DIR = '/tmp/uploads/'


class SoundExecutionService(audio_pb2_grpc.SoundExecutionServiceServicer):
    def PlayAudio(self, request, context):
        filename = os.path.join(AUDIO_FILES_DIR, request.filename)

        if os.path.exists(filename):
            print(f"Starting playback for audio file: {filename}")

            time.sleep(5) # имитируем воспроизведение аудио

            return audio_pb2.PlayResponse(success=True, message="Playback started")
        else:
            return audio_pb2.PlayResponse(success=False, message="File not found")

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    audio_pb2_grpc.add_SoundExecutionServiceServicer_to_server(SoundExecutionService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("Sound Execution Service started on port 50051")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
