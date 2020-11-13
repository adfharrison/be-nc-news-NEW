# Alan Harrison News API

# URL - https://alans-news-app.herokuapp.com/api

## Summary

This is the back-end to a reddit-style api that allows users
to add their user account, then browse topics, articles and comments, add their own, delete articles or comments, and up
or down vote them. They may also edit their own articles or comments.

created using PSQL, Node.js, Express, Knex and nodePostgres.

testing using nodemon, insomnia, jest, supertest and jest-sorted.

hosting using Heroku.

# How to use

follow the URL above to view the hosted app, the opening page will provide you with valid endpoints, methods and request bodies.

# Git

to clone to your local repo, click 'fork' in the top right corner of this repo, then when youre in your own repo, click
'code' and copy the https link. then, in your desired location
in your local directory, in your terminal type
'git clone <copied URL>

# Using the code

open the cloned directory using your code editor.

# Required dependencies

run these commands to install the dependencies:

npm install express
npm install --save-d jest
npm install --save-d supertest
npm install pg
npm install --save-d jest-sorted
npm install knex
npm install --save-d nodemon

you may also wish to install insomnia or similar on your computer to test in a real-world browser oriented fashion.

# Setup and Seed database

you must run the script 'npm run setup-db' to create the databases. Then, to seed them (insert data), run either
'npm run seed-test' for the smaller test DB or
'npm run seed-dev' for the larger development DB

# Running tests

to run the api test script, type 'npm run test-app'.
this automatically re-seeds the database to fresh and
runs the tests. these tests run on the smaller test database.

you can also run 'npm run nodemon' to have the server start up, and you can then start making requests using your browser
or browser app like insomnia. the address will be
http://localhost:8080

# Versions

this api was made on node v15.0.1 and postgreSQL 13
