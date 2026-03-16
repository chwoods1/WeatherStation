const { readFileSync } = require('fs');
const https = require('https');
const { type } = require('os');


const express = require('express');
const app = express();

const sensors = JSON.parse(readFileSync('sensors.json'));


async function sampleSensor(sensor) {
  const reading = await fetch(`https://${sensor.name}:5000/read`);
  return reading.json();
}

// Contains logic to determine if a reading is valid
function isValidReading(reading) {
  // Check if voltage is within expected range and is a number

  if (typeof reading.voltage !== 'number' || reading.voltage < 0 || reading.voltage > 5) {
    return false;
  }

  // Check that timestamp uses the correct format and is a number of length 10
  if (typeof reading.timestamp !== 'number' || !Number.isFinite(reading.timestamp)) return false;
  if (Math.floor(reading.timestamp).toString().length !== 10) return false;
  
  return true;
}

async function sampleData() {
  for (const sensor of sensors) {
    const reading = await sampleSensor(sensor);
    if (isValidReading(reading)) {
      return reading;
    } else {
      console.warn(`Invalid reading from ${sensor.name}, restarting...`);
      // restartSensor(sensor);
    }
  }
  throw new Error('All sensors failed');
}

app.use(express.json());

app.get('/sample', async (req, res) => {
  try {
    const reading = await sampleData();
    res.json(reading);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (require.main === module) {
  const options = {
    key: readFileSync('key.pem'),
    cert: readFileSync('cert.pem')
  };
  https.createServer(options, app).listen(3000, () => {
    console.log('Sampler running on port 3000');
  });
}
module.exports = { isValidReading };