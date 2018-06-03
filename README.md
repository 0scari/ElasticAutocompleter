## ElasticAutocompleter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

### Set-up information

In order to set up the application follow these steps:
   1. run `npm install` 
   2. run `npm run prepElastic` 
   3. run `ng serve`

The command `npm run prepElastic` has the following effect:
 1. spin up Docker containers with Kibana & Elasticsearch from a compose file
 2. sleep for 45 seconds while Elasticsearch is starting
 3. *elasticsearch-index-setup.js* script will create an index and call *elasticSeeder.js* to bulk load 10,000 documents
    with addresses
 
 ### Additional info
 
 There have been situations where the Docker containers do not respond after setup.
 
 _Just restart Docker and try again, additionally, you might want to increase the sleep-time in package.json_ 
 
 It takes ~ 2 minutes for Kibana to start, don't panic!