//este archivo sirve para definir que metoos del cud va atener mi ruta /api/products 

import express from "express";
import brandsController  from "../controllers/brandsCtrl.js";

const router = express.Router ()

router.route("/").get(brandsController.getBrands)
.post(brandsController.insertBrands)

router.route("/:id")
.put(brandsController.updateBrands)
.delete(brandsController.deleteBrands)

export default router;