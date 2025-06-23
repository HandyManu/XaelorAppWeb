import express from "express";
import registerClientsController
from "../controllers/registerCustomerCtrl.js";

const router = express.Router();

router.route("/").post(registerClientsController.register);
router.route("/verifyCodeEmail").post(registerClientsController.verifyCodeEmail);

export default router;