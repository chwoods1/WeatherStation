Sampler README

**Parameters**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `timestamp` | required | datetime  | The timestamp when value was got. <br/><br/> Supported values: `time`.                                                                     |
|        `voltage` | required | double  | The value of voltage ouputed by sensor. <br/><br/> Supported values : `voltage`, 

Our sampler will take the data from our sensor and make sure that it is formated in the correct way. It will look at the data being recived from the
sensor and check to see if it is JSON formatted and see if it is taking the voltage and the timestamp. Then it will transfer the data onto the transformer. 
For our two QA's, we are doing a hot spare for avalability, we are doing this so that not data will get lost and if something were to happen to the sensor then we would be
able to go the backup imentently. And for intrabillity we are using a wrapper, this will help all of the data trasnfer smoothly and so that it will be able to be 
processed with minimal to no errors. 
For running tests we are giving the sampler formated files and chekcing to see if it returns them in the same format and the data is correct. We are also testing by
turring off one of our sensors to see if our hot spare will work and we can run smoothly. 

Request Format (JSON)
{
  "timestamp": "2026-03-15T12:30:00Z",
  "voltage": 2.73
}
Response Format (JSON)
{
  "sampled_timestamp": "2026-03-15T12:30:00Z",
  "sampled_voltage": 2.73
}
