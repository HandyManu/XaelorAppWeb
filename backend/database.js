//importar la libreria mongoose 
import mongoose from "mongoose";
import { config } from "./src/config.js";

//Guardo en una constante la url de mi base de datos

mongoose.connect(config.db.URI);

//Creo una constante que es igual a la conexión 
const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB database connection established successfully :D");
});


connection.on("disconnected", () => { console.log("MongoDB connection disconnected") });

connection.on("error", (err) => { console.log("MongoDB connection error: ", err) });

