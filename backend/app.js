/**
 * branches
 * brands
 * customers
 * employees
 * inventory
 * memberships
 * reviews
 * sales
 * watches
 */

//import necessary modules
import express from 'express';

import branchesRoutes from './src/routes/branchesRoutes.js';
import brandsRoutes from './src/routes/brandsRoutes.js';
import customersRoutes from './src/routes/customersRoutes.js';
import employeesRoutes from './src/routes/employeesRoutes.js';
import membershipsRoutes from './src/routes/membershipsRoutes.js';
import reviewsRoutes from './src/routes/reviewsRoutes.js';
import salesRoutes from './src/routes/salesRoutes.js';
import watchesRoutes from './src/routes/watchesRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';

//Create a new express app instance hola
const app = express();


//middlewares
app.use(express.json());

app.use("/api/branches", branchesRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/memberships", membershipsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/watches", watchesRoutes);

//Define the port for the server
export default app;