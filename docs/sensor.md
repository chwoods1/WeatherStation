# Sensor

The Sensor is the first step in the pipeline. It simulates a physical weather sensor by generating a realistic voltage reading and returning it alongside a timestamp. Multiple sensor containers run in parallel to support the hot spare pattern used by the Sampler.

## Tech Stack
- **Python**, Flask
- **Docker**

---

## Endpoints

### GET /read
Returns a simulated voltage reading and the current Unix timestamp.

**Output**

```json
{
  "voltage": 2.42,
  "timestamp": 1775889310.6431897
}
```

**Parameters**

|       Name | Type   | Description                                      |
| ----------:|:------:|--------------------------------------------------|
|  `voltage`  | double | Simulated voltage reading, rounded to 2 decimal places |
| `timestamp` | double | Unix epoch time the reading was taken            |

---

## Voltage Simulation

The sensor generates a voltage value that simulates a realistic temperature pattern using a sine wave with added noise:

```python
voltage = 2.5 + 1.5 * math.sin(t / 10) + random.uniform(-0.1, 0.1)
```

- The base value of `2.5V` sits in the middle of the `0–5V` range
- The sine wave (`1.5 * sin(t / 10)`) creates a smooth oscillating pattern, simulating temperature rising and falling over time
- The random noise (`±0.1V`) simulates real-world sensor variation
- `t` increments with each request, advancing the sine wave

This produces voltage values roughly between `0.9V` and `4.1V`, corresponding to temperatures of `8°C` to `72°C` after conversion.

---

## Design Decisions

The sensor is implemented as a simple Flask service with a single endpoint. Using a sine wave rather than pure random values produces more realistic data that rises and falls gradually. Running three identical sensor containers allows the Sampler to implement the hot spare pattern — if one sensor returns a faulty reading, the Sampler moves on to the next. HTTPS with a self-signed certificate is used so all communication in the pipeline is encrypted end to end.

---

## Running Locally

Three sensor containers are started automatically as part of the full stack. They are exposed on the host on ports `5001`, `5002`, and `5003`:

```bash
curl -sk https://localhost:5001/read
curl -sk https://localhost:5002/read
curl -sk https://localhost:5003/read
```