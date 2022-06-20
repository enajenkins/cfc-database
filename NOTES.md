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