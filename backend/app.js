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
import cors from "cors";

import branchesRoutes from './src/routes/branchesRoutes.js';
import brandsRoutes from './src/routes/brandsRoutes.js';
import customersRoutes from './src/routes/customersRoutes.js';
import employeesRoutes from './src/routes/employeesRoutes.js';
import membershipsRoutes from './src/routes/membershipsRoutes.js';
import reviewsRoutes from './src/routes/reviewsRoutes.js';
import salesRoutes from './src/routes/salesRoutes.js';
import watchesRoutes from './src/routes/watchesRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import cookieParser from 'cookie-parser';
import loginRoutes from './src/routes/logIn.js';
import logoutRoutes from "./src/routes/logout.js";
import { validateAuthToken } from './src/middlewares/validateAuthToken.js';
import passwordRecoveryRoutes from './src/routes/passRecoverRoutes.js';

//Create a new express app instance hola
const app = express();


//middlewares
app.use(express.json());
app.use(cookieParser());

//MiddleWares 
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"], //Permitir solicitudes desde el frontend
        //Permitir envío de cookies y credenciales
        credentials: true,
    })
)
app.use("/api/branches",validateAuthToken(["admin"]), branchesRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/customers",validateAuthToken(["admin","employee"]), customersRoutes);
app.use("/api/employees",validateAuthToken(["admin"]), employeesRoutes);
app.use("/api/inventories",validateAuthToken(["admin","employee"]), inventoryRoutes);
app.use("/api/memberships", membershipsRoutes);//las restricciones de authToken se manejan individualmente en las rutas
app.use("/api/reviews",validateAuthToken(["customer","admin","employee"]), reviewsRoutes);
app.use("/api/sales",validateAuthToken(["admin","employee"]), salesRoutes);
app.use("/api/watches", watchesRoutes);//las restricciones de authToken se manejan individualmente en las rutas
app.use("/api/login", loginRoutes);
app.use("/api/logout",logoutRoutes);
app.use("/api/passwordRecovery", passwordRecoveryRoutes);

//Define the port for the server
export default app;