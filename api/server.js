// implement your server here
// require your posts router and connect it here

//Imports
const express = require('express');
const postsRouter = require('./posts/posts-router');


//Instance Of Express App
const server = express();


//Global Middlewarw
server.use(express.json());


//Consuming
server.use('/api/posts', postsRouter);


//Endpoints; Catchall
server.use('*', (req, res) => {
    res.status(404).json({
        message: 'Sorry, Not Found'
    })
});


//Exports; Exposing
module.exports = server;