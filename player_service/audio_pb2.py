# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: audio.proto
# Protobuf Python Version: 5.27.2
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    27,
    2,
    '',
    'audio.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0b\x61udio.proto\x12\x05\x61udio\" \n\x0c\x41udioRequest\x12\x10\n\x08\x66ilename\x18\x01 \x01(\t\"0\n\x0cPlayResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\x12\x0f\n\x07message\x18\x02 \x01(\t2N\n\x15SoundExecutionService\x12\x35\n\tPlayAudio\x12\x13.audio.AudioRequest\x1a\x13.audio.PlayResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'audio_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_AUDIOREQUEST']._serialized_start=22
  _globals['_AUDIOREQUEST']._serialized_end=54
  _globals['_PLAYRESPONSE']._serialized_start=56
  _globals['_PLAYRESPONSE']._serialized_end=104
  _globals['_SOUNDEXECUTIONSERVICE']._serialized_start=106
  _globals['_SOUNDEXECUTIONSERVICE']._serialized_end=184
# @@protoc_insertion_point(module_scope)