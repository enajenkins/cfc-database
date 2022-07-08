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

2. Set up 2 functions. One to initially `connect to a database` and a second to `retrieve the connections` once you have connected and `export` both functions from the file for use in `app.js` later.

        module.exports = {
          connectToDb: () => { MongoClient.connect('mongodb://localhost:27017/bookstore')},
          getDb: () => {}
        }

3. Import the Mongo client from the mongo db package we have installed.
        const { MongoClient } = require('mongodb');

4. Use `MongoClient` in the `connectToDb` function to connect to the database and pass in the connection string. The connection string syntax for a local database `mongodb://localhost:portnumber/databasenamehere`. We can use Atlas to connect to a remote database.

          connectToDb: () => { MongoClient.connect('mongodb://localhost:27017/bookstore') },

5. Chain the `.then()` and `.catch()` methods to your connection method to handle the promise. Initialize a variable called `dbConnection`. Then, extract the `client.db()` method and store it in 'dbConnection' inside your `.then()` function block.

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

9. Establish a database connection before you start listening to the api. Set up a conditional that will check for the err value and listen for requests if the value is null.

10. Move the `app.listen` function into the if block.

11. Set up route handlers

        app.get('/books', (req, res) => {
          res.json({mssg: 'welcome to the api!'})
        })

12. Install nodemon. run 'nodemon app' command to start dev server and run app. go to <http://localhost:3000/books> in browser to see output.

## Fetching Data

1. Inside the `get` request route handler function in `app.js`, us the `db` variable to find all of the documents on your collection.

        app.get('/books', (req, res) => {
          db.collection()
          res.json({mssg: 'welcome to the api!'})
        })

2. Use the `.find()` method to find all of the docs in the book collection.

        db.collection('books')
        .find()

3. Use the `.sort()` method to sort by author.

        .sort({ author: 1 })

4. Define an empty `'books'` array in the `get()` function scope and iterate through the returned documents using `.forEach()`, pushing each book into the array.
Syntax:

        .forEach( currentItem => array.push(currentItem))

    So...

        app.get('/books', (req, res) => {
          let books = []

          db.collection('books')
          .find()
          .sort({ author: 1 })
          .forEach( book => books.push(book))

5. Chain a `then()` method to `forEach()` that sends a response to the user once the data has all been fetched using the `res` object that was passed into the `get()` function. Use the res object to return a `status of 200` and the `.json()` method to send the books array tothe client as a string.  

        .then(() => {
          res.status(200).json.books(books)
        })

6. Chain a `.catch()` method to catch errors and to return `server error 500` and a json object with the property `error: 'Could not fetch the document'`.

        .catch(() => {
          res.status(500).json({error: 'Could not fetch the documents'})
        })

## Route to fetch a single book

1. Under the `/books` route handler you just created,  create another `app.get()` request route handler to get a single book using a route parameter (changeable part of the route) that you can call `id` - like so `/books/:id`. The second argument will once again be the callback function that will pass in the `req` and `res` objects. The syntax is as follows:

        app.get('/routeName or /routeName/:param', callback function with req and res objects passed in)
        
        so...
        
        app.get('/books/:id', (req, res) => { })

2. You will access the id from the request object via it's params.

        app.get('/books/:id', (req, res) => { 
          // req.params.id gives you access to the value in the :id param
        })

3. Get a reference to the collection again...

        app.get('/books/:id', (req, res) => { 
          db.collection('books')
        })

4. Find a single doc in the collection by using the method `.findOne({})` to pass through a filter to identify which document we will get back. Use the `_id:` field to filter through and get the desired document. Since we are using `ObjectId` from MongoDB make sure you require it at the top of the file. `req.params.id` gets you access to the value in the url. Pass `req.params.id` into ObjectId to access the id param sent back with the request.

        app.get('/books/:id', (req, res) => { 
          db.collection('books')
          .findOne({_id: ObjectId(req.params.id)})
        })

5. Chain a `.then()` method so we can do something with the document that is returned. Send a status and the document back to the user - make sure the doc is in `json` format

        db.collection('books')
        .findOne({_id: ObjectId(req.params.id)})
        .then(doc => {
          res.status(200).json(doc)
        })

6. Chain a `.catch()` method do handle any errors. Send back a (500) server error status as well as the error property.

        db.collection('books')
        .findOne({_id: ObjectId(req.params.id)})
        .then(doc => {
          res.status(200).json(doc)
        })
        .catch(err => {
          res.status(500).json({error: 'Could not fetch the documents'})
        })

7. To test, copy an id from the json in the browser where you are running the app. paste it into the url route in the address bar to see the single book. For example: <http://localhost:3000/books/62af93635b40c2db0cbc02bc>

8. If you paste jibberish into the route url, you'll get a BSONTypeError because the string is not the proper format (24 characters) for the `ObjectId(req.params.id)` constuctor. Youll need to check that the string id is valid. Only fetch the doc if the string is valid or else send a 500 status response with error message.

        if (ObjectId.isValid(req.params.id)) {
          // fetch document
        } else {
          // send an error
          res.status(500).json({error: 'Not a valid document ID'})
        }

9. Place the fetch code into a conditional.

        if (ObjectId.isValid(req.params.id)) {

            db.collection('books')
            .findOne({_id: ObjectId(req.params.id)})
            .then(doc => {
              res.status(200).json(doc) 
            })
            .catch(err => {
              res.status(500).json({error: 'Could not fetch the documents'})
            })
        } else {
          res.status(500).json({error: 'Not a valid document ID'})
        }

10. when the ID is valid but the doc dosent exist, mongo returns null. You can handle this server side or client side

### Other Notes

`isValid()`
According to Geeks for Geeks:
<https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/>

> `MongoDB ObjectId`: MongoDB creates a unique 12 bytes ID for every object using the timestamp of respective Object creation. This ObjectId can be used to uniquely target a specific object in the database.
>
> `Structure:`
>
> 4-byte timestamp value
>
> 5-byte random value
>
> 3-byte incrementing counter, initialized to a random value
>
> It looks like this, `507f191e810c19729de860ea`
During a normal backend workflow, the `ObjectId` might be received based on some computation or user operations. These might result invalid ObjectId and querying database with wrong ObjectId gives exception which is then handled later.


## Using Postman to simulate GET/POST/DELETE/UPDATE requests to an API

1. Download, Install, and Run Postman locally

2. How to make a GET request: File >> new tab. Select GET for type. Enter URL for the endpoint you want to hit (your local endpoiont we have been using to test): <http://localhost:3000/books/>. Hit send to send the request. The response will be at the bottom.

3. Click the save button to save this request. You can rename it or leave it as the url and then you can add it to a collection.  

4. Repeat the process to create and save a single book request. Grab an id from the json in the postmant response.

## Setting up a POST request handler to test endpoint (DISMABIGUATE)

1. Add a POST requsest handler to the app.js file. The route will be `'/books'`. This is the endpoint you will be sending a POST request to. When the request is recieved, you'll then fire the callback function that recieves a request and response. The POST request body that comes back will contain all of the information that you want to save to the database - basically a book document. You access it through the `req.body` property. You'll need Express Middleware to get access to this property though.

        app.post('/books', (req, res) => {
          // get the body of the POST request by using req.body
        })

2. Right under where you initialized Express in app.js earlier, mount the middleware function with the `.use()` method. Then, in order to parse and return any json coming in on the request so it can be used in the handler functions, pass in the 

        const app = express();
        app.use(express.json()); 

Syntax: `app.use(path, callback)` (DISAMBIGUATE THIS) Refer to resource: <https://www.geeksforgeeks.org/express-js-app-use-function/>

According to Geeks for Geeks:
  > The `app.use()` function is used to mount the specified middleware function(s) at the path which is being specified. It is mostly used to set up middleware for your application.
  >
  > The `express.json()` function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser. Syntax: `express.json( [options] )`

3. Now you can store the request body in a variable for ease of use and context.

        app.post('/books', (req, res) => {
          const book = req.body

4. Save book object to the database. Get the books collction from the database object using `db.collection('books')`. Chain the `.insertOne()` method to insert a single document and pass in the book object that we are getting from the `request body`. Chain the `.then()` method to fire a function once the async task is complete and pass in the `result` that will come back from MongoDB when you insert a document. Send a `201 status response` to the client that includes the `result`. Chain a `.catch()` method and send a `500 status` error response.

        app.post('/books', (req, res) => {
        const book = req.body

        db.collection('books')
        .insertOne(book)
        .then(result => {
          res.status(201).json(result) 
        })
        .catch(err => {
          res.status(500).json({err: 'Could not create a new document'})
        })
      })

5. Test the POST request in Postman:
   * Click in plus icon to add a `new connection`
   * Change the request method to `POST`
   * Add the localhost `url` <http://localhost:3000/books> to the address bar
   * Select the `body` tab and choose `raw` and then `json` from the dropdown since we want to send a json object in the request body to post data to the database
   * Paste the new json object in the request body window
   * Click send. You should see `"ackowledged": true` and an `insertedId` generated for the new entry
   * To check to see if the new book was added to the database, select the get request for all of the books from the Bookstore (or whatever you named it) collection to load it. If you scroll to the bottom the new entry should be there.
   * Save the new `POST` request to the Bookstore collection

CLEAN UP ABOVE NOTES LATER

## Create a DELETE request

1. A `PATCH` request updates individual fields in a document or many at once. Add a `PATCH` request handler under the `POST` handler. It should be similar to the `GET` and `DELETE` single book request because you will check if the ID is valid and you'll chain async methods.

        app.patch('/books/:id', (req, res) => {

2. Get the body that is sent back from the request and assign it to a variable:
        app.patch('/books/:id', (req, res) => {
          const updates = req.body

3. Check that the ID from the request parameters is valid then get the collection from the `db` object.

        app.patch('/books/:id', (req, res) => {
          const updates = req.body

          if (ObjectId.isValid(req.params.id)) {
            db.collection('books')

4. Chain the `.updateOne()` method. The first arg is how you will find the book (id property) and the second arg is how you will $set the incoming req.body update on the document.

        app.patch('/books/:id', (req, res) => {
          const updates = req.body

          if (ObjectId.isValid(req.params.id)) {
            db.collection('books')
            .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})

5. Finish with the `.then()` and `.catch()` methods as is done with the other requests.

      app.patch('/books/:id', (req, res) => {

        const updates = req.body

        if (ObjectId.isValid(req.params.id)) {
          db.collection('books')
          .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
          .then(result => {
            res.status(200).json(result)
          })
          .catch(err => {
            res.status(500).json({error: 'Could not update the documents'})
          })
        } else {
          res.status(500).json({error: 'Not a valid document ID'})
        }
      })

## Simple Pagination for the GET requests

Typically you'd want to use pagination when you are querying data from a large database. You'd use query parameters at the end of the query url - a query string. You would access the query parameters from the request object.
For example you can query results page by page: 

<http://localhost:3000/books/?page=1>,

<http://localhost:3000/books/?page=2>, 

<http://localhost:3000/books/?page=3>

1. In the first `GET` request for the entire books collection, add a variable for pages that will store a `page` parameter from the request query. 

        const page = req.query.page 

    This will get us the value of the page being requested. If whoever is making the request does not pass along a page parameter, then default the param to `0`

        const page = req.query.page || 0

2. Implement pagination in the query. Define how many book docs will be sent back.

        const page = req.query.page || 0
        const booksPerPage = 3

    `skip()` method - allows you to skip a certain number of documents in the query results. For example: `db.collection.find().skip(1)`. The number of pages we want to skip is `page * booksPerPage` so we pass this to the `skip()` method as the argument.

        .skip(page * booksPerPage) // skips a certain amount of pages

    `limit()` method - limits the number of documents returned. `db.collection.find().limit(25)`

        .limit(booksPerPage) // limits us to getting 3 books per page back

   3. Test the query in Postman by sending a GET request to <http://localhost:3000/books?page=1>

## Indexes

Indexes allow the database server to perform specific queries in order to find documents more efficiently without having to examine the whole collection. For example

        db.collections('books').find({'rating': 10})

Normally MongoDB would have to scan the entire collection and look through each document to find the one where the rating field had a value of 10. Alternatively you can make an index for any field you need to query. An index contains a list of values for whatever field you're indexing. Mongo then scans the index for the values you are looking for rather than the whole collection. Those indexes will have a pointer that points back to the document it's referencing. `Note:` Creating an index for a collection requires that you change the index each time the collection changes - so it's extra work. Use indexes thoughtfully. Only use indexs when you have to return a subset of a collection.

Open MongoSH, load the `bookstore` db and create an index for books with a rating of `8` 

        db.books.createIndex({ rating: 8 })

...returns

        rating_8

...then get the indexes to see that they have been created...

        db.books.getIndexes()

...will return all of the indexes you have created including the one for the _id field that Mongo creates by default. 

        [
          { v: 2, key: { _id: 1 }, name: '_id_' },
          { v: 2, key: { rating: 8 }, name: 'rating_8' }
        ]

`.explain()` is a MongoSH method that will return information on the query execution so you can understand exaclty how your query executes and behaves. `More here:` <https://www.mongodb.com/docs/manual/reference/method/cursor.explain/>  Enter the following into MongoSH:

        db.books.find({ rating: 8 }).explain('executionStats')

If you examine the output you will see how many documents were examined and how many were returned based on the index `docsExamined: 0`, `nReturned: 0`. In this case the number was 0 for both because no books had a rating of 8. 

You can drop an index with the following:

        db.books.dropIndex({ rating: 8 })

...will retuen...

        { nIndexesWas: 2, ok: 1 }

Checking for all existing indexes...

        db.books.getIndexes()

...will now return only the default index created by MongoDB

        [ { v: 2, key: { _id: 1 }, name: '_id_' } ]

## Atlas - communicate with a database as a service platform

Follow instructions here: <https://www.youtube.com/watch?v=084rmLU1UgA&list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA&index=25>

ADD NOTES LATER

Replace the connection string with the one you copied from Atlas and replace the creds:

        mongodb+srv://<username>:<password>@cluster0.mxnbwel.mongodb.net/?retryWrites=true&w=majority

Once you change the conenction string to the Atlas DB location, you will notice that if you go into Postman and send a GET request that nothing comes back - because you need to add book docs to the Atlas DB. You can do this via a POST request

Go to the previous POST request where you have one book json object in the request body field. Send this request again to add the book to the Atlas database. 

Now go back to the previous GET request and re-send it. You should now see the newly added book doc.

