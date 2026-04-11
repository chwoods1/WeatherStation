# Transformer

The Transformer sits in the middle of the pipeline. It receives raw voltage and timestamp data from the Sampler, converts the voltage into a temperature value, and forwards the result to the REST API for storage.

## Tech Stack
- **Python**, Flask
- **Docker**

---

## Endpoints

### POST /transform
Receives a voltage reading, converts it to a temperature, and forwards it to the API.

**Input**

```json
{
  "voltage": 2.42,
  "timestamp": 1775889310.6431897
}
```

**Output**

```json
{
  "temperature": 38.4,
  "timestamp": 1775889310.6431897
}
```

**Parameters**

|       Name | Required |  Type   | Description                                         |
| ----------:|:--------:|:-------:|-----------------------------------------------------|
|  `voltage`  | required | double  | Raw voltage value from the sensor (expected 0–5V)   |
| `timestamp` | required | double  | Unix epoch timestamp of the original sensor reading |

---

## Conversion Formula

Voltage is converted to Celsius using a linear formula based on the sensor's output range:

```
temperature = (voltage - 0.5) * 20
```

| Voltage | Temperature |
|---------|-------------|
| 0.0V    | -10.0°C     |
| 0.5V    | 0.0°C       |
| 1.0V    | 10.0°C      |
| 3.0V    | 50.0°C      |

The result is rounded to 2 decimal places before being forwarded to the API.

---

## Design Decisions

The Transformer is kept as a single-responsibility service — it only converts voltage to temperature and passes it on. This keeps the pipeline modular so the conversion formula can be updated independently of the sensor or storage layer. HTTPS with a self-signed certificate is used to match the security approach of the other services. The `verify=False` flag is set on outbound requests to the API to allow self-signed certificates across the internal Docker network.

---

## Testing

Unit tests are written using Pytest and cover the conversion function directly as well as the HTTP endpoint.

```bash
pytest transformer/test_transformer.py -v
```

**Test Cases**

| Test                  | Description                                      |
|-----------------------|--------------------------------------------------|
| `test_zero_voltage`   | 0.5V should produce exactly 0.0°C               |
| `test_positive_temp`  | 1.0V should produce 10.0°C                      |
| `test_below_baseline` | 0.0V should produce -10.0°C                     |
| `test_rounding`       | Result is rounded to 2 decimal places           |
| `test_valid_post`     | Valid POST returns 200 with temperature in body  |
| `test_missing_voltage`| Missing voltage returns 400                     |
| `test_bad_json`       | Malformed JSON returns 400                      |
| `test_get_not_allowed`| GET on /transform returns 405                   |

The `test_valid_post` test mocks the outbound `requests.post` call to the API so the test runs without needing a live Docker network:

```python
with patch('transformer.requests.post', return_value=mock_response):
    res = client.post('/transform',
        data=json.dumps({'voltage': 1.0, 'timestamp': 1234567890.0}),
        content_type='application/json'
    )
```