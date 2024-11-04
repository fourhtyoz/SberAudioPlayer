from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from queue import Queue
from typing import List, Dict

app = FastAPI()
audio_queue = Queue()


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




# import grpc
# from concurrent import futures
# from player_service.proto import player_pb2_grpc, player_pb2

# class PlayerService(player_pb2_grpc.PlayerServiceServicer):
#     def PlayAudio(self, request, context):
#         print(f"Playing audio: {request.audio_id} from {request.url}")
#         return player_pb2.PlayResponse(success=True)

#     def StopAudio(self, request, context):
#         print("Stopping audio")
#         return player_pb2.StopResponse(success=True)

# def serve():
#     server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
#     player_pb2_grpc.add_PlayerServiceServicer_to_server(PlayerService(), server)
#     server.add_insecure_port('[::]:50051')
#     server.start()
#     server.wait_for_termination()

# if __name__ == '__main__':
#     serve()
