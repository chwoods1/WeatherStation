# Weather Station

# Sampler

Our sampler takes the data from our sensors and make sure that it is formated in the correct way. It will look at the data being recived from the
sensor and check to see if it is JSON formatted and see if it is taking the voltage and the timestamp. Then it will send our data to the transformer.

### GET /sensor/read.json
**Parameters**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `timestamp` | required | datetime  | The timestamp when value was got. <br/><br/> Supported values: `time`.                                                                     |
|        `voltage` | required | double  | The value of voltage ouputed by sensor. <br/><br/> Supported values : `voltage`, 

### POST /sampler/sampleData.json
**Parameters**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `timestamp` | required | datetime  | The timestamp when value was got. <br/><br/> Supported values: `time`.                                                                     |
|        `voltage` | required | double  | The value of voltage ouputed by sensor. <br/><br/> Supported values : `voltage`, 

--- 

For integrating our Hot Spare for our availibity QA, we decided to run multiple sensor containers using Docker. If a sensor returns a faulty reading, it will move onto the next sensor and reset the faulty sensor. For Integratibility we use a wrapper which is implyied by data only being able reach the next or previous service when handling data, these services format the input into an accepted output so all services can use their expected data. For running tests, they are triggered when we commit or use github actions to trigger the CI/CD pipeline. 

# Testing

To test our sampler, we use sampler.test.js to run different readings to make sure the system is returning false or true on the reading validation.