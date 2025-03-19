//import necessary modules
import express from 'express';

import employeesRoutes from "./src/routes/employeesRoutes.js";
import branchesRoutes from "./src/routes/branchesRoutes.js";
import salesRoutes from "./src/routes/salesRoutes.js";

import brandsRoutes from "./src/routes/brandsRoutes.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";
import reviewRoutes from "./src/routes/reviewsRoutes.js";



//Create a new express app instance
const app = express();


//middlewares
app.use(express.json());

app.use("/api/employees/", employeesRoutes);
app.use("/api/branches/", branchesRoutes);
app.use("/api/sales/", salesRoutes);

app.use("/api/brands",brandsRoutes);
app.use("/api/inventory",inventoryRoutes);
app.use("/api/review",reviewRoutes);



//Define the port for the server
export default app;