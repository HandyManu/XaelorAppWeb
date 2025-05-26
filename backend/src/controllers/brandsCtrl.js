const brandsController = {};

import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';
import brandsModel from "../models/brandsMdl.js";

// Configurar cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret
});

// SELECT
brandsController.getBrands = async (req, res) => {
  const brands = await brandsModel.find();
  res.json(brands);
};

// INSERT (solo una foto)
brandsController.insertBrands = async (req, res) => {
  try {
    const { brandName } = req.body;
    let photos = "";

    // Si se sube un archivo, subirlo a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "brands",
        allowed_formats: ["jpg", "png", "jpeg"]
      });
      photos = result.secure_url;
    }

    const newBrands = new brandsModel({ brandName, photos });
    await newBrands.save();
    res.status(201).json({ message: "Brands saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving brand", error: error.message });
  }
};

// DELETE
brandsController.deleteBrands = async (req, res) => {
  await brandsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Brands deleted" });
};

// UPDATE (solo una foto)
brandsController.updateBrands = async (req, res) => {
  try {
    const { brandName } = req.body;
    let photos;

    // Si se sube un archivo, subirlo a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "brands",
        allowed_formats: ["jpg", "png", "jpeg"]
      });
      photos = result.secure_url;
    } else {
      // Si no se sube nueva foto, mantener la existente
      const currentBrand = await brandsModel.findById(req.params.id);
      if (currentBrand) {
        photos = currentBrand.photo;
      }
    }

    await brandsModel.findByIdAndUpdate(
      req.params.id,
      { brandName, photos },
      { new: true }
    );
    res.json({ message: "Brands updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating brand", error: error.message });
  }
};


export default brandsController;