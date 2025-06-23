//* CUSTOMERS ACCESS ROUTES

import express from "express";
import membershipsCtrl from "../controllers/membershipsCtrl.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = express.Router()

router.route("/")
    .get(membershipsCtrl.getMemberships)
    .post(validateAuthToken(["admin","employee"]),membershipsCtrl.postMembership)

router.route("/:id")
    .put(validateAuthToken(["admin","employee"]),membershipsCtrl.putMembership)
    .delete(validateAuthToken(["admin","employee"]),membershipsCtrl.deleteMembership)

export default router;