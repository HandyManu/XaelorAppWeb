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

// INSERT
brandsController.insertBrands = async (req, res) => {
  try {
    const { brandName } = req.body;
        let photos = "";

    // Si se suben archivos, subirlos a Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "brands",
          allowed_formats: ["jpg", "png", "jpeg"]
        });
        photos.push(result.secure_url);
      }
    }

    const newBrands = new brandsModel({ brandName, photos });
    await newBrands.save();
    res.json({ message: "Brands saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving brand", error: error.message });
  }
};

// DELETE
brandsController.deleteBrands = async (req, res) => {
  await brandsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Brands deleted" });
};

// UPDATE
brandsController.updateBrands = async (req, res) => {
  try {
    const { brandName } = req.body;
        let photos = "";

    // Si se suben archivos, subirlos a Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "brands",
          allowed_formats: ["jpg", "png", "jpeg"]
        });
        photos.push(result.secure_url);
      }
    } else {
      // Si no se suben nuevas fotos, mantener las existentes
      const currentBrand = await brandsModel.findById(req.params.id);
      if (currentBrand) {
        photos = currentBrand.photos;
      }
    }

    const updateBrands = await brandsModel.findByIdAndUpdate(
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