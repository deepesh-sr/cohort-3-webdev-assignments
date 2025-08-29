//  Create a middleware that logs all incoming requests to the console.

const express = require('express');
const app = express();

function logRequests(req, res, next) {
    // write the logic for request log here
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    
    console.log(`${method} ${url} - ${timestamp}`);
    
    next(); // Important: Call next() to continue to the next middleware/route
}

app.use(logRequests);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello, world!' });
});

module.exports = app;
