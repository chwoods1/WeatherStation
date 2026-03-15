FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY sensor.py .
CMD ["python", "sensor.py"]