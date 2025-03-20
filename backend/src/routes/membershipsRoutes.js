//* CUSTOMERS ACCESS ROUTES

import express from "express";
import membershipsCtrl from "../controllers/membershipsCtrl.js";

const router = express.Router()

router.route("/")
    .get(membershipsCtrl.getMemberships)
    .post(membershipsCtrl.postMembership)

router.route("/:id")
    .put(membershipsCtrl.putMembership)
    .delete(membershipsCtrl.deleteMembership)

export default router;