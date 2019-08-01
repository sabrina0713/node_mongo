var http = require('http');
var express = require('express');
var app = express();
var request = require("request");

     
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

app.post('/testing', function (req, res) {
  const body = req.body.req;
  res.set('Content-Type', 'text/plain')
  res.send(`You sent: ${body} to Express`)
})

var port = process.env.PORT || 9000;
app.listen(port);

console.log("Server running at http://localhost:%d", port);



