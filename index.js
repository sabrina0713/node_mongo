var http = require('http');
var express = require('express');
var app = express();
var request = require("request");
const appInsights = require("applicationinsights");
appInsights.setup("1de9ff39-9194-42fb-8a1f-d1989cb6dbab");
     
appInsights.start();
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
var mysql = require('mysql');
var manytimes = 0;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  client.trackNodeHttpRequest({request: req, response: res}); // 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/pooling', function (req, res) {
    res.send('pooling');
    //mlabconnection();
    //poolingConnection();
})
app.get('/cors', function (req, res) {
    var options = {
        method: 'GET',
        url: 'https://lpspring.azurewebsites.net',
        headers:
        {
            'postman-token': '403fd766-68f7-7a56-f248-caa6b2b49e25',
            'cache-control': 'no-cache'
        },
        form: { req1: 'test' }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log("result from "+ url + body);
    });

    })
app.post('/testing', function (req, res) {
  const body = req.body.req1;
  res.set('Content-Type', 'text/plain')
  res.send(`You sent: ${body} to Express`)
})

var port = process.env.PORT || 9000;
app.listen(port);
function mlabconnection()
{
    let mongoDB = "mongodb://limarlow:lipi5961@ds041167.mlab.com:41167/lptestmongodb";
    // Use connect method to connect to the server
    MongoClient.connect(mongoDB, function (err, client) {
        //assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db('lptestmongodb');
        insertDocuments(db, function () {
            client.close();
        });
        client.close();
    });
    


    
}
const insertDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}
function poolingConnection()
{
    console.log("inside poolingconnection")
   // console.log('pooling2: ', mysql._allConnections.length, ', Queued Connections: ', mysql._connectionQueue.length, ', Free Connections: ', mysql._freeConnections.length);
    var pool = mysql.createPool({ connectionLimit : 10, host: "limarlow.mysql.database.azure.com", user: "limarlow@limarlow", password: "F0rtest0nly", database: "limarlowtest", port: 3306 });
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
      
        // Use the connection
        connection.query('SELECT * FROM inventory', function (error, results, fields) {
          // When done with the connection, release it.
         
      
          // Handle error after the release.
          if (error) throw error;
      
          // Don't use the connection here, it has been returned to the pool.
        })
        connection.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['banana', 150],
        function (err, results, fields) {
            //connection.release();
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
            
        })
        connection.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['orange', 154],
        function (err, results, fields) {
            if (err) throw err;
            console.log('Inserted ' + results.affectedRows + ' row(s).');
            //connection.release();
        })
       connection.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['apple', 100],
        function (err, results, fields) {
            if (err) throw err;
            console.log('Inserted ' + results.affectedRows + ' row(s).');
            //connection.release();
        })
        //console.log('poolinginside: ', mysql._allConnections.length, ', Queued Connections: ', mysql._connectionQueue.length, ', Free Connections: ', mysql._freeConnections.length);
        connection.release();
      });
       /*mysql.on('connection', function (connection) {
        manytimes=manytimes+1;
        console.log("called" + manytimes+ + "times");
        var max_conn = 100;
        // -- checking connections used length by percentage to trigger manual kill threads
        
          console.log('pooling2: ', mysql._allConnections.length, ', Queued Connections: ', mysql._connectionQueue.length, ', Free Connections: ', mysql._freeConnections.length);
          //killStaleThreads();
        
      }); */
}
function connectFirstTime() {
    console.log("inside connectFirstTime")
    var conn = mysql.createConnection({ host: "limarlow.mysql.database.azure.com", user: "limarlow@limarlow", password: "F0rtest0nly", database: "limarlowtest", port: 3306 });

    conn.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        queryDatabase(conn);

    });
    function queryDatabase(conn) {
        conn.query('DROP TABLE IF EXISTS inventory;', function (err, results, fields) {
            if (err) throw err;
            console.log('Dropped inventory table if existed.');
        })
        conn.query('CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);',
            function (err, results, fields) {
                if (err) throw err;
                console.log('Created inventory table.');
            })
        conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['banana', 150],
            function (err, results, fields) {
                if (err) throw err;
                else console.log('Inserted ' + results.affectedRows + ' row(s).');
            })
        conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['orange', 154],
            function (err, results, fields) {
                if (err) throw err;
                console.log('Inserted ' + results.affectedRows + ' row(s).');
            })
        conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['apple', 100],
            function (err, results, fields) {
                if (err) throw err;
                console.log('Inserted ' + results.affectedRows + ' row(s).');
            })
        conn.end(function (err) {
            if (err) throw err;
            else console.log('Done.')
        });
    };
};
    console.log("Server running at http://localhost:%d", port);



