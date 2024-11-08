import grpc
from concurrent import futures
import audio_pb2, audio_pb2_grpc
import time
import os
import asyncio

AUDIO_FILES_DIR = '/Users/nicklesydney/Desktop/Coding/Python/Projects/SberRobotics/backend/uploads/'

class SoundExecutionService(audio_pb2_grpc.SoundExecutionServiceServicer):
    def PlayAudio(self, request, context):
        filename = os.path.join(AUDIO_FILES_DIR, request.filename)

        if os.path.exists(filename):
            print(f"Starting playback for audio file: {filename}")

            time.sleep(5)

            return audio_pb2.PlayResponse(success=True, message="Playback started")
        else:
            return audio_pb2.PlayResponse(success=False, message="File not found")

    def _play_audio_file(self, filename):
        """Simulate audio playback asynchronously."""
        print(f"Playing {filename} asynchronously...")
        asyncio.run(asyncio.sleep(5))  # Simulate playback duration
        print(f"Playback finished for {filename}")

# class SoundExecutionService(audio_pb2_grpc.SoundExecutionServiceServicer):
    
#     async def _play_audio_file(self, filename):
#         """Simulate audio playback asynchronously."""
#         print(f"Playing {filename} asynchronously...")
#         await asyncio.sleep(5)  # Simulate playback duration
#         print(f"Playback finished for {filename}")

#     async def PlayAudio(self, request, context):
#         filename = request.filename
#         if os.path.exists(f'/Users/nicklesydney/Desktop/Coding/Python/Projects/SberRobotics/backend/uploads/{filename}'):
#             print(f"Starting playback for audio file: {filename}")
#             response = audio_pb2.PlayResponse(success=True, message="Playback started")
            
#             asyncio.create_task(self._play_audio_file(filename))
#             return response  # Send response immediately
#             # return audio_pb2.PlayResponse(success=True, message="Playback finished")
#         else:
#             return audio_pb2.PlayResponse(success=False, message="File not found")

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    audio_pb2_grpc.add_SoundExecutionServiceServicer_to_server(SoundExecutionService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("Sound Execution Service started on port 50051")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
