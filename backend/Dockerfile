FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y libgl1 libglib2.0-0 && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt

RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]