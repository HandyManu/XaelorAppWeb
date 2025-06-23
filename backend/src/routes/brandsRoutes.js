//este archivo sirve para definir que metoos del cud va atener mi ruta /api/products 

import express from "express";
import multer from "multer";
import brandsController  from "../controllers/brandsCtrl.js";

// Configurar carpeta local para guardar imágenes temporalmente
const upload = multer({
    dest: 'public/'
});

const router = express.Router ()

router.route("/")
    .get(brandsController.getBrands)
    .post(upload.single("photos"), brandsController.insertBrands);

router.route("/:id")
    .put(upload.single("photos"), brandsController.updateBrands)
    .delete(brandsController.deleteBrands);

export default router;