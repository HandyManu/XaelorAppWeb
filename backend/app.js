//import necessary modules
import express from 'express';

//Create a new express app instance
const app = express();

//middlewares
app.use(express.json());

//Define the port for the server
export default app;