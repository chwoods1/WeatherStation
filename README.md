# Weather Station
Built as a part of Michigan Tech's Software architecture class.

Simulates a weather station pipeline including reading from sensors to saving the data to a database using an API. 

Since this project is split into multiple parts, individual documentation pages describing each part of the pipeline can be found below:

# Tech Stack
- **Python**
  - Flask
  - Django
  - Pytest
- **Node.js**
  - Express
  - Jest
- **Docker**
  - Docker Compose
  - Docker Networks
- **Github Actions**
  - Tailscale

# Components
[Sensor](docs/sensor.md) (Python, Flask)

[Sampler](docs/sampler.md) (Node.js, Express)

[Transformer](docs/transformer.md) (Python, Flask)

[API](docs/api.md) (Python, Django)


# Deployment

We are using a server provided by one of our groupmates to deploy the server, this allows for testing using a real docker environment. For each service we are designing, we are making sure to implement a Dockerfile and a running Docker Compose file to allow for simple deployment. Using Docker networks allow us to have the sampler communicate with each sensor without having multiple ports exposed. 

## Running Locally

To run the full stack of services locally, you will need to have Docker or Docker Desktop installed

Clone the repository and run:
```bash
docker compose -f docker-compose.weather.yml up --build
```

Once running in docker, the sampler will be available at "http://localhost:3000". To take a reading, visit "http://localhost:3000/sample" or curl using bash
```bash
curl http://localhost:3000/sample
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

---

## Contributors

Built with a team during Michigan Tech's Software Architecture class.

- Chase Woods - [Github](https://github.com/chwoods1)
- Travis Haines - [Github](https://github.com/Thaines22)
- Samuel McKeown - [Github](https://github.com/Swaguffin)
- Tommy McQuiston - [Github](https://github.com/tlmcquis)