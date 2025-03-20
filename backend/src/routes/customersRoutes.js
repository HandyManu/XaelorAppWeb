//* CUSTOMERS ACCESS ROUTES

import express from "express";
import customersCtrl from "../controllers/customersCtrl.js";

const router = express.Router()

router.route("/")
    .get(customersCtrl.getCustomers)
    .post(customersCtrl.postCustomer)

router.route("/:id")
    .put(customersCtrl.putCustomer)
    .delete(customersCtrl.deleteCustomer)

export default router;