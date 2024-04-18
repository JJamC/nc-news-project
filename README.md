# Northcoders News API

-- Link to hosted db 
https://nc-news-project-8so2.onrender.com/

-- This project is an API which allows the user to access the Northcoders News database. The API facilitates the sending of GET, POST, PATCH and DELETE requests by the user to said database.



-- Clone this git repo from:

https://github.com/JJamC/nc-news-project.git



-- Dependencies to install

$ npm i postgres

Install npm postgres in order for the connection.js file to establish the connection pool.

$ npm i pg-format

Install npm pg-format for the seed file.

$ npm i dotenv

Install npm dotenv, this allows the connection file to connect to either the test, development or production database depending on your needs.

Set up .env.test and .env.development files in your directory and add them to a .gitignore file
(write .env.* in the file to ignore all .env files)

they should each contain:

PGDATABASE=<insert db name here>
PGPASSWORD=<insert psql password here>

$ npm i express

Install npm express for the app file, this handles the endpoints which direct the user request to the controller folder

$ npm i supertest -D
$ npm i jest-sorted -D

Install jest supertest and jest-sorted as dev dependencies needed to run the test suite



-- Testing

npm run setup-dbs will create the database

npm test will populate the database with test data and run the test suite seed.test.js via jest supertest

npm run seed will populate the database with devData. 
Should you want to make requests to the API's devData locally, run npm start to activate the listen.js file and using, for example, insomia or postman,
you can send URLs to the API provided you have set the port to the same port that is in the listen.js file.