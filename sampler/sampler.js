const { readFileSync } = require("fs");
const https = require("https");
const { type } = require("os");
const express = require("express");

const app = express();
app.use(express.json());

// Allows node.js to accept self signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Reads in configuration file for list of sensor addresses or container names.
const sensors = JSON.parse(readFileSync("sensors.json"));

// Sample given sensor and return as json
async function sampleSensor(sensor) {
  const reading = await fetch(`https://${sensor.name}:5000/read`);
  return reading.json();
}

// Contains logic to determine if a reading is valid.
function isValidReading(reading) {
  // Check if voltage is within expected range and is a number.
  if (
    typeof reading.voltage !== "number" ||
    reading.voltage < 0 || reading.voltage > 5
  ) {
    return false;
  }

  // Check that timestamp uses the correct format and is a number of length 10.
  if (
    typeof reading.timestamp !== "number" ||
    !Number.isFinite(reading.timestamp)
  )
    return false;
  if (Math.floor(reading.timestamp).toString().length !== 10) return false;

  // If all parts of the reading are valid, return true
  return true;
}

// Function that will sample individual sensors, imploying the hot spare pattern for availability.
async function sampleData() {
  // Gets a reading every sensor one at a time, if one has a valid output, break and return the value.
  // If sensor returns invalid output, restart the container and move to the next sensor.
  for (const sensor of sensors) {
    const reading = await sampleSensor(sensor);
    if (isValidReading(reading)) {
      postToTransform(reading);
      return reading;
    } else {
      console.warn(`Invalid reading from ${sensor.name}, restarting...`);
      // restartSensor(sensor);
    }
  }
  throw new Error("All sensors failed");
}

async function postToTransform(reading) {
  const response = await fetch('https://weather-station-transformer-1:4000' , {
  method: 'POST',
  headers: {
     
  },
  body: JSON.stringify(reading)
});

}


// /sample endpoint which runs sampleData and returns the data sampled
app.get("/sample", async (req, res) => {
  try {
    const reading = await sampleData();
    res.json(reading);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Starting our node.js service
if (require.main === module) {
  // Defining our self signed key and cert for HTTPS use
  const options = {
    key: readFileSync("key.pem"),
    cert: readFileSync("cert.pem"),
  };
  // Starting our service using HTTPS on port 3000
  https.createServer(options, app).listen(3000, () => {
    console.log("Sampler running on port 3000");
  });
}

// Export our isValidReading function for use in testing
module.exports = { isValidReading };