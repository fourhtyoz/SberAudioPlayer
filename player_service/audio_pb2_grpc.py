# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import os
import grpc
import warnings

# Проблема с путями для ci/cd и в докере
GITHUB_CICD = os.getenv('GITHUB_CICD')
ENV_LOCAL = os.getenv('ENV_LOCAL')
if GITHUB_CICD or ENV_LOCAL:
    from player_service import audio_pb2 as audio__pb2
else:
    import audio_pb2 as audio__pb2

GRPC_GENERATED_VERSION = '1.67.1'
GRPC_VERSION = grpc.__version__
_version_not_supported = False

try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True

if _version_not_supported:
    raise RuntimeError(
        f'The grpc package installed is at version {GRPC_VERSION},'
        + f' but the generated code in audio_pb2_grpc.py depends on'
        + f' grpcio>={GRPC_GENERATED_VERSION}.'
        + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}'
        + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.'
    )


class SoundExecutionServiceStub(object):
    """Define the services
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.PlayAudio = channel.unary_unary(
                '/audio.SoundExecutionService/PlayAudio',
                request_serializer=audio__pb2.AudioRequest.SerializeToString,
                response_deserializer=audio__pb2.PlayResponse.FromString,
                _registered_method=True)


class SoundExecutionServiceServicer(object):
    """Define the services
    """

    def PlayAudio(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_SoundExecutionServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'PlayAudio': grpc.unary_unary_rpc_method_handler(
                    servicer.PlayAudio,
                    request_deserializer=audio__pb2.AudioRequest.FromString,
                    response_serializer=audio__pb2.PlayResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'audio.SoundExecutionService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
    server.add_registered_method_handlers('audio.SoundExecutionService', rpc_method_handlers)


 # This class is part of an EXPERIMENTAL API.
class SoundExecutionService(object):
    """Define the services
    """

    @staticmethod
    def PlayAudio(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/audio.SoundExecutionService/PlayAudio',
            audio__pb2.AudioRequest.SerializeToString,
            audio__pb2.PlayResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)
