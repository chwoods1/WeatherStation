# Sampler

Our sampler takes the data from our sensors and make sure that it is formatted in the correct way. It will look at the data being received from the
sensor and check to see if it is JSON formatted and see if it is taking the voltage and the timestamp. Then it will send our data to the transformer.

### GET /read
Endpoint located from each sensor\
**Parameters**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `timestamp` | required | Unix Timestamp  | The timestamp when value was read.                                                                     |
|        `voltage` | required | double  | The value of voltage outputted by sensor.

### GET /sample
Endpoint located on the sampler service\
**Parameters**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `timestamp` | required | Unix Timestamp  | The timestamp when value was read.                                                                  |
|        `voltage` | required | double  | The value of voltage outputted by sensor.

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
