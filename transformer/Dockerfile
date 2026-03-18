FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y openssl && \
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes \
    -subj "/CN=transformer" && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
COPY sensor.py .
CMD ["python", "transformer.py"]