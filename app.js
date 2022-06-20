// require express
const express = require('express');

// initilize app and middleware (adding later) by invoking express function we just required and storing it in the const 'app' for later use 

const app = express(); 
// listen for requests to a specific port number and pass that 

app.listen(3000), () => {
  // adding a console log for now to make sure it's working...
  console.log('app is listening on port 3000');
}

// set up route handlers
  // get request handler for requests sent to the port we are listening to (3000)
  app.get('/books', (req, res) => {
    // send back a json response to whoever is sending the request.
    res.json({mssg: 'welcome to the api!'})
  })

  // install nodemon. run 'nodemon app' command to start dev server and run app. go to http://localhost:3000/books in browser to see output  
