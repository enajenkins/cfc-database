/* Require Express */
const express = require('express');
const { connectToDb, getDb } = require('./db');

/* Initilize app and middleware (adding later) by invoking express function we just required and storing it in the const 'app' for later use */ 

const app = express(); 
/* listen for requests to a specific port number */

/** Database Connection **
 *  You want to establish a database connection before you start listening to the api. Pass in a function which will fire either if the connection is successful or if there is an error. 
 * 
 * If successful, listen to requests to the express app. If there is an error, the error callback will be populated. If no error, it will be null. 
 * 
 * Pass an err function into the connectToDb() funtion and set up a conditional that will check for the err value and listen for requests if the value is null. 
 * 
 * Move the app.listen function into the if block. Now we are only listening for requests if we successfully connect to the data base. 
 * 
 * Then call the getDb function so we can have that connection object available in this file. 
 * 
 * Declare an empty var 'db' to store and inititlaize. 
 * Add a statement that will update the db variable once we are connected to and start listening to the database. This will return to us the db connection object that we need. 
 * 
 * This is the object we will use to communicate with the database with CRUD actions
 * 
 * */

let db

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      // adding a console log for now to make sure it's working...
      console.log('app is listening on port 3000')
    })
    db = getDb()   
  }

})

/* Set up route handlers */
  // get request handler for requests sent to the port we are listening to (3000)
  app.get('/books', (req, res) => {
    // send back a json response to whoever is sending the request.
    res.json({mssg: 'welcome to the api!'})
  })

  /* Install nodemon. run 'nodemon app' command to start dev server and run app. go to http://localhost:3000/books in browser to see output */ 
