# Setup

## Setting up MongoDB and adding Express, Nodemon, route handlers

1. `require` express

    `const express = require('express');`

2. `initilize` app and middleware (adding later) by `invoking express` function we just required and storing it in the const 'app' for later use

    `const app = express();`

3. `listen for requests` to a specific port number. you can add a console log for now to make sure it's working once you run the app.

        `app.listen(3000), () => {
          console.log('app is listening on port 3000');
        }`

4. set up `route handlers`

    * get `request handler` for requests sent to the port we are listening to (3000) and send back a `json response` to whoever is sending the request.

          app.get('/books', (req, res) => {
            res.json({mssg: 'welcome to the api!'})
          })

## Connecting to MongoDB

1. Create a `db.js` file on the root of the folder where app.js is located. This is where all of your database connection code will go.

2. Set up 2 functions. One to initially `connect to a database` and a second to `retrieve the connections` once you have connected and `export` both functions from the file for use in app.js later.

        module.exports = {
          connectToDb: () => { MongoClient.connect('mongodb://localhost:27017/bookstore')},
          getDb: () => {}
        }

3. Import the Mongo client from the mongo db package we have installed.
        const { MongoClient } = require('mongodb');

4. Use `MongoClient` in the `connectToDb` function to connect to the database and pass in the connection string. The connection string syntax for a local database `mongodb://localhost:portnumber/databasenamehere`. We can use Atlas to connect to a remote database.

          connectToDb: () => { MongoClient.connect('mongodb://localhost:27017/bookstore') },

5. Chain the `.then()` and `.catch()` methods to your connection method to handle the promise. Initialize a variable called `dbConnection`. Then, extract the client.db() method and store it in 'dbConnection'inside your .then() function block.

            MongoClient.connect('mongodb://localhost:27017/bookstore')
              .then((client) => {
                dbConnection = client.db();
              })
              .catch(err => { 
                console.log(err); // just log for now
              })

6. Return the database connection value you have accessed in the second function.

        getDb: () => dbConnection

7. Pass in a callback function `'cb'` as an arg in the `connectToDb()` function so we can fire it once the connection has been established. So, after the dbConnection will be updated in the line `dbConnection = client.db()`, you want to invoke the `cb()` function by returning it. Also return it in the `catch()` block but pass in the `err` object

        connectToDb: (cb) => {  
          MongoClient.connect('mongodb://localhost:27017/bookstore')
            .then((client) => {
              dbConnection = client.db();
              return cb();
            })
            .catch(err => { 
              console.log(err);
              return cb(err);
            })
        }

8. Call the functions from the `app.js` file.

      const { connectToDb, getDb } = require('./db')

9. Establish a database connection before you start listening to the api.Set up a conditional that will check for the err value and listen for requests if the value is null.

10. Move the app.listen function into the if block.

11. Set up route handlers

        app.get('/books', (req, res) => {
          res.json({mssg: 'welcome to the api!'})
        })

12. Install nodemon. run 'nodemon app' command to start dev server and run app. go to http://localhost:3000/books in browser to see output.