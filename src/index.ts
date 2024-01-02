// Import necessary modules for creating an Express server
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
// import modules for mongo database
import mongoose from 'mongoose';
// Create an instance of the Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) with credentials support
app.use(cors({
    credentials: true,
}));

/* Enable compression middleware to gzip responses, Parse incoming cookies 
using cookie-parser middleware, and request bodies using body-parser middleware */
app.use(compression());
app.use(cookieParser());
app.use(bodyParser());

// Create an HTTP server using the Express application
const server = http.createServer(app);

// Server listen to port number 8080
server.listen(8080,() => {
    console.log('Server running on http://localhost:8080');
});

//Connection to database
const MONGO_URL = 'mongodb://niggly:balls@localhost:27017';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));