# misterBIT-simple-rest-server

## install and use
install : clone/download 
 
````
npm install
````
start:   
````
npm start
````
 
 
## Use

### supported REST verbs - POST,PUT,GET,DELETE

point your app to use localhost:3003/data/<collectionName>

where collectionName is whatever object you want to save for example users

CORS is enabled for all routes so you can come from any domain.

POST localhost:3003/data/user ----> adds a user (from json in body) -->returns the new user ID (in an object)
 
GET localhost:3003/data/user -----> gets the list of users

GET localhost:3003/data/user/<id> -----> returns a single user by its ID from the list of users or undefined

PUT localhost:3003/data/user/<id> -----> replaces a single user by its ID in the list of users with the JSON data in the body

DELETE localhost:3003/data/user/<id> -----> deletes a single user by its ID off the list of users


## Demos

the server comes with cars,pets and monsters collections

## Reset the data store

just restart the server

## Notes 

For development purposes only!!!
if you need something more advance, with abilities to configure routes, save the in-memory data to disk etc use [json-server](https://www.npmjs.com/package/json-server)