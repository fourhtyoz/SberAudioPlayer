import queue

current_queue = queue.Queue()

def add_to_queue(audio_id, url):
    current_queue.put({"audio_id": audio_id, "url": url})
    return True

def get_current_queue():
    return list(current_queue.queue)