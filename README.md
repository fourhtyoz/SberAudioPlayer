# SberAudioPlayer

## Запуск через Docker

```
git clone https://github.com/fourhtyoz/SberAudioPlayer.git
cd SberAudioPlayer
docker-compose up --build
```

После запуска всех сервисов интерфейс доступен по адресу: ```http://localhost:3000```

Сервисы логируют информацию в консоли и в docker logs.

## Запуск для разработки

#### Скачать проект:

```
git clone https://github.com/fourhtyoz/SberAudioPlayer.git
cd SberAudioPlayer
```
#### Создание окружения:

```
virtualenv venv
source venv/bin/activate
```

#### Скачать библиотеки для всех сервисов:

Для удобства все dependencies собраны в один requirements.txt

```
pip install -r requirements.txt
```

#### БД:

```
docker pull postgres:17
docker run -d \
  --name db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:1`
```

#### Backend (localhost:8000):

```
cd backend
export ENV_LOCAL=1 && fastapi dev main.py
```

#### Frontend (localhost:3000):

```
cd frontend
npm install
npm run start
```

#### Player_service (localhost:8001):

```
cd player_service
export ENV_LOCAL=1 && fastapi dev main.py --port 8001
```

#### Sounds_execution_service (localhost:50051)

```
cd sounds_execution_service
python main.py
```

## Тесты

Есть тесты ```GitHub Workflow```, которые запускаются при пуше в ```main```: тестируются React компоненты с помощью ```jest``` и ```player_service``` с помощью ```pytest```.

## Загрузка файлов

Файлы загружаются в ```/tmp/uploads```.

## Воспроизведение звуков

В сервисе ```sounds_execution_service``` стоит ```time.sleep(5)``` для имитации воспроизведения звука. 

На фронте  воспроизведение звука отображается при помощи анимации.

## Переменные среды

При запуске для разработки нужно проставить ```ENV_LOCAL=1```

При запуске тестов проставляется ```GITHUB_CICD=1```

При запуске через docker-compose эти переменные не используются.