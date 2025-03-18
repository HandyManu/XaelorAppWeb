//* Import the app.js file
import app from './app.js';
import { config } from './src/config.js';
// Import the database.js file
import "./database.js";

//*Create a sever function
async function main() {
   const PORT = config.server.PORT;
   app.listen(PORT);
   console.log(`El servidor se corre en tí...`);
}

//*Execute the main function
main();