/** Import Mongo Client **
 * 
 * Import Mongo Client and destructure the { MongoClient } object from the default value that is returned when you require ('mongodb'). 
 * MongoClient is going to allow us to connect to a database. 
 * It will be used inside the `connectToDb` function. 
 * 
 * */
const { MongoClient } = require('mongodb');

/* Initialize the var 'dbConnection' */
let dbConnection;
// change the UN and PW to the correct creds to connect to the DB
let uri = 'mongodb+srv://<username>:<password>@cluster0.mxnbwel.mongodb.net/?retryWrites=true&w=majority'

/** Create the functions needed to communicate with the database **
 * 
 *  Set up exports so you can use the functions in other files 
 * 
 *  Function 1 - Initial connection to the database
 *      -- The connect() method takes in an argument called a connection string that is a special mongodb url for a database. For now use a local connection string.
 *      -- The connect() method is an asynchronous task that will return a promise since it can take some time for the task to complete. Therefore, chain a .then() method that will fire a callback function once the connection is finished.
 *      -- When the callback function fires, you will get access to a value you can call 'client'. This value exists inside the callback function as an argument. 
 *      -- 'client' represents the client that you have just created by connecting to the database. On that client object is a method db() that returns to us an interface through which you can interact with the database that you are connected to. 
 *      -- Extract the client.db() method and store it in a variable called 'dbConnection'. Don't forget to initialize the var 'dbConnection' near the top of the file. You will only update this value after you have connected.
 *      -- Also chain a catch() method to catch any errors if the promise is rejected and define a callback function that will handle the error. For now use a console log that will print out the error. 
 *      -- Pass a callback function argument 'cb' into the connectToDb function. 'cb' will be called after the connection has been established. Then return the callback function and invoke it after 'dbConnection'. do this in the catch block as well but pass in 'err' as an arg.
 * 
 *  Function 2 - Return db connections once you have connected. 
 *      -- This allows us to communicate with the database.
 *      -- The sole purpose of this function is to return a value. This value will be used to communicate with the database to perform CRUD actions. 
 *      -- Return the 'dbConnection' value
 * 
 * */
module.exports = {

  /* Function 1 */
  connectToDb: (cb) => {  
    // old connection string 'mongodb://localhost:27017/bookstore'
    MongoClient.connect(uri)
      .then((client) => {

        dbConnection = client.db();
        return cb();
      })
      .catch(err => { 
        console.log(err);
        return cb(err);
      })
  },
  /* Function 2 */
  // Since you already have the database connection value, you just need to return it here. There is no additional logic you don't need the return keyword or the curly braces
  getDb: () => dbConnection

}