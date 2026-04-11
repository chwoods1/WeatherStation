# API

The REST API is the final step in the pipeline. It receives temperature data from the Transformer and stores it in a PostgreSQL database.

## Tech Stack
- **Python**, Flask
- **PostgreSQL**
- **Docker**

---

## Endpoints

### POST /temperature
Receives a temperature reading from the Transformer and stores it in the database.

**Input**

```json
{
  "temperature": 24.5,
  "timestamp": 1775889310.6431897
}
```

**Output**

```json
{
  "status": "stored",
  "id": 104
}
```

**Parameters**

|          Name | Required |  Type   | Description                                           |
| -------------:|:--------:|:-------:|-------------------------------------------------------|
|  `temperature` | required | double  | Temperature value in Celsius                          |
|    `timestamp` | required | double  | Unix epoch timestamp of the original sensor reading   |

---

### GET /temperature
Returns stored temperature readings, newest first.

**Query Parameters**

|    Name | Required |  Type   | Description                              |
| -------:|:--------:|:-------:|------------------------------------------|
| `limit` | optional | integer | Number of records to return (default 100)|

**Output**

```json
[
  {
    "id": 104,
    "temperature": 24.5,
    "timestamp": 1775889310.6431897
  }
]
```

---

### GET /health
Returns the health status of the API service.

**Output**
```json
{ "status": "ok" }
```

---

## Database Schema

| Column      | Type         | Description                   |
|-------------|--------------|-------------------------------|
| id          | SERIAL       | Auto-incrementing primary key |
| temperature | NUMERIC(6,2) | Temperature value in Celsius  |
| timestamp   | TIMESTAMPTZ  | Time of the sensor reading    |

---

## Design Decisions

The API was implemented using Python and Flask for simplicity and readability. PostgreSQL was chosen as the database because it is reliable and integrates cleanly with Docker. The timestamp is stored as a Unix epoch float, matching the native format produced by the sensor rather than converting it. HTTPS is used for all communication to match the security approach of the other pipeline services.

---

## Running Locally

The API runs inside Docker as part of the full stack. It is available on port `7000` on the host machine.

```bash
curl -sk https://localhost:7000/health
```

To view stored readings in the database directly:

```bash
docker exec -it weather-station-db-1 psql -U postgres -d temperatures_db \
  -c "SELECT * FROM readings ORDER BY timestamp DESC LIMIT 10;"
```

---

## Testing

The integration test in the CI/CD pipeline sends a real POST request to the API after the full stack is started:

```bash
curl -sk -X POST https://localhost:7000/temperature \
  -H "Content-Type: application/json" \
  -d '{"temperature": 24.5, "timestamp": 1775889310.6431897}'
```