FROM python:3.11-slim

WORKDIR /sounds_execution_service

COPY requirements.txt /sounds_execution_service

RUN pip install --no-cache-dir -r requirements.txt

COPY . /sounds_execution_service

EXPOSE 50051
CMD ["python", "main.py"]

