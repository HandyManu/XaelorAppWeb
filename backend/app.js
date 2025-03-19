//import necessary modules
import express from 'express';

import employeesRoutes from "./src/routes/employeesRoutes.js";
import branchesRoutes from "./src/routes/branchesRoutes.js";
import salesRoutes from "./src/routes/salesRoutes.js";

//Create a new express app instance
const app = express();


//middlewares
app.use(express.json());

app.use("/api/employees/", employeesRoutes);
app.use("/api/branches/", branchesRoutes);
app.use("/api/sales/", salesRoutes);


//Define the port for the server
export default app;