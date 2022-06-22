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

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      // adding a console log for now to make sure it's working...
      console.log('app is listening on port 3000');
    })
    db = getDb();   
  }

})

/** Set up route handlers **
 *  Create a 'get' request handler for requests sent to the port we are listening to (3000)
 * 
 *  Inside the 'get' request handler function, us the `db` variable that stores the getDb() method to find all of the documents on your collection. You will use this method to reference a specific collection in the database by passing in the collection name.
 * 
 * Chain the find() method to collections() to find all of the docs in the book collection. 
 *      -- find() returns a 'cursor' - a object that points to a set of documenmts outline by your query.
 *      -- if you don't define any arguments for find() it will return all of the documents. If you define a filter argument then it will return a subset.
 *
 * The returned cursor object has methods toArray() and forEach() that you can use to fetch the data that the cursor points to.
 *      -- toArray() - fetches all of the documents that the pointer points to and puts them into an array
 *      -- forEach() - iterates through all of the documents that the pointer points to so you can process them one at a time.
 *      -- When you fetch them this way, Mongo fetches the documents in batches to conserve network bandwith usage in case your collection contains a huge number of documents. The default batch size is something like 101 documents. 
 *      -- The forEach() method will iterarte through that batch until it's done then fetch the next batch.
 * 
 *  Chain the sort() method to find() to sort the documents by author. The sort methos also returns a pointer.
 * 
 *  Chain the forEach() method to sort() to iterate through the documents and push them to an array which you can define locally in the function block. 
 * 
 *  Chain a then() method to forEach() because it fetches data in batches - so it's asynchronous. You'll want to fire a function when all of the fetching is complete that sends a response to the user.
 *      -- use the response (res) object passed into the get() method in the .then() callback function block to access and provide a status code of 200 (all ok). 
 *      -- chain a .json() method to send 'books' array as a json string response back to the client who made the request.
 * 
 * Chain a .catch() method to catch errors. This and to return server error 500 and a json object with the property error: 'Could not fetch the documents'.
  */
  app.get('/books', (req, res) => {
    let books = []

    db.collection('books')
    .find()
    .sort({ author: 1 })
    .forEach( book => books.push(book))
    .then(() => {
      res.status(200).json(books)
    })
    .catch(() => {
      res.status(500).json({error: 'Could not fetch the documents'})
    })
  })

  /* Install nodemon. run 'nodemon app' command to start dev server and run app. go to http://localhost:3000/books in browser to see output */ 
