# Weather Station

# Sampler

Our sampler takes the data from our sensors and make sure that it is formatted in the correct way. It will look at the data being received from the
sensor and check to see if it is JSON formatted and see if it is taking the voltage and the timestamp. Then it will send our data to the transformer.

### GET /read
Endpoint located from each sensor
**Parameters**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `timestamp` | required | Unix Timestamp  | The timestamp when value was read.                                                                     |
|        `voltage` | required | double  | The value of voltage ouputed by sensor.

### GET /sample
Endpoint located on the sampler service
**Parameters**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `timestamp` | required | Unix Timestamp  | The timestamp when value was got.                                                                  |
|        `voltage` | required | double  | The value of voltage ouputed by sensor.

--- 

For integrating our Hot Spare for our Availability QA, we decided to run multiple sensor containers using Docker. If a sensor returns a faulty reading, it will move onto the next sensor and reset the faulty sensor. For Integrability we use a wrapper which is implied by data only being able reach the next or previous service when handling data, these services format the input into an accepted output so all services can use their expected data. For running tests, they are triggered when we commit or use github actions to trigger the CI/CD pipeline. 

# Testing

To test our sampler, we use sampler.test.js to run different readings to make sure the system is returning false or true on the reading validation.

We test for bad voltage, bad timestamps, as well as if there is any missing data
Example:

```js
const badVoltage = { voltage: 99, timestamp: 1741234567.123 };
test('returns false for invalid voltage', () =>
    expect(isValidReading(badVoltage)).toBe(false));
```

We run these tests for all values to make sure our code is working correctly before deploying to the server.

# Deployment

We are using a server provided by one of our groupmates to deploy the server, this allows for testing using a real docker environment. For each service we are designing, we are making sure to implement a Dockerfile and a running Docker Compose file to allow for simple deployment. Using Docker networks allow us to have the sampler communicate with each sensor without having multiple ports exposed. 

## Running Locally

To run the full stack of services locally, you will need to have Docker or Docker Desktop installed

Clone the repository and run:
```bash
docker compose -f docker-compose.weather.yml up --build
```

Once running in docker, the sampler will be available at "http://localhost:3000". To take a reading, visit "http://localhost:3000/reading" or curl using bash
```bash
curl http://localhost:3000/reading
```

Individual sensors are also exposed by default on ports 5001, 5002, and 5003 which can be accessed with /read to get individual sensor readings.

# Configuration

Most configuration can be found in docker-compose.weather.yml, however there are some other configuration files

The sampler uses 'sensors.json'. Each entry must match the Docker Compose service name for the sensors:
```json
[
    {"name": "sensor-1"},
    {"name": "sensor-2"},
    {"name": "sensor-3"}
]
```

To see currently running docker containers, run:
```bash
docker ps
```
This will show all currently running containers and their names.