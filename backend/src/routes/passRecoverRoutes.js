import express from 'express';
import passwordRecoveryCtrl from '../controllers/passwordRecoveryCtrl.js';

const router = express.Router();

router.route("/requestCode").post(passwordRecoveryCtrl.requestCode);
router.route("/verifyCode").post(passwordRecoveryCtrl.verifyCode);
router.route("/newPassword").post(passwordRecoveryCtrl.newPassword);

export default router;