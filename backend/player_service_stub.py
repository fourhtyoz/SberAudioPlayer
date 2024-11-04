import grpc
from player_service.proto import player_pb2, player_pb2_grpc


def play_audio(audio_id, url):
    with grpc.insecure_channel('player_service:50051') as channel:
        stub = player_pb2_grpc.PlayerServiceStub(channel)
        response = stub.PlayAudio(player_pb2.AudioRequest(audio_id=audio_id, url=url))
        return response.success


def stop_audio():
    with grpc.insecure_channel('player_service:50051') as channel:
        stub = player_pb2_grpc.PlayerServiceStub(channel)
        response = stub.StopAudio(player_pb2.EmptyRequest())
        return response.success
