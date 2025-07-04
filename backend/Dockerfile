FROM python:3.12

WORKDIR /backend

RUN apt-get update && apt-get install -y netcat-openbsd gcc libpq-dev

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "backend.wsgi:application"]
