FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y python3.11 python3-pip && \
    apt-get clean

WORKDIR /backend

COPY requirements.txt /backend

RUN pip install --no-cache-dir -r requirements.txt
    
COPY . /backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# CMD ["fastapi", "dev", "main.py"]


