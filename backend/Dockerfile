FROM python:3.12

WORKDIR /backend

RUN apt-get update && apt-get install -y netcat-openbsd gcc libpq-dev

COPY ./backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .