import grpc
from concurrent import futures
import audio_pb2, audio_pb2_grpc
import time
import os

class SoundExecutionService(audio_pb2_grpc.SoundExecutionServiceServicer):
    def PlayAudio(self, request, context):
        filename = request.filename
        if os.path.exists(f'/Users/nicklesydney/Desktop/Coding/Python/Projects/SberRobotics/backend/uploads/{filename}'):
            # audio_pb2.PlayResponse(success=True, message="Playing")
            time.sleep(5)  # Simulate playback time
            return audio_pb2.PlayResponse(success=True, message="Playback finished")
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
