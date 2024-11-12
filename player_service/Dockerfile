FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y python3.11 python3-pip && \
    apt-get clean

WORKDIR /player_service

COPY requirements.txt /player_service

RUN pip install --no-cache-dir -r requirements.txt

COPY . /player_service

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
# CMD ["fastapi", "dev", "main.py", "--port", "8001"]

