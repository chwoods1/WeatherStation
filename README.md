Sampler README

Our sampler will take the data from our sensor and make sure that it is formated in the correct way. It will look at the data being recived from the
sensor and check to see if it is JSON formatted and see if it is taking the voltage and the timestamp. Then it will transfer the data onto the transformer. 
For our two QA's, we are doing a hot spare for avalability, we are doing this so that not data will get lost and if something were to happen to the sensor then we would be
able to go the backup imentently. And for intrabillity we are using a wrapper, this will help all of the data trasnfer smoothly and so that it will be able to be 
processed with minimal to no errors. 
For running tests we are giving the sampler formated files and chekcing to see if it returns them in the same format and the data is correct. We are also testing by
turring off one of our sensors to see if our hot spare will work and we can run smoothly. 


Request Format (JSON)
{
  "timestamp": "1741234567.123",
  "voltage": 2.73
}
```

Once the data is validated, the data will be sent to the transformer in this format

```json
{
  "sampled_timestamp": "1741234567.123",
  "sampled_voltage": 2.73
}

```

--- 

For integrating our Hot Spare for our availibity QA, we decided to run multiple sensor containers using Docker. If a sensor returns a faulty reading, it will move onto the next sensor and reset the faulty sensor. For Integratibility we use a wrapper which is implyied by data only being able reach the next or previous service when handling data, these services format the input into an accepted output so all services can use their expected data. For running tests, they are triggered when we commit or use github actions to trigger the CI/CD pipeline. 

# Testing

To test our sampler, we use sampler.test.js to run different readings to make sure the system is returning false or true on the reading validation.