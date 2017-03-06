var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = {
  database: 'phi', // the name of the database
  host: 'localhost', // where is your database
  port: 5432, // the port number for your database
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 // 30 seconds to try to connect
};

var pool = new pg.Pool(config);



router.get('/', function(req, res){
  // This will be replaced with a SELECT statement to SQL
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('SELECT * FROM "tasks";', function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});

router.post('/new', function(req, res){
  var newTask = req.body;
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' get stuff!!!!!
      client.query('INSERT INTO tasks (description, status) VALUES ($1, $2);',
      [newTask.description, newTask.status],
      function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
});

// -> /delete/id
router.delete('/delete/:id', function(req, res){
  var taskId = req.params.id;
  // DELETE FROM books WHERE id=44;
  console.log('task id to delete: ', taskId);
  // Connecting to, and deleting row from the database
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' delete stuff!!!!!
      client.query('DELETE FROM tasks WHERE id=$1;', // This is the SQL query
      [taskId], // This is the array of things that replaces the $1 in the query
      function(errorMakingQuery, result){ // This is the function that runs after the query takes place
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(202);
        }
      });
    }
  });
}); // closing delete request


// for update -> /save/id
router.put('/save/:id', function(req, res){
  var taskId = req.params.id;
  var taskObject = req.body;
  // UPDATE tasks SET description=' ' WHERE id='';
  console.log('task of id to save: ', taskId);
  // Connecting to, and deleting row from the database
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' update stuff!!!!!
      client.query('UPDATE tasks SET description=$1, status=$2 WHERE id=$3;', // This is the SQL query
      [taskObject.task, taskObject.status, taskId], // This is the array of things that replaces the $1, $2, $3 in the query
      function(errorMakingQuery, result){ // This is the function that runs after the query takes place
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(202);
        }
      });
    }
  });
}); // closing put request


module.exports = router;
