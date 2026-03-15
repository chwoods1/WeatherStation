const { read } = require('fs');
let http = require('http');
const { type } = require('os');


const express = require('express');
const app = express();

const sensors = JSON.parse(read('sensors.json'));


async function sample_sensor(sensor) {
  const reading = await fetch(`http://${sensor.name}:5000/read`);
  return reading.json();
}

// Contains logic to determine if a reading is valid
function isValidReading(reading) {
  // Check if voltage is within expected range and is a number
  if (typeof reading.voltage !== 'number' || reading.voltage < 0 || reading.voltage > 5) {
    return false;
  }

  // Check that timestamp uses the correct format and is a number of length 10
  if (!isFloat(reading.timestamp)) return false;
  if (reading.timestamp.split('.')[0].length !== 10) return false;
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

module.exports = { isValidReading };